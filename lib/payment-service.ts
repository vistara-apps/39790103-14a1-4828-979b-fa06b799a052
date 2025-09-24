import { useWalletClient, useAccount, useConnect, useDisconnect } from 'wagmi';
import { useEffect, useState } from 'react';
import { X402Client, PaymentRequest, PaymentResponse } from './x402-client';

export interface PaymentService {
  client: X402Client | null;
  isConnected: boolean;
  address: string | undefined;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  processPayment: (request: PaymentRequest) => Promise<PaymentResponse>;
  makeRequest: (url: string, options?: RequestInit) => Promise<Response>;
}

export function usePaymentService(): PaymentService {
  const [client, setClient] = useState<X402Client | null>(null);
  const { data: walletClient } = useWalletClient();
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  // Initialize X402 client when wallet is available
  useEffect(() => {
    if (walletClient) {
      const x402Client = new X402Client();
      x402Client.setWalletClient(walletClient);
      setClient(x402Client);
    } else {
      setClient(null);
    }
  }, [walletClient]);

  const handleConnect = async (): Promise<void> => {
    const coinbaseConnector = connectors.find(c => c.name === 'Coinbase Wallet');
    if (coinbaseConnector) {
      try {
        await connect({ connector: coinbaseConnector });
      } catch (error) {
        console.error('Failed to connect wallet:', error);
        throw error;
      }
    } else {
      throw new Error('Coinbase Wallet connector not found');
    }
  };

  const handleDisconnect = async (): Promise<void> => {
    try {
      await disconnect();
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      throw error;
    }
  };

  const processPayment = async (request: PaymentRequest): Promise<PaymentResponse> => {
    if (!client) {
      return {
        success: false,
        error: 'Payment client not initialized',
      };
    }

    return client.processPayment(request);
  };

  const makeRequest = async (url: string, options?: RequestInit): Promise<Response> => {
    if (!client) {
      throw new Error('Payment client not initialized');
    }

    try {
      const method = options?.method || 'GET';
      const data = options?.body ? JSON.parse(options.body as string) : undefined;
      
      let response;
      switch (method.toUpperCase()) {
        case 'GET':
          response = await client.get(url);
          break;
        case 'POST':
          response = await client.post(url, data);
          break;
        case 'PUT':
          response = await client.put(url, data);
          break;
        case 'DELETE':
          response = await client.delete(url);
          break;
        default:
          throw new Error(`Unsupported HTTP method: ${method}`);
      }

      // Convert axios response to fetch Response
      return new Response(JSON.stringify(response.data), {
        status: response.status,
        statusText: response.statusText,
        headers: new Headers(response.headers as HeadersInit),
      });
    } catch (error: any) {
      if (error.response) {
        return new Response(JSON.stringify(error.response.data), {
          status: error.response.status,
          statusText: error.response.statusText,
          headers: new Headers(error.response.headers as HeadersInit),
        });
      }
      throw error;
    }
  };

  return {
    client,
    isConnected,
    address,
    connect: handleConnect,
    disconnect: handleDisconnect,
    processPayment,
    makeRequest,
  };
}

// Hook for checking USDC balance on Base
export function useUSDCBalance() {
  const { address } = useAccount();
  const [balance, setBalance] = useState<string>('0');
  const [loading, setLoading] = useState(false);

  const USDC_BASE_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

  const fetchBalance = async () => {
    if (!address) return;

    setLoading(true);
    try {
      // In a real implementation, you'd use a provider to call the balanceOf function
      // For now, we'll simulate a balance check
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock balance - in practice, you'd call the USDC contract's balanceOf function
      const mockBalance = (Math.random() * 1000).toFixed(2);
      setBalance(mockBalance);
    } catch (error) {
      console.error('Failed to fetch USDC balance:', error);
      setBalance('0');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [address]);

  return {
    balance,
    loading,
    refresh: fetchBalance,
  };
}