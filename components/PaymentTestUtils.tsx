'use client';

import { useState } from 'react';
import { useAccount, useBalance, usePublicClient } from 'wagmi';
import { useX402Payment } from '@/lib/hooks/useX402Payment';
import { USDC_CONTRACT_ADDRESS } from '@/lib/x402-axios';
import { PrimaryButton } from './ui/PrimaryButton';
import { BottomSheet } from './ui/BottomSheet';
import { CheckCircle, XCircle, Clock, DollarSign, Activity } from 'lucide-react';
import { base } from 'viem/chains';

interface PaymentTestUtilsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PaymentTestUtils({ isOpen, onClose }: PaymentTestUtilsProps) {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const {
    usdcBalance,
    executePayment,
    checkPaymentStatus,
    isLoading,
    error,
    lastPayment
  } = useX402Payment();

  const [testResults, setTestResults] = useState<Record<string, any>>({});

  // Get USDC balance with different method for verification
  const { data: usdcBalanceVerify } = useBalance({
    address,
    token: USDC_CONTRACT_ADDRESS as `0x${string}`,
    chainId: base.id,
  });

  const runTest = async (testName: string, testFn: () => Promise<any>) => {
    setTestResults(prev => ({
      ...prev,
      [testName]: { status: 'running', result: null, error: null }
    }));

    try {
      const result = await testFn();
      setTestResults(prev => ({
        ...prev,
        [testName]: { status: 'success', result, error: null }
      }));
    } catch (error: any) {
      setTestResults(prev => ({
        ...prev,
        [testName]: { status: 'error', result: null, error: error.message }
      }));
    }
  };

  const testUSDCContract = async () => {
    if (!publicClient) throw new Error('Public client not available');
    
    // Test reading USDC contract properties
    const name = await publicClient.readContract({
      address: USDC_CONTRACT_ADDRESS as `0x${string}`,
      abi: [
        {
          name: 'name',
          type: 'function',
          stateMutability: 'view',
          inputs: [],
          outputs: [{ name: '', type: 'string' }],
        },
      ],
      functionName: 'name',
    });

    const symbol = await publicClient.readContract({
      address: USDC_CONTRACT_ADDRESS as `0x${string}`,
      abi: [
        {
          name: 'symbol',
          type: 'function',
          stateMutability: 'view',
          inputs: [],
          outputs: [{ name: '', type: 'string' }],
        },
      ],
      functionName: 'symbol',
    });

    const decimals = await publicClient.readContract({
      address: USDC_CONTRACT_ADDRESS as `0x${string}`,
      abi: [
        {
          name: 'decimals',
          type: 'function',
          stateMutability: 'view',
          inputs: [],
          outputs: [{ name: '', type: 'uint8' }],
        },
      ],
      functionName: 'decimals',
    });

    return { name, symbol, decimals: Number(decimals) };
  };

  const testBalanceRetrieval = async () => {
    return {
      hookBalance: usdcBalance,
      wagmiBalance: usdcBalanceVerify?.formatted,
      rawBalance: usdcBalanceVerify?.value?.toString(),
    };
  };

  const testSmallPayment = async () => {
    // Test with a very small amount (0.01 USDC)
    const paymentRequest = {
      amount: '0.01',
      recipient: '0x742d35Cc6635C0532925a3b8D50f142a9dF8e5d6',
      paymentId: `test-${Date.now()}`,
      description: 'Test Payment - 0.01 USDC',
    };

    return await executePayment(paymentRequest);
  };

  const testErrorHandling = async () => {
    // Test with invalid recipient address
    try {
      const paymentRequest = {
        amount: '1',
        recipient: '0xinvalidaddress',
        paymentId: `error-test-${Date.now()}`,
        description: 'Error Test - Invalid Address',
      };

      await executePayment(paymentRequest);
      throw new Error('Expected error but payment succeeded');
    } catch (error: any) {
      if (error.message.includes('invalid') || error.message.includes('address')) {
        return { expected: true, error: error.message };
      }
      throw error;
    }
  };

  const testStatusCheck = async () => {
    if (!lastPayment) {
      throw new Error('No recent payment to check status for');
    }

    const status = await checkPaymentStatus(lastPayment.transactionHash);
    return { transactionHash: lastPayment.transactionHash, status };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Clock className="h-4 w-4 text-blue-500 animate-pulse" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="X402 Payment Testing">
      <div className="p-4 space-y-6">
        {/* Connection Status */}
        <div className="bg-bg-secondary rounded-lg p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Connection Status
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-secondary-text">Wallet Connected:</span>
              <span className={isConnected ? 'text-green-600' : 'text-red-600'}>
                {isConnected ? 'Yes' : 'No'}
              </span>
            </div>
            {address && (
              <div className="flex justify-between">
                <span className="text-secondary-text">Address:</span>
                <span className="font-mono text-xs">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-secondary-text">USDC Balance:</span>
              <span className="font-medium">{usdcBalance} USDC</span>
            </div>
          </div>
        </div>

        {/* Test Suite */}
        <div className="space-y-3">
          <h3 className="font-semibold">Test Suite</h3>
          
          {/* USDC Contract Test */}
          <div className="flex items-center justify-between p-3 border border-border rounded-lg">
            <div>
              <p className="font-medium">USDC Contract Verification</p>
              <p className="text-sm text-secondary-text">Test contract name, symbol, decimals</p>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(testResults.contract?.status)}
              <PrimaryButton
                size="sm"
                onClick={() => runTest('contract', testUSDCContract)}
                disabled={!isConnected}
              >
                Test
              </PrimaryButton>
            </div>
          </div>

          {/* Balance Test */}
          <div className="flex items-center justify-between p-3 border border-border rounded-lg">
            <div>
              <p className="font-medium">Balance Retrieval</p>
              <p className="text-sm text-secondary-text">Compare different balance methods</p>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(testResults.balance?.status)}
              <PrimaryButton
                size="sm"
                onClick={() => runTest('balance', testBalanceRetrieval)}
                disabled={!isConnected}
              >
                Test
              </PrimaryButton>
            </div>
          </div>

          {/* Small Payment Test */}
          <div className="flex items-center justify-between p-3 border border-border rounded-lg">
            <div>
              <p className="font-medium">Small Payment (0.01 USDC)</p>
              <p className="text-sm text-secondary-text">Test actual transaction</p>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(testResults.payment?.status)}
              <PrimaryButton
                size="sm"
                onClick={() => runTest('payment', testSmallPayment)}
                disabled={!isConnected || parseFloat(usdcBalance) < 0.01}
              >
                Test
              </PrimaryButton>
            </div>
          </div>

          {/* Error Handling Test */}
          <div className="flex items-center justify-between p-3 border border-border rounded-lg">
            <div>
              <p className="font-medium">Error Handling</p>
              <p className="text-sm text-secondary-text">Test invalid address handling</p>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(testResults.error?.status)}
              <PrimaryButton
                size="sm"
                onClick={() => runTest('error', testErrorHandling)}
                disabled={!isConnected}
              >
                Test
              </PrimaryButton>
            </div>
          </div>

          {/* Status Check Test */}
          <div className="flex items-center justify-between p-3 border border-border rounded-lg">
            <div>
              <p className="font-medium">Transaction Status</p>
              <p className="text-sm text-secondary-text">Check last payment status</p>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(testResults.status?.status)}
              <PrimaryButton
                size="sm"
                onClick={() => runTest('status', testStatusCheck)}
                disabled={!lastPayment}
              >
                Test
              </PrimaryButton>
            </div>
          </div>
        </div>

        {/* Test Results */}
        {Object.keys(testResults).length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold">Test Results</h3>
            {Object.entries(testResults).map(([testName, result]) => (
              <div key={testName} className="bg-bg-secondary rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  {getStatusIcon(result.status)}
                  <span className="font-medium capitalize">{testName} Test</span>
                </div>
                {result.status === 'success' && (
                  <pre className="text-xs bg-green-50 p-2 rounded overflow-x-auto">
                    {JSON.stringify(result.result, null, 2)}
                  </pre>
                )}
                {result.status === 'error' && (
                  <div className="text-xs bg-red-50 p-2 rounded text-red-700">
                    {result.error}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-800 font-medium">Payment Error:</p>
            <p className="text-red-700 text-sm">{error.message}</p>
          </div>
        )}

        <PrimaryButton onClick={onClose} className="w-full mt-4">
          Close
        </PrimaryButton>
      </div>
    </BottomSheet>
  );
}