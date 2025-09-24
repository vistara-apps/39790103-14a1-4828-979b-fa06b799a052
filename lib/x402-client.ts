import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { createPublicClient, createWalletClient, custom, formatUnits, parseUnits, Address, Hash } from 'viem'
import { base, baseSepolia } from 'viem/chains'
import { USDC_ADDRESSES, PAYMENT_AMOUNT } from './wagmi-config'

// ERC-20 ABI for USDC transfer
const ERC20_ABI = [
  {
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  }
] as const

export interface PaymentProof {
  txHash: Hash
  from: Address
  to: Address
  amount: string
  timestamp: number
  chainId: number
}

export interface X402Response {
  paymentAddress: Address
  paymentAmount: string
  chainId: number
  currency: string
  description: string
}

export class X402Client {
  private walletClient: any
  private publicClient: any
  private chainId: number

  constructor(walletClient: any, chainId: number = base.id) {
    this.walletClient = walletClient
    this.chainId = chainId
    
    // Create public client for the specified chain
    const chain = chainId === base.id ? base : baseSepolia
    this.publicClient = createPublicClient({
      chain,
      transport: custom(window.ethereum!)
    })
  }

  async makeRequest<T = any>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await axios(config)
      return response.data
    } catch (error) {
      if (this.is402Error(error)) {
        const paymentInfo = this.extractPaymentInfo(error)
        const paymentProof = await this.handlePayment(paymentInfo)
        
        // Retry request with payment proof
        const retryConfig = {
          ...config,
          headers: {
            ...config.headers,
            'X-Payment-Proof': JSON.stringify(paymentProof)
          }
        }
        
        const response = await axios(retryConfig)
        return response.data
      }
      throw error
    }
  }

  private is402Error(error: unknown): error is AxiosError {
    return (
      error instanceof AxiosError &&
      error.response?.status === 402
    )
  }

  private extractPaymentInfo(error: AxiosError): X402Response {
    const response = error.response?.data as X402Response
    if (!response || !response.paymentAddress) {
      throw new Error('Invalid 402 Payment Required response')
    }
    return response
  }

  async handlePayment(paymentInfo: X402Response): Promise<PaymentProof> {
    if (!this.walletClient) {
      throw new Error('Wallet client not available')
    }

    // Get the account address
    const [account] = await this.walletClient.getAddresses()
    if (!account) {
      throw new Error('No wallet account available')
    }

    // Check USDC balance
    const usdcAddress = USDC_ADDRESSES[this.chainId as keyof typeof USDC_ADDRESSES]
    const balance = await this.publicClient.readContract({
      address: usdcAddress,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [account]
    })

    const requiredAmount = parseUnits(paymentInfo.paymentAmount, 6)
    if (balance < requiredAmount) {
      throw new Error(`Insufficient USDC balance. Required: ${formatUnits(requiredAmount, 6)} USDC, Available: ${formatUnits(balance, 6)} USDC`)
    }

    // Execute USDC transfer
    const txHash = await this.walletClient.writeContract({
      address: usdcAddress,
      abi: ERC20_ABI,
      functionName: 'transfer',
      args: [paymentInfo.paymentAddress, requiredAmount],
      account
    })

    // Wait for transaction confirmation
    const receipt = await this.publicClient.waitForTransactionReceipt({
      hash: txHash,
      confirmations: 2
    })

    if (receipt.status !== 'success') {
      throw new Error('Payment transaction failed')
    }

    return {
      txHash,
      from: account,
      to: paymentInfo.paymentAddress,
      amount: paymentInfo.paymentAmount,
      timestamp: Date.now(),
      chainId: this.chainId
    }
  }

  async checkUSDCBalance(address: Address): Promise<string> {
    const usdcAddress = USDC_ADDRESSES[this.chainId as keyof typeof USDC_ADDRESSES]
    const balance = await this.publicClient.readContract({
      address: usdcAddress,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [address]
    })
    
    return formatUnits(balance, 6)
  }

  async verifyPayment(paymentProof: PaymentProof): Promise<boolean> {
    try {
      const receipt = await this.publicClient.getTransactionReceipt({
        hash: paymentProof.txHash
      })
      
      return receipt.status === 'success' && receipt.blockNumber !== null
    } catch (error) {
      console.error('Error verifying payment:', error)
      return false
    }
  }
}

// Factory function to create X402 client
export function createX402Client(walletClient: any, chainId?: number): X402Client {
  return new X402Client(walletClient, chainId)
}