import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { WalletClient } from 'viem';
import { parseUnits, formatUnits } from 'viem';
import { base } from 'viem/chains';

// USDC contract address on Base
export const USDC_CONTRACT_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

export interface X402PaymentRequest {
  amount: string; // Amount in USDC
  recipient: string; // Recipient address
  paymentId: string; // Unique payment identifier
  description?: string;
}

export interface X402PaymentResponse {
  transactionHash: string;
  status: 'pending' | 'confirmed' | 'failed';
  amount: string;
  recipient: string;
  paymentId: string;
}

export class X402AxiosClient {
  private axiosInstance: AxiosInstance;
  private walletClient: WalletClient | null = null;

  constructor(baseURL: string = 'https://api.healthconnect.app') {
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 30000,
    });

    // Add response interceptor to handle 402 Payment Required
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 402) {
          return this.handle402Payment(error);
        }
        return Promise.reject(error);
      }
    );
  }

  setWalletClient(walletClient: WalletClient | null) {
    this.walletClient = walletClient;
  }

  private async handle402Payment(error: any): Promise<AxiosResponse> {
    if (!this.walletClient) {
      throw new Error('Wallet client not available for payment');
    }

    const paymentInfo = error.response?.headers['payment-required'];
    if (!paymentInfo) {
      throw new Error('Payment information not provided in 402 response');
    }

    try {
      // Parse payment information from header
      const paymentData = JSON.parse(paymentInfo);
      
      // Execute USDC payment
      const paymentResponse = await this.executeUSDCPayment({
        amount: paymentData.amount,
        recipient: paymentData.recipient,
        paymentId: paymentData.paymentId,
        description: paymentData.description,
      });

      // Retry original request with payment proof
      const originalRequest = error.config;
      originalRequest.headers['Payment-Proof'] = JSON.stringify(paymentResponse);
      
      return this.axiosInstance.request(originalRequest);
    } catch (paymentError: any) {
      throw new Error(`Payment failed: ${paymentError?.message || 'Unknown error'}`);
    }
  }

  async executeUSDCPayment(payment: X402PaymentRequest): Promise<X402PaymentResponse> {
    if (!this.walletClient || !this.walletClient.account) {
      throw new Error('Wallet client or account not available');
    }

    try {
      // Convert amount to proper decimals (USDC has 6 decimals)
      const amountInWei = parseUnits(payment.amount, 6);

      // Prepare USDC transfer transaction
      const hash = await this.walletClient.writeContract({
        address: USDC_CONTRACT_ADDRESS as `0x${string}`,
        abi: [
          {
            name: 'transfer',
            type: 'function',
            stateMutability: 'nonpayable',
            inputs: [
              { name: 'to', type: 'address' },
              { name: 'amount', type: 'uint256' },
            ],
            outputs: [{ name: '', type: 'bool' }],
          },
        ] as const,
        functionName: 'transfer',
        args: [payment.recipient as `0x${string}`, amountInWei],
        account: this.walletClient.account,
        chain: base,
      });

      return {
        transactionHash: hash,
        status: 'pending',
        amount: payment.amount,
        recipient: payment.recipient,
        paymentId: payment.paymentId,
      };
    } catch (error: any) {
      throw new Error(`USDC payment execution failed: ${error?.message || 'Unknown error'}`);
    }
  }

  // Check transaction confirmation status
  async checkPaymentStatus(transactionHash: string): Promise<'pending' | 'confirmed' | 'failed'> {
    try {
      const response = await this.axiosInstance.get(`/payment/status/${transactionHash}`);
      return response.data.status;
    } catch (error) {
      console.error('Failed to check payment status:', error);
      return 'failed';
    }
  }

  // Standard axios methods with x402 support
  async get(url: string, config?: AxiosRequestConfig) {
    return this.axiosInstance.get(url, config);
  }

  async post(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.axiosInstance.post(url, data, config);
  }

  async put(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.axiosInstance.put(url, data, config);
  }

  async delete(url: string, config?: AxiosRequestConfig) {
    return this.axiosInstance.delete(url, config);
  }
}

// Create a singleton instance
export const x402Client = new X402AxiosClient();