'use client';

import { useState } from 'react';
import { useConnect, useDisconnect, useAccount } from 'wagmi';
import { PrimaryButton } from './ui/PrimaryButton';
import { BottomSheet } from './ui/BottomSheet';
import { Wallet, X, Check } from 'lucide-react';

export function WalletConnect() {
  const [showConnectors, setShowConnectors] = useState(false);
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();

  const handleConnect = (connector: any) => {
    connect({ connector });
    setShowConnectors(false);
  };

  if (isConnected) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-accent/10 rounded-lg px-3 py-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium text-accent">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
        </div>
        <PrimaryButton
          variant="outline"
          size="sm"
          onClick={() => disconnect()}
          className="text-red-600 border-red-200 hover:bg-red-50"
        >
          Disconnect
        </PrimaryButton>
      </div>
    );
  }

  return (
    <>
      <PrimaryButton
        onClick={() => setShowConnectors(true)}
        disabled={isPending}
        className="flex items-center gap-2"
      >
        <Wallet className="h-4 w-4" />
        {isPending ? 'Connecting...' : 'Connect Wallet'}
      </PrimaryButton>

      <BottomSheet
        isOpen={showConnectors}
        onClose={() => setShowConnectors(false)}
        title="Connect Wallet"
      >
        <div className="p-4 space-y-4">
          <p className="text-secondary-text text-sm mb-4">
            Connect your wallet to make payments and access premium features.
          </p>
          
          {connectors.map((connector) => (
            <button
              key={connector.uid}
              onClick={() => handleConnect(connector)}
              disabled={isPending}
              className="w-full flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Wallet className="h-4 w-4 text-primary" />
                </div>
                <span className="font-medium">{connector.name}</span>
              </div>
              {isPending ? (
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <div className="w-6 h-6 border border-border rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-primary rounded-full opacity-0" />
                </div>
              )}
            </button>
          ))}
          
          <div className="pt-4 border-t border-border">
            <p className="text-xs text-secondary-text">
              By connecting a wallet, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </BottomSheet>
    </>
  );
}