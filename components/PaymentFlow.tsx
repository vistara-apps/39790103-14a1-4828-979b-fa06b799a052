'use client';

import { useState } from 'react';
import { useX402Payment } from '@/lib/hooks/useX402Payment';
import { PrimaryButton } from './ui/PrimaryButton';
import { InFrameNotification } from './ui/InFrameNotification';
import { BottomSheet } from './ui/BottomSheet';
import { CreditCard, DollarSign, Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface PaymentFlowProps {
  isOpen: boolean;
  onClose: () => void;
  amount: string;
  description: string;
  recipientAddress?: string;
}

export function PaymentFlow({ 
  isOpen, 
  onClose, 
  amount, 
  description,
  recipientAddress = '0x742d35Cc6635C0532925a3b8D50f142a9dF8e5d6' // Default recipient
}: PaymentFlowProps) {
  const {
    isLoading,
    error,
    lastPayment,
    usdcBalance,
    executePayment,
    checkPaymentStatus,
    clearError,
    isConnected,
    address
  } = useX402Payment();

  const [paymentStep, setPaymentStep] = useState<'confirm' | 'processing' | 'success' | 'error'>('confirm');
  const [transactionHash, setTransactionHash] = useState<string>('');

  const handlePayment = async () => {
    if (!isConnected) {
      return;
    }

    clearError();
    setPaymentStep('processing');

    try {
      const paymentRequest = {
        amount,
        recipient: recipientAddress,
        paymentId: `payment-${Date.now()}`,
        description,
      };

      const response = await executePayment(paymentRequest);
      setTransactionHash(response.transactionHash);
      setPaymentStep('success');

      // Check transaction status periodically
      const checkStatus = async () => {
        const status = await checkPaymentStatus(response.transactionHash);
        if (status === 'confirmed') {
          console.log('Payment confirmed!');
        } else if (status === 'failed') {
          setPaymentStep('error');
        } else {
          // Check again in 5 seconds
          setTimeout(checkStatus, 5000);
        }
      };

      // Start checking status after 3 seconds
      setTimeout(checkStatus, 3000);

    } catch (err) {
      setPaymentStep('error');
    }
  };

  const handleClose = () => {
    setPaymentStep('confirm');
    setTransactionHash('');
    clearError();
    onClose();
  };

  const renderConfirmStep = () => (
    <div className="space-y-4">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CreditCard className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Confirm Payment</h3>
        <p className="text-secondary-text text-sm">{description}</p>
      </div>

      <div className="bg-bg-secondary rounded-lg p-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-secondary-text">Amount:</span>
          <span className="font-semibold text-lg">{amount} USDC</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-secondary-text">Your Balance:</span>
          <span className="font-medium">{usdcBalance} USDC</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-secondary-text">Network:</span>
          <span className="font-medium">Base</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-secondary-text">Recipient:</span>
          <span className="font-mono text-xs">
            {recipientAddress.slice(0, 6)}...{recipientAddress.slice(-4)}
          </span>
        </div>
      </div>

      {parseFloat(usdcBalance) < parseFloat(amount) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-yellow-800 font-medium">Insufficient Balance</p>
            <p className="text-yellow-700 text-sm">
              You need {(parseFloat(amount) - parseFloat(usdcBalance)).toFixed(2)} more USDC to complete this payment.
            </p>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <PrimaryButton variant="outline" onClick={handleClose} className="flex-1">
          Cancel
        </PrimaryButton>
        <PrimaryButton 
          onClick={handlePayment}
          disabled={!isConnected || parseFloat(usdcBalance) < parseFloat(amount)}
          className="flex-1"
        >
          Pay {amount} USDC
        </PrimaryButton>
      </div>
    </div>
  );

  const renderProcessingStep = () => (
    <div className="text-center space-y-4">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
      <h3 className="text-lg font-semibold">Processing Payment</h3>
      <p className="text-secondary-text text-sm">
        Please confirm the transaction in your wallet and wait for it to be processed on the blockchain.
      </p>
      <div className="bg-bg-secondary rounded-lg p-4">
        <p className="text-sm font-medium mb-2">Transaction Details:</p>
        <p className="text-xs text-secondary-text">Amount: {amount} USDC</p>
        <p className="text-xs text-secondary-text">Network: Base</p>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="text-center space-y-4">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>
      <h3 className="text-lg font-semibold text-green-800">Payment Successful!</h3>
      <p className="text-secondary-text text-sm">
        Your payment of {amount} USDC has been submitted to the blockchain.
      </p>
      
      {transactionHash && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-green-800 font-medium text-sm mb-1">Transaction Hash:</p>
          <p className="text-green-700 text-xs font-mono break-all">
            {transactionHash}
          </p>
          <a
            href={`https://basescan.org/tx/${transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 text-xs underline mt-2 inline-block"
          >
            View on BaseScan
          </a>
        </div>
      )}

      <PrimaryButton onClick={handleClose} className="w-full">
        Done
      </PrimaryButton>
    </div>
  );

  const renderErrorStep = () => (
    <div className="text-center space-y-4">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
        <XCircle className="h-8 w-8 text-red-600" />
      </div>
      <h3 className="text-lg font-semibold text-red-800">Payment Failed</h3>
      <p className="text-secondary-text text-sm">
        {error?.message || 'An error occurred while processing your payment.'}
      </p>
      
      {error?.code === 'INSUFFICIENT_BALANCE' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-800 text-sm">
            Please ensure you have sufficient USDC balance and try again.
          </p>
        </div>
      )}

      <div className="flex gap-3">
        <PrimaryButton variant="outline" onClick={handleClose} className="flex-1">
          Cancel
        </PrimaryButton>
        <PrimaryButton 
          onClick={() => {
            setPaymentStep('confirm');
            clearError();
          }} 
          className="flex-1"
        >
          Try Again
        </PrimaryButton>
      </div>
    </div>
  );

  const renderStep = () => {
    switch (paymentStep) {
      case 'confirm':
        return renderConfirmStep();
      case 'processing':
        return renderProcessingStep();
      case 'success':
        return renderSuccessStep();
      case 'error':
        return renderErrorStep();
      default:
        return renderConfirmStep();
    }
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={handleClose}
      title="USDC Payment"
    >
      <div className="p-4">
        {renderStep()}
      </div>
    </BottomSheet>
  );
}