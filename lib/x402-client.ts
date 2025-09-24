import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'
import { WalletClient, parseUnits, formatUnits, createPublicClient, http } from 'viem'
import { base } from 'viem/chains'

// USDC contract address on Base
const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as const

interface PaymentRequest {
  to: string
  amount: string
  token: string
  chainId: number
}

interface PaymentProof {
  txHash: string
  amount: string
  token: string
  from: string
  to: string
  chainId: number
}

class X402Client {
  private walletClient: WalletClient | null = null
  private publicClient = createPublicClient({
    chain: base,
    transport: http()
  })

  setWalletClient(walletClient: WalletClient) {
    this.walletClient = walletClient
  }

  private async handlePaymentRequired(response: AxiosResponse): Promise<PaymentProof> {
    if (!this.walletClient) {
      throw new Error('Wallet client not set. Please connect your wallet first.')
    }

    const paymentHeader = response.headers['x-payment-required']
    if (!paymentHeader) {
      throw new Error('Invalid payment required response - missing payment header')
    }

    let paymentRequest: PaymentRequest
    try {
      paymentRequest = JSON.parse(paymentHeader)
    } catch (error) {
      throw new Error('Invalid payment request format')
    }

    if (paymentRequest.chainId !== base.id) {
      throw new Error(`Payment required on unsupported chain: ${paymentRequest.chainId}`)
    }

    if (paymentRequest.token.toLowerCase() !== USDC_ADDRESS.toLowerCase()) {
      throw new Error(`Payment required with unsupported token: ${paymentRequest.token}`)
    }

    // Convert amount to proper USDC units (6 decimals)
    const amountInWei = parseUnits(paymentRequest.amount, 6)

    try {
      // First approve the USDC transfer if needed
      const account = this.walletClient.account?.address
      if (!account) {
        throw new Error('No account connected')
      }

      // Check current allowance
      const allowanceData = await this.publicClient.readContract({
        address: USDC_ADDRESS,
        abi: [
          {
            name: 'allowance',
            type: 'function',
            stateMutability: 'view',
            inputs: [
              { name: 'owner', type: 'address' },
              { name: 'spender', type: 'address' }
            ],
            outputs: [{ name: '', type: 'uint256' }]
          }
        ],
        functionName: 'allowance',
        args: [account, paymentRequest.to as `0x${string}`]
      })

      // If allowance is insufficient, approve the transfer
      if (allowanceData < amountInWei) {
        const approveTxHash = await this.walletClient.writeContract({
          address: USDC_ADDRESS,
          abi: [
            {
              name: 'approve',
              type: 'function',
              stateMutability: 'nonpayable',
              inputs: [
                { name: 'spender', type: 'address' },
                { name: 'amount', type: 'uint256' }
              ],
              outputs: [{ name: '', type: 'bool' }]
            }
          ],
          functionName: 'approve',
          args: [paymentRequest.to as `0x${string}`, amountInWei],
          account: account,
          chain: base
        })

        // Wait for approval confirmation
        await this.publicClient.waitForTransactionReceipt({ hash: approveTxHash })
      }

      // Execute the USDC transfer
      const txHash = await this.walletClient.writeContract({
        address: USDC_ADDRESS,
        abi: [
          {
            name: 'transfer',
            type: 'function',
            stateMutability: 'nonpayable',
            inputs: [
              { name: 'to', type: 'address' },
              { name: 'amount', type: 'uint256' }
            ],
            outputs: [{ name: '', type: 'bool' }]
          }
        ],
        functionName: 'transfer',
        args: [paymentRequest.to as `0x${string}`, amountInWei],
        account: account,
        chain: base
      })

      // Wait for transaction confirmation
      const receipt = await this.publicClient.waitForTransactionReceipt({ hash: txHash })

      if (receipt.status !== 'success') {
        throw new Error('Transaction failed')
      }

      return {
        txHash,
        amount: paymentRequest.amount,
        token: paymentRequest.token,
        from: account,
        to: paymentRequest.to,
        chainId: paymentRequest.chainId
      }
    } catch (error) {
      console.error('Payment execution failed:', error)
      throw new Error(`Payment failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async request(config: AxiosRequestConfig): Promise<AxiosResponse> {
    try {
      // First attempt - make the request
      const response = await axios(config)
      return response
    } catch (error: any) {
      // Check if it's a 402 Payment Required error
      if (error.response?.status === 402) {
        console.log('Payment required, initiating payment flow...')
        
        // Handle the payment
        const paymentProof = await this.handlePaymentRequired(error.response)
        
        // Retry the request with payment proof
        const retryConfig = {
          ...config,
          headers: {
            ...config.headers,
            'X-Payment-Proof': JSON.stringify(paymentProof)
          }
        }
        
        return await axios(retryConfig)
      }
      
      // Re-throw other errors
      throw error
    }
  }

  // Convenience methods
  async get(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.request({ ...config, method: 'GET', url })
  }

  async post(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.request({ ...config, method: 'POST', url, data })
  }

  async put(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.request({ ...config, method: 'PUT', url, data })
  }

  async delete(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.request({ ...config, method: 'DELETE', url })
  }
}

// Export a singleton instance
export const x402Client = new X402Client()
export default x402Client