'use client';

import React, { useState } from 'react';
import { usePaymentService, useUSDCBalance } from '@/lib/payment-service';
import { PaymentRequest } from '@/lib/x402-client';
import { PrimaryButton } from './ui/PrimaryButton';
import { BottomSheet } from './ui/BottomSheet';
import { Wallet, CreditCard, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentRequest?: PaymentRequest;
  onPaymentComplete?: (success: boolean, transactionHash?: string) => void;
}

export function PaymentModal({ 
  isOpen, 
  onClose, 
  paymentRequest,
  onPaymentComplete 
}: PaymentModalProps) {
  const [paymentState, setPaymentState] = useState<'idle' | 'connecting' | 'paying' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [transactionHash, setTransactionHash] = useState<string>('');
  
  const { 
    isConnected, 
    address, 
    connect, 
    disconnect, 
    processPayment 
  } = usePaymentService();
  
  const { balance, loading: balanceLoading, refresh: refreshBalance } = useUSDCBalance();

  const handleConnect = async () => {
    setPaymentState('connecting');
    setErrorMessage('');
    
    try {
      await connect();
      setPaymentState('idle');
    } catch (error) {
      setErrorMessage(`Failed to connect wallet: ${error}`);
      setPaymentState('error');
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      setPaymentState('idle');
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(`Failed to disconnect wallet: ${error}`);
    }
  };

  const handlePayment = async () => {
    if (!paymentRequest) return;

    setPaymentState('paying');
    setErrorMessage('');

    try {
      const result = await processPayment(paymentRequest);
      
      if (result.success && result.transactionHash) {
        setTransactionHash(result.transactionHash);
        setPaymentState('success');
        refreshBalance(); // Refresh balance after payment
        onPaymentComplete?.(true, result.transactionHash);
      } else {
        setErrorMessage(result.error || 'Payment failed');
        setPaymentState('error');
        onPaymentComplete?.(false);
      }
    } catch (error) {
      setErrorMessage(`Payment processing failed: ${error}`);
      setPaymentState('error');
      onPaymentComplete?.(false);
    }
  };

  const handleReset = () => {
    setPaymentState('idle');
    setErrorMessage('');
    setTransactionHash('');
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const renderContent = () => {
    if (!isConnected) {
      return (
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wallet className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
          <p className="text-secondary-text mb-6">
            Connect your Coinbase Wallet to process payments on Base
          </p>
          <PrimaryButton
            onClick={handleConnect}
            disabled={paymentState === 'connecting'}
            className="w-full"
          >
            {paymentState === 'connecting' ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              'Connect Wallet'
            )}
          </PrimaryButton>
        </div>
      );
    }

    if (paymentState === 'success') {
      return (
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-accent" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Payment Successful!</h3>
          <p className="text-secondary-text mb-4">
            Your payment has been processed successfully
          </p>
          {transactionHash && (
            <div className="bg-bg-secondary rounded-lg p-3 mb-4">
              <p className="text-sm text-secondary-text">Transaction Hash:</p>
              <p className="text-sm font-mono break-all">{formatAddress(transactionHash)}</p>
            </div>
          )}
          <div className="flex gap-3">
            <PrimaryButton variant="outline" onClick={handleReset} className="flex-1">
              New Payment
            </PrimaryButton>
            <PrimaryButton onClick={onClose} className="flex-1">
              Close
            </PrimaryButton>
          </div>
        </div>
      );
    }

    if (paymentState === 'error') {
      return (
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="h-8 w-8 text-error" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Payment Failed</h3>
          <p className="text-error text-sm mb-4">{errorMessage}</p>
          <div className="flex gap-3">
            <PrimaryButton variant="outline" onClick={handleReset} className="flex-1">
              Try Again
            </PrimaryButton>
            <PrimaryButton onClick={onClose} className="flex-1">
              Close
            </PrimaryButton>
          </div>
        </div>
      );
    }

    return (
      <div className="p-6">
        {/* Wallet Info */}
        <div className="bg-bg-secondary rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">Connected Wallet</h3>
            <button
              onClick={handleDisconnect}
              className="text-sm text-secondary-text hover:text-primary"
            >
              Disconnect
            </button>
          </div>
          <p className="text-sm text-secondary-text mb-2">
            {address ? formatAddress(address) : 'Unknown'}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-secondary-text">USDC Balance:</span>
            <span className="font-medium">
              {balanceLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                `${balance} USDC`
              )}
            </span>
          </div>
        </div>

        {/* Payment Details */}
        {paymentRequest && (
          <div className="bg-bg-secondary rounded-lg p-4 mb-6">
            <h3 className="font-medium mb-3 flex items-center">
              <CreditCard className="w-4 h-4 mr-2" />
              Payment Details
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-secondary-text">Amount:</span>
                <span className="font-medium">{paymentRequest.amount} {paymentRequest.currency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-text">Recipient:</span>
                <span className="font-mono text-xs">{formatAddress(paymentRequest.recipient)}</span>
              </div>
              {paymentRequest.description && (
                <div className="flex justify-between">
                  <span className="text-secondary-text">Description:</span>
                  <span>{paymentRequest.description}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Payment Action */}
        <PrimaryButton
          onClick={handlePayment}
          disabled={paymentState === 'paying' || !paymentRequest}
          className="w-full"
        >
          {paymentState === 'paying' ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing Payment...
            </>
          ) : (
            `Pay ${paymentRequest?.amount || '0'} ${paymentRequest?.currency || 'USDC'}`
          )}
        </PrimaryButton>

        <p className="text-xs text-secondary-text text-center mt-4">
          Payments are processed on the Base network using USDC
        </p>
      </div>
    );
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Payment Required"
    >
      {renderContent()}
    </BottomSheet>
  );
}