'use client';

import { Home, Users, Briefcase, Megaphone, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navigationItems = [
  { id: 'dashboard', label: 'Home', icon: Home, ariaLabel: 'Go to Dashboard' },
  { id: 'connections', label: 'Connect', icon: Users, ariaLabel: 'View Professional Connections' },
  { id: 'opportunities', label: 'Jobs', icon: Briefcase, ariaLabel: 'Browse Job Opportunities' },
  { id: 'campaigns', label: 'Campaigns', icon: Megaphone, ariaLabel: 'View Advocacy Campaigns' },
  { id: 'resources', label: 'Resources', icon: BookOpen, ariaLabel: 'Access Resource Library' },
];

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-md border-t border-border z-40 safe-area-bottom"
      role="tablist"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-around px-2 py-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                'flex flex-col items-center justify-center p-3 min-w-0 flex-1 transition-all duration-300 rounded-lg',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
                'active:scale-95 active:bg-accent/10',
                isActive 
                  ? 'text-accent bg-accent/10' 
                  : 'text-secondary-text hover:text-text hover:bg-muted/50'
              )}
              role="tab"
              aria-selected={isActive}
              aria-label={item.ariaLabel}
              tabIndex={isActive ? 0 : -1}
            >
              <Icon className={cn(
                'h-5 w-5 mb-1 transition-transform duration-300',
                isActive && 'scale-110'
              )} />
              <span className={cn(
                'text-xs font-medium truncate transition-all duration-300',
                isActive ? 'font-semibold' : 'font-normal'
              )}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-accent rounded-full animate-fade-in" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
