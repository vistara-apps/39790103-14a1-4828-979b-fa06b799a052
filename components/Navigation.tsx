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
    <nav className="fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-md border-t border-border z-40">
      <div className="flex items-center justify-around py-1 max-w-lg mx-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                'flex flex-col items-center justify-center p-3 min-w-0 flex-1 transition-all duration-200 rounded-lg mx-1 relative overflow-hidden',
                'active:scale-95 active:bg-accent/10 touch-manipulation',
                'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-inset',
                isActive 
                  ? 'text-accent bg-accent/5' 
                  : 'text-secondary-text hover:text-text hover:bg-muted/50'
              )}
              aria-label={`Navigate to ${item.label}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {isActive && (
                <div className="absolute inset-0 bg-accent/5 rounded-lg animate-scale-in" />
              )}
              <Icon className={cn(
                'h-5 w-5 mb-1 transition-transform duration-200 relative z-10',
                isActive && 'scale-110 animate-bounce-subtle'
              )} />
              <span className="text-xs font-medium truncate relative z-10">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
