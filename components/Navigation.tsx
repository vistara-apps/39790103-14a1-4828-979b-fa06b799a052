'use client';

import { Home, Users, Briefcase, Megaphone, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
}

const navigationItems = [
  { 
    id: 'dashboard', 
    label: 'Home', 
    icon: Home,
    ariaLabel: 'Go to dashboard'
  },
  { 
    id: 'connections', 
    label: 'Connect', 
    icon: Users,
    ariaLabel: 'View connections'
  },
  { 
    id: 'opportunities', 
    label: 'Jobs', 
    icon: Briefcase,
    ariaLabel: 'Browse job opportunities'
  },
  { 
    id: 'campaigns', 
    label: 'Campaigns', 
    icon: Megaphone,
    ariaLabel: 'View advocacy campaigns'
  },
  { 
    id: 'resources', 
    label: 'Resources', 
    icon: BookOpen,
    ariaLabel: 'Access resources'
  },
];

export function Navigation({ activeTab, onTabChange, className }: NavigationProps) {
  return (
    <nav 
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40',
        'bg-surface/80 backdrop-blur-md border-t border-border',
        'safe-area-inset-bottom',
        className
      )}
      role="tablist"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-around py-2 pb-safe">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              role="tab"
              aria-selected={isActive}
              aria-label={item.ariaLabel}
              className={cn(
                'flex flex-col items-center justify-center p-2 min-w-0 flex-1',
                'transition-all duration-200 rounded-md mx-1',
                'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                'hover:bg-surface-secondary',
                isActive 
                  ? 'text-accent' 
                  : 'text-text-secondary hover:text-text'
              )}
            >
              <div className={cn(
                'relative flex items-center justify-center mb-1',
                'transition-transform duration-200',
                isActive && 'scale-110'
              )}>
                <Icon className="h-5 w-5" />
                {isActive && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full animate-scale-in" />
                )}
              </div>
              <span className={cn(
                'text-xs font-medium truncate transition-all duration-200',
                isActive ? 'text-accent font-semibold' : 'text-text-secondary'
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
