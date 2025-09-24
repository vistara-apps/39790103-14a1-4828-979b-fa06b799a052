import { useEffect, useState } from 'react';
import { useWalletClient, useAccount, useBalance } from 'wagmi';
import { x402Client, X402PaymentRequest, X402PaymentResponse, USDC_CONTRACT_ADDRESS } from '../x402-axios';
import { base } from 'viem/chains';

export interface PaymentError {
  code: string;
  message: string;
  details?: any;
}

export interface PaymentState {
  isLoading: boolean;
  error: PaymentError | null;
  lastPayment: X402PaymentResponse | null;
}

export function useX402Payment() {
  const { data: walletClient } = useWalletClient();
  const { address, isConnected } = useAccount();
  const [paymentState, setPaymentState] = useState<PaymentState>({
    isLoading: false,
    error: null,
    lastPayment: null,
  });

  // Get USDC balance
  const { data: usdcBalance, refetch: refetchBalance } = useBalance({
    address,
    token: USDC_CONTRACT_ADDRESS as `0x${string}`,
    chainId: base.id,
  });

  // Set wallet client in x402 client when available
  useEffect(() => {
    if (walletClient) {
      x402Client.setWalletClient(walletClient);
    }
  }, [walletClient]);

  const executePayment = async (paymentRequest: X402PaymentRequest): Promise<X402PaymentResponse> => {
    if (!isConnected || !walletClient) {
      const error: PaymentError = {
        code: 'WALLET_NOT_CONNECTED',
        message: 'Please connect your wallet to make payments',
      };
      setPaymentState(prev => ({ ...prev, error }));
      throw error;
    }

    setPaymentState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Check USDC balance before payment
      if (usdcBalance && parseFloat(paymentRequest.amount) > parseFloat(usdcBalance.formatted)) {
        const error: PaymentError = {
          code: 'INSUFFICIENT_BALANCE',
          message: `Insufficient USDC balance. Required: ${paymentRequest.amount}, Available: ${usdcBalance.formatted}`,
        };
        setPaymentState(prev => ({ ...prev, isLoading: false, error }));
        throw error;
      }

      // Execute the payment using the x402 client
      const paymentResponse = await x402Client.executeUSDCPayment(paymentRequest);
      
      setPaymentState(prev => ({
        ...prev,
        isLoading: false,
        lastPayment: paymentResponse,
      }));

      // Refetch balance after payment
      refetchBalance();

      return paymentResponse;
    } catch (error: any) {
      const paymentError: PaymentError = {
        code: error.code || 'PAYMENT_FAILED',
        message: error.message || 'Payment execution failed',
        details: error,
      };
      
      setPaymentState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: paymentError,
      }));
      
      throw paymentError;
    }
  };

  const checkPaymentStatus = async (transactionHash: string) => {
    try {
      return await x402Client.checkPaymentStatus(transactionHash);
    } catch (error) {
      console.error('Failed to check payment status:', error);
      return 'failed';
    }
  };

  const clearError = () => {
    setPaymentState(prev => ({ ...prev, error: null }));
  };

  return {
    // State
    isLoading: paymentState.isLoading,
    error: paymentState.error,
    lastPayment: paymentState.lastPayment,
    usdcBalance: usdcBalance?.formatted || '0',
    
    // Actions
    executePayment,
    checkPaymentStatus,
    clearError,
    
    // Wallet state
    isConnected,
    address,
  };
}