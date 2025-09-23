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
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-gray-200 z-40">
      <div className="flex items-center justify-around py-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                'flex flex-col items-center justify-center p-2 min-w-0 flex-1 transition-colors duration-200',
                isActive 
                  ? 'text-accent' 
                  : 'text-secondary-text hover:text-text'
              )}
            >
              <Icon className={cn(
                'h-5 w-5 mb-1',
                isActive && 'scale-110'
              )} />
              <span className="text-xs font-medium truncate">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
