'use client';

import { useState } from 'react';
import { Home, Users, Briefcase, Megaphone, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navigationItems = [
  { id: 'dashboard', label: 'Home', icon: Home },
  { id: 'connections', label: 'Connect', icon: Users },
  { id: 'opportunities', label: 'Jobs', icon: Briefcase },
  { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
  { id: 'resources', label: 'Resources', icon: BookOpen },
];

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-lg border-t border-border z-40 safe-area-pb"
      role="tablist"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-around py-2">
        {navigationItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              role="tab"
              aria-selected={isActive}
              aria-controls={`${item.id}-panel`}
              aria-label={`${item.label} tab`}
              className={cn(
                'relative flex flex-col items-center justify-center p-3 min-w-0 flex-1 transition-all duration-300 rounded-lg mx-1',
                'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface',
                isActive 
                  ? 'text-accent' 
                  : 'text-secondary-text hover:text-text hover:bg-border/50'
              )}
              style={{ 
                animationDelay: `${index * 0.05}s` 
              }}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-accent rounded-full animate-scale-in" />
              )}
              
              <Icon className={cn(
                'h-5 w-5 mb-1 transition-all duration-200',
                isActive && 'scale-110 animate-bounce-subtle'
              )} />
              
              <span className={cn(
                'text-xs font-medium truncate transition-all duration-200',
                isActive ? 'font-semibold' : 'font-normal'
              )}>
                {item.label}
              </span>
              
              {/* Badge/notification indicator (placeholder) */}
              {item.id === 'opportunities' && (
                <div className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
      
      {/* Safe area padding for iOS devices */}
      <div className="h-safe-area-inset-bottom" />
    </nav>
  );
}
