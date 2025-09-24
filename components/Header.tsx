'use client';

import { Bell, Settings, User, Moon, Sun, Monitor } from 'lucide-react';
import { PrimaryButton } from './ui/PrimaryButton';
import { useTheme } from './ThemeProvider';
import { cn } from '@/lib/utils';

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
  const { theme, setTheme, actualTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const getThemeIcon = () => {
    if (theme === 'light') return Sun;
    if (theme === 'dark') return Moon;
    return Monitor;
  };

  const ThemeIcon = getThemeIcon();

  return (
    <header className="bg-primary text-white p-4 pb-6 safe-area-top">
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <h1 className="display text-white font-bold">{title}</h1>
          {subtitle && (
            <p className="text-white/80 mt-1 text-sm leading-relaxed">{subtitle}</p>
          )}
        </div>
        
        {showProfile && (
          <div className="flex items-center space-x-1">
            <button 
              className={cn(
                'p-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg',
                'transition-all duration-200 focus-visible:outline-none focus-visible:ring-2',
                'focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-primary'
              )}
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
            </button>
            <button 
              onClick={cycleTheme}
              className={cn(
                'p-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg',
                'transition-all duration-200 focus-visible:outline-none focus-visible:ring-2',
                'focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-primary'
              )}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'} theme`}
            >
              <ThemeIcon className="h-5 w-5" />
            </button>
            <button 
              className={cn(
                'p-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg',
                'transition-all duration-200 focus-visible:outline-none focus-visible:ring-2',
                'focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-primary'
              )}
              aria-label="Settings"
            >
              <Settings className="h-5 w-5" />
            </button>
            <PrimaryButton
              variant="outline"
              size="sm"
              onClick={onProfileClick}
              className={cn(
                'border-white/30 text-white hover:bg-white hover:text-primary ml-2',
                'focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-primary'
              )}
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
