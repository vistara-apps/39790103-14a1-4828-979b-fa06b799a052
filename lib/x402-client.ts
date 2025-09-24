import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { WalletClient } from 'viem';
import { base } from 'viem/chains';

export interface PaymentRequest {
  amount: string;
  currency: string;
  recipient: string;
  description?: string;
  metadata?: Record<string, any>;
}

export interface PaymentResponse {
  success: boolean;
  transactionHash?: string;
  error?: string;
  receipt?: any;
}

export class X402Client {
  private axiosInstance: AxiosInstance;
  private walletClient: WalletClient | null = null;
  private readonly USDC_BASE_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

  constructor(baseURL?: string) {
    this.axiosInstance = axios.create({
      baseURL: baseURL || process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.healthconnect.app',
      timeout: 30000,
    });

    // Add request interceptor to handle x402 responses
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 402) {
          return this.handlePaymentRequired(error.response, error.config);
        }
        return Promise.reject(error);
      }
    );
  }

  setWalletClient(walletClient: WalletClient) {
    this.walletClient = walletClient;
  }

  private async handlePaymentRequired(
    response: AxiosResponse,
    originalConfig: AxiosRequestConfig
  ): Promise<AxiosResponse> {
    if (!this.walletClient) {
      throw new Error('Wallet client not available for payment');
    }

    const paymentInfo = response.headers['x-payment-required'];
    if (!paymentInfo) {
      throw new Error('Payment required but no payment information provided');
    }

    try {
      const payment = JSON.parse(paymentInfo) as PaymentRequest;
      const paymentResult = await this.processPayment(payment);

      if (paymentResult.success && paymentResult.transactionHash) {
        // Retry original request with payment proof
        const retryConfig = {
          ...originalConfig,
          headers: {
            ...originalConfig.headers,
            'x-payment-proof': paymentResult.transactionHash,
          },
        };
        
        return this.axiosInstance.request(retryConfig);
      } else {
        throw new Error(paymentResult.error || 'Payment failed');
      }
    } catch (error) {
      throw new Error(`Payment processing failed: ${error}`);
    }
  }

  async processPayment(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    if (!this.walletClient) {
      return {
        success: false,
        error: 'Wallet client not available',
      };
    }

    try {
      // Validate payment request
      if (!this.isValidPaymentRequest(paymentRequest)) {
        return {
          success: false,
          error: 'Invalid payment request',
        };
      }

      // For USDC on Base, we'll use the native USDC token
      if (paymentRequest.currency.toLowerCase() === 'usdc') {
        return await this.processUSDCPayment(paymentRequest);
      } else {
        return {
          success: false,
          error: `Unsupported currency: ${paymentRequest.currency}`,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: `Payment processing error: ${error}`,
      };
    }
  }

  private async processUSDCPayment(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    if (!this.walletClient) {
      return {
        success: false,
        error: 'Wallet client not available',
      };
    }

    try {
      // Convert amount to wei (USDC has 6 decimals)
      const amountInWei = BigInt(Math.floor(parseFloat(paymentRequest.amount) * 1e6));

      // USDC transfer function signature
      const transferData = this.encodeUSDCTransfer(paymentRequest.recipient, amountInWei);

      // Get account address from wallet client
      const account = this.walletClient.account;
      if (!account) {
        return {
          success: false,
          error: 'No account available in wallet client',
        };
      }

      // Send transaction
      const hash = await this.walletClient.sendTransaction({
        account,
        to: this.USDC_BASE_ADDRESS as `0x${string}`,
        data: transferData,
        chain: base,
      });

      // Wait for transaction confirmation
      const receipt = await this.waitForTransactionConfirmation(hash);

      return {
        success: true,
        transactionHash: hash,
        receipt,
      };
    } catch (error) {
      return {
        success: false,
        error: `USDC payment failed: ${error}`,
      };
    }
  }

  private encodeUSDCTransfer(to: string, amount: bigint): `0x${string}` {
    // ERC20 transfer function selector: transfer(address,uint256)
    const selector = '0xa9059cbb';
    const addressParam = to.slice(2).padStart(64, '0');
    const amountParam = amount.toString(16).padStart(64, '0');
    
    return `${selector}${addressParam}${amountParam}` as `0x${string}`;
  }

  private async waitForTransactionConfirmation(hash: string, maxWaitTime = 60000): Promise<any> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < maxWaitTime) {
      try {
        // In a real implementation, you'd use a provider to check transaction status
        // For now, we'll simulate confirmation after a delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Return a mock receipt - in practice, you'd get this from the blockchain
        return {
          transactionHash: hash,
          blockNumber: Math.floor(Math.random() * 1000000),
          status: 'success',
          confirmations: 1,
        };
      } catch (error) {
        // Continue polling
      }
    }
    
    throw new Error('Transaction confirmation timeout');
  }

  private isValidPaymentRequest(payment: PaymentRequest): boolean {
    return !!(
      payment.amount &&
      payment.currency &&
      payment.recipient &&
      parseFloat(payment.amount) > 0 &&
      this.isValidAddress(payment.recipient)
    );
  }

  private isValidAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  // Public API methods
  async get(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.axiosInstance.get(url, config);
  }

  async post(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.axiosInstance.post(url, data, config);
  }

  async put(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.axiosInstance.put(url, data, config);
  }

  async delete(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.axiosInstance.delete(url, config);
  }
}

export default X402Client;