'use client';

import { Bell, Settings, User, TestTube } from 'lucide-react';
import { PrimaryButton } from './ui/PrimaryButton';
import { WalletConnect } from './WalletConnect';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showProfile?: boolean;
  onProfileClick?: () => void;
  onTestClick?: () => void;
}

export function Header({ 
  title, 
  subtitle, 
  showProfile = true, 
  onProfileClick,
  onTestClick
}: HeaderProps) {
  return (
    <header className="bg-primary text-white p-4 pb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <h1 className="display text-white">{title}</h1>
          {subtitle && (
            <p className="text-white/80 mt-1">{subtitle}</p>
          )}
        </div>
        
        {showProfile && (
          <div className="flex items-center space-x-2">
            <button className="p-2 text-white/80 hover:text-white transition-colors duration-200">
              <Bell className="h-5 w-5" />
            </button>
            <button className="p-2 text-white/80 hover:text-white transition-colors duration-200">
              <Settings className="h-5 w-5" />
            </button>
            {onTestClick && (
              <button 
                onClick={onTestClick}
                className="p-2 text-white/80 hover:text-white transition-colors duration-200"
                title="X402 Payment Tests"
              >
                <TestTube className="h-5 w-5" />
              </button>
            )}
            <WalletConnect />
            <PrimaryButton
              variant="outline"
              size="sm"
              onClick={onProfileClick}
              className="border-white/30 text-white hover:bg-white hover:text-primary ml-2"
            >
              <User className="h-4 w-4 mr-1" />
              Profile
            </PrimaryButton>
          </div>
        )}
      </div>
    </header>
  );
}
