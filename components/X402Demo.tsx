'use client';

import React, { useState } from 'react';
import { PaymentModal } from './PaymentModal';
import { usePaymentService } from '@/lib/payment-service';
import { PaymentRequest } from '@/lib/x402-client';
import { PrimaryButton } from './ui/PrimaryButton';
import { InFrameNotification } from './ui/InFrameNotification';
import { CreditCard, Shield, Zap } from 'lucide-react';

export function X402Demo() {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentPaymentRequest, setCurrentPaymentRequest] = useState<PaymentRequest | undefined>();
  const [notification, setNotification] = useState<{
    type: 'success' | 'info' | 'warning';
    message: string;
  } | null>(null);

  const { makeRequest, isConnected } = usePaymentService();

  const showNotification = (type: 'success' | 'info' | 'warning', message: string) => {
    setNotification({ type, message });
  };

  // Demo payment scenarios
  const demoPayments: PaymentRequest[] = [
    {
      amount: '5.00',
      currency: 'USDC',
      recipient: '0x742A4d0aEE69C00FF8F03085566F3E4B2ad68E21',
      description: 'Premium Health Data Access',
      metadata: { 
        service: 'health-data',
        duration: '1-month' 
      }
    },
    {
      amount: '15.00',
      currency: 'USDC',
      recipient: '0x742A4d0aEE69C00FF8F03085566F3E4B2ad68E21',
      description: 'Professional Network Premium',
      metadata: { 
        service: 'network-premium',
        duration: '3-month' 
      }
    },
    {
      amount: '25.00',
      currency: 'USDC',
      recipient: '0x742A4d0aEE69C00FF8F03085566F3E4B2ad68E21',
      description: 'Campaign Boost Package',
      metadata: { 
        service: 'campaign-boost',
        boost_level: 'premium' 
      }
    }
  ];

  const handlePaymentRequest = (payment: PaymentRequest) => {
    setCurrentPaymentRequest(payment);
    setShowPaymentModal(true);
  };

  const handlePaymentComplete = (success: boolean, transactionHash?: string) => {
    if (success) {
      showNotification('success', `Payment successful! Transaction: ${transactionHash?.slice(0, 10)}...`);
    } else {
      showNotification('warning', 'Payment was cancelled or failed');
    }
    
    setTimeout(() => {
      setShowPaymentModal(false);
      setCurrentPaymentRequest(undefined);
    }, 2000);
  };

  // Simulate making an API request that requires payment (x402)
  const testX402Request = async () => {
    if (!isConnected) {
      showNotification('warning', 'Please connect your wallet first');
      return;
    }

    showNotification('info', 'Making API request...');

    try {
      // Simulate an API call that returns 402 Payment Required
      const response = await makeRequest('/api/premium-data', {
        method: 'GET',
      });

      if (response.ok) {
        const data = await response.json();
        showNotification('success', 'API request successful!');
        console.log('API Response:', data);
      } else {
        showNotification('warning', `API request failed: ${response.status}`);
      }
    } catch (error) {
      showNotification('warning', `API request error: ${error}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* X402 Payment Flow Demo */}
      <div className="bg-primary text-white rounded-lg p-6 mx-4">
        <h2 className="text-xl font-semibold mb-2 flex items-center">
          <Shield className="w-5 h-5 mr-2" />
          X402 Payment Flow Demo
        </h2>
        <p className="text-white/90 mb-4">
          Test the X402 payment-required flow with USDC on Base network
        </p>
        
        <div className="space-y-3">
          <PrimaryButton
            onClick={testX402Request}
            variant="outline"
            className="w-full border-white/20 text-white hover:bg-white/10"
            disabled={!isConnected}
          >
            <Zap className="w-4 h-4 mr-2" />
            Test X402 API Request
          </PrimaryButton>
          
          {!isConnected && (
            <p className="text-white/70 text-sm text-center">
              Connect your wallet to test X402 payments
            </p>
          )}
        </div>
      </div>

      {/* Demo Payment Options */}
      <div className="px-4">
        <h3 className="heading mb-3 flex items-center">
          <CreditCard className="w-5 h-5 mr-2" />
          Demo Payment Scenarios
        </h3>
        <div className="space-y-3">
          {demoPayments.map((payment, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-border p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium">{payment.description}</h4>
                  <p className="text-sm text-secondary-text">
                    {payment.amount} {payment.currency}
                  </p>
                </div>
                <PrimaryButton
                  size="sm"
                  onClick={() => handlePaymentRequest(payment)}
                  disabled={!isConnected}
                >
                  Pay Now
                </PrimaryButton>
              </div>
              
              {payment.metadata && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {Object.entries(payment.metadata).map(([key, value]) => (
                    <span
                      key={key}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-accent/10 text-accent"
                    >
                      {key}: {value}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {!isConnected && (
          <p className="text-secondary-text text-sm text-center mt-4">
            Connect your wallet to test payments
          </p>
        )}
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        paymentRequest={currentPaymentRequest}
        onPaymentComplete={handlePaymentComplete}
      />

      {/* Notifications */}
      {notification && (
        <InFrameNotification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}