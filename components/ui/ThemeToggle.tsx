'use client';

import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  variant?: 'button' | 'dropdown';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ThemeToggle({ 
  variant = 'button', 
  size = 'md',
  className 
}: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  if (variant === 'button') {
    const nextTheme = resolvedTheme === 'light' ? 'dark' : 'light';
    
    return (
      <button
        onClick={() => setTheme(nextTheme)}
        className={cn(
          'inline-flex items-center justify-center rounded-md',
          'bg-surface hover:bg-surface-secondary',
          'border border-border hover:border-border-secondary',
          'text-text-secondary hover:text-text',
          'transition-all duration-200 hover:shadow-md',
          'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          sizeClasses[size],
          className
        )}
        aria-label={`Switch to ${nextTheme} mode`}
      >
        <Sun 
          className={cn(
            iconSizes[size], 
            'rotate-0 scale-100 transition-all duration-300',
            resolvedTheme === 'dark' && 'rotate-90 scale-0'
          )} 
        />
        <Moon 
          className={cn(
            iconSizes[size], 
            'absolute rotate-90 scale-0 transition-all duration-300',
            resolvedTheme === 'dark' && 'rotate-0 scale-100'
          )} 
        />
      </button>
    );
  }

  // Dropdown variant with system option
  return (
    <div className={cn('relative inline-block', className)}>
      <div className="flex items-center space-x-1 bg-surface border border-border rounded-lg p-1">
        {['light', 'dark', 'system'].map((themeOption) => {
          const isActive = theme === themeOption;
          const Icon = themeOption === 'light' ? Sun : themeOption === 'dark' ? Moon : Monitor;
          
          return (
            <button
              key={themeOption}
              onClick={() => setTheme(themeOption as any)}
              className={cn(
                'inline-flex items-center justify-center rounded-md p-2',
                'text-text-secondary hover:text-text',
                'transition-all duration-200',
                'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                isActive && 'bg-primary text-primary-foreground shadow-sm'
              )}
              aria-label={`Switch to ${themeOption} mode`}
            >
              <Icon className={iconSizes[size]} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Alternative compact toggle for mobile/nav
export function CompactThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  
  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'light' ? 'dark' : 'light')}
      className={cn(
        'inline-flex items-center justify-center',
        'h-9 w-9 rounded-md',
        'text-text-secondary hover:text-text',
        'hover:bg-surface-secondary',
        'transition-all duration-200',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className
      )}
      aria-label="Toggle theme"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </button>
  );
}