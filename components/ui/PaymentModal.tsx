'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWalletClient, useChainId } from 'wagmi';
import { useConnect, useDisconnect } from 'wagmi';
import { X, Wallet, CreditCard, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { PrimaryButton } from './PrimaryButton';
import { createX402Client, PaymentProof } from '@/lib/x402-client';
import { PAYMENT_AMOUNT } from '@/lib/wagmi-config';
import { formatUnits } from 'viem';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentComplete: (paymentProof: PaymentProof) => void;
  paymentDetails: {
    amount: string;
    description: string;
    recipient: string;
  };
}

type PaymentStep = 'connect' | 'confirm' | 'processing' | 'success' | 'error';

export function PaymentModal({ 
  isOpen, 
  onClose, 
  onPaymentComplete, 
  paymentDetails 
}: PaymentModalProps) {
  const [currentStep, setCurrentStep] = useState<PaymentStep>('connect');
  const [error, setError] = useState<string | null>(null);
  const [paymentProof, setPaymentProof] = useState<PaymentProof | null>(null);
  const [usdcBalance, setUsdcBalance] = useState<string>('0');

  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const chainId = useChainId();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(isConnected ? 'confirm' : 'connect');
      setError(null);
      setPaymentProof(null);
    }
  }, [isOpen, isConnected]);

  // Check USDC balance when wallet is connected
  useEffect(() => {
    async function checkBalance() {
      if (address && walletClient) {
        try {
          const x402Client = createX402Client(walletClient, chainId);
          const balance = await x402Client.checkUSDCBalance(address);
          setUsdcBalance(balance);
        } catch (err) {
          console.error('Error checking USDC balance:', err);
          setUsdcBalance('0');
        }
      }
    }

    checkBalance();
  }, [address, walletClient, chainId]);

  const handleConnect = async (connector: any) => {
    try {
      await connect({ connector });
      setCurrentStep('confirm');
    } catch (err) {
      setError('Failed to connect wallet');
    }
  };

  const handlePayment = async () => {
    if (!walletClient || !address) {
      setError('Wallet not connected');
      return;
    }

    setCurrentStep('processing');
    setError(null);

    try {
      const x402Client = createX402Client(walletClient, chainId);
      
      // Simulate making the API request that triggers payment
      const paymentInfo = {
        paymentAddress: paymentDetails.recipient as `0x${string}`,
        paymentAmount: paymentDetails.amount,
        chainId,
        currency: 'USDC',
        description: paymentDetails.description
      };

      // Process payment
      const proof = await x402Client.handlePayment(paymentInfo);
      
      setPaymentProof(proof);
      setCurrentStep('success');
      
      // Call the callback with payment proof
      onPaymentComplete(proof);
      
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed');
      setCurrentStep('error');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'connect':
        return (
          <div className="space-y-4">
            <div className="text-center">
              <Wallet className="w-16 h-16 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
              <p className="text-secondary-text">
                Connect your wallet to make the payment and access premium content
              </p>
            </div>
            
            <div className="space-y-3">
              {connectors.map((connector) => (
                <PrimaryButton
                  key={connector.id}
                  onClick={() => handleConnect(connector)}
                  className="w-full justify-center"
                >
                  Connect {connector.name}
                </PrimaryButton>
              ))}
            </div>
          </div>
        );

      case 'confirm':
        const hasEnoughBalance = parseFloat(usdcBalance) >= parseFloat(paymentDetails.amount);
        
        return (
          <div className="space-y-4">
            <div className="text-center">
              <CreditCard className="w-16 h-16 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Confirm Payment</h3>
              <p className="text-secondary-text">
                {paymentDetails.description}
              </p>
            </div>

            <div className="bg-surface border border-border rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-secondary-text">Amount:</span>
                <span className="font-semibold">{paymentDetails.amount} USDC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-text">Your Balance:</span>
                <span className={`font-semibold ${hasEnoughBalance ? 'text-accent' : 'text-red-500'}`}>
                  {parseFloat(usdcBalance).toFixed(2)} USDC
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-text">Network:</span>
                <span className="font-semibold">Base</span>
              </div>
            </div>

            {!hasEnoughBalance && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <p className="text-red-800 text-sm font-medium">Insufficient Balance</p>
                  <p className="text-red-600 text-sm">
                    You need at least {paymentDetails.amount} USDC to complete this payment.
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <PrimaryButton
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </PrimaryButton>
              <PrimaryButton
                onClick={handlePayment}
                disabled={!hasEnoughBalance}
                className="flex-1"
              >
                Pay {paymentDetails.amount} USDC
              </PrimaryButton>
            </div>
          </div>
        );

      case 'processing':
        return (
          <div className="text-center space-y-4">
            <Loader2 className="w-16 h-16 text-accent mx-auto animate-spin" />
            <h3 className="text-xl font-semibold">Processing Payment</h3>
            <p className="text-secondary-text">
              Please confirm the transaction in your wallet and wait for confirmation...
            </p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h3 className="text-xl font-semibold text-green-700">Payment Successful!</h3>
            <p className="text-secondary-text">
              Your payment has been confirmed. You now have access to premium content.
            </p>
            
            {paymentProof && (
              <div className="bg-surface border border-border rounded-lg p-4 text-left">
                <p className="text-sm font-medium mb-2">Transaction Details:</p>
                <p className="text-xs text-secondary-text break-all">
                  {paymentProof.txHash}
                </p>
              </div>
            )}

            <PrimaryButton onClick={onClose} className="w-full">
              Continue
            </PrimaryButton>
          </div>
        );

      case 'error':
        return (
          <div className="text-center space-y-4">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
            <h3 className="text-xl font-semibold text-red-700">Payment Failed</h3>
            <p className="text-secondary-text">
              {error || 'An error occurred during payment processing.'}
            </p>
            
            <div className="flex gap-3">
              <PrimaryButton
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </PrimaryButton>
              <PrimaryButton
                onClick={() => setCurrentStep('confirm')}
                className="flex-1"
              >
                Try Again
              </PrimaryButton>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold">Payment Required</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-surface transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {renderStep()}
        </div>
      </div>
    </div>
  );
}