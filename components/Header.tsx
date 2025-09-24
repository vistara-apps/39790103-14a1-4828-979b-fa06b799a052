'use client';

import { Bell, Settings, User } from 'lucide-react';
import { PrimaryButton } from './ui/PrimaryButton';
import { ThemeToggle } from './ThemeProvider';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showProfile?: boolean;
  onProfileClick?: () => void;
}

export function Header({ 
  title, 
  subtitle, 
  showProfile = true, 
  onProfileClick 
}: HeaderProps) {
  return (
    <header className="gradient-primary text-white p-4 pb-6 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <h1 className="display text-white text-balance animate-fade-in">{title}</h1>
            {subtitle && (
              <p className="text-white/80 mt-1 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                {subtitle}
              </p>
            )}
          </div>
          
          {showProfile && (
            <div className="flex items-center space-x-1 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <ThemeToggle />
              
              <button 
                className="p-2 text-white/80 hover:text-white transition-all duration-200 rounded-lg hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
                aria-label="Notifications"
                title="Notifications"
              >
                <Bell className="h-5 w-5" />
              </button>
              
              <button 
                className="p-2 text-white/80 hover:text-white transition-all duration-200 rounded-lg hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
                aria-label="Settings"
                title="Settings"
              >
                <Settings className="h-5 w-5" />
              </button>
              
              <PrimaryButton
                variant="outline"
                size="sm"
                onClick={onProfileClick}
                className="border-white/30 text-white hover:bg-white hover:text-primary ml-2 focus:ring-white/30"
                aria-label="Open profile"
              >
                <User className="h-4 w-4 mr-1" />
                Profile
              </PrimaryButton>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
