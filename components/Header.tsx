'use client';

import { Bell, Settings, User } from 'lucide-react';
import { PrimaryButton } from './ui/PrimaryButton';
import { ThemeToggle } from './ui/ThemeToggle';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showProfile?: boolean;
  showThemeToggle?: boolean;
  onProfileClick?: () => void;
  className?: string;
}

export function Header({ 
  title, 
  subtitle, 
  showProfile = true,
  showThemeToggle = true,
  onProfileClick,
  className
}: HeaderProps) {
  return (
    <header className={cn(
      'gradient-primary text-primary-foreground p-4 pb-6',
      'border-b border-primary-200/20',
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h1 className="display text-primary-foreground gradient-text">
            {title}
          </h1>
          {subtitle && (
            <p className="text-primary-foreground/80 mt-1 text-sm sm:text-base">
              {subtitle}
            </p>
          )}
        </div>
        
        <div className="flex items-center space-x-1 sm:space-x-2">
          {showThemeToggle && (
            <ThemeToggle 
              size="sm"
              className="bg-primary-foreground/10 hover:bg-primary-foreground/20 
                         border-primary-foreground/20 text-primary-foreground"
            />
          )}
          
          <button 
            className={cn(
              'p-2 text-primary-foreground/80 hover:text-primary-foreground',
              'hover:bg-primary-foreground/10 rounded-md',
              'transition-all duration-200',
              'focus-visible:ring-2 focus-visible:ring-primary-foreground/50 focus-visible:ring-offset-2 focus-visible:ring-offset-primary'
            )}
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </button>
          
          <button 
            className={cn(
              'p-2 text-primary-foreground/80 hover:text-primary-foreground',
              'hover:bg-primary-foreground/10 rounded-md',
              'transition-all duration-200',
              'focus-visible:ring-2 focus-visible:ring-primary-foreground/50 focus-visible:ring-offset-2 focus-visible:ring-offset-primary'
            )}
            aria-label="Settings"
          >
            <Settings className="h-5 w-5" />
          </button>
          
          {showProfile && (
            <PrimaryButton
              variant="outline"
              size="sm"
              onClick={onProfileClick}
              className={cn(
                'border-primary-foreground/30 text-primary-foreground bg-transparent',
                'hover:bg-primary-foreground hover:text-primary',
                'focus-visible:ring-primary-foreground/50 focus-visible:ring-offset-primary'
              )}
            >
              <User className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Profile</span>
            </PrimaryButton>
          )}
        </div>
      </div>
    </header>
  );
}
