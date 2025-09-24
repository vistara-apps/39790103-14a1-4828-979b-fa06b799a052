import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
}

export const PrimaryButton = forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  ({ 
    variant = 'default', 
    size = 'md',
    children, 
    className,
    loading = false,
    fullWidth = false,
    disabled,
    ...props 
  }, ref) => {
    const baseClasses = cn(
      'inline-flex items-center justify-center font-medium rounded-md',
      'transition-all duration-200 ease-in-out',
      'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:opacity-50 disabled:pointer-events-none',
      'relative overflow-hidden',
      fullWidth && 'w-full'
    );
    
    const variantClasses = {
      default: cn(
        'bg-primary text-primary-foreground shadow-sm',
        'hover:bg-primary/90 hover:shadow-md',
        'active:scale-95'
      ),
      outline: cn(
        'border border-border bg-background text-foreground',
        'hover:bg-accent hover:text-accent-foreground hover:border-accent',
        'active:scale-95'
      ),
      ghost: cn(
        'text-foreground',
        'hover:bg-accent/10 hover:text-accent',
        'active:scale-95'
      ),
      destructive: cn(
        'bg-error text-white shadow-sm',
        'hover:bg-error/90 hover:shadow-md',
        'active:scale-95'
      ),
    };

    const sizeClasses = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-base',
      lg: 'h-12 px-6 text-lg',
    };

    const iconSize = {
      sm: 'h-3 w-3',
      md: 'h-4 w-4', 
      lg: 'h-5 w-5',
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <Loader2 className={cn('animate-spin mr-2', iconSize[size])} />
        )}
        {children}
        
        {/* Ripple effect on click */}
        <span className="absolute inset-0 bg-white/20 transform scale-0 rounded-md transition-transform duration-200 ease-out active:scale-100" />
      </button>
    );
  }
);

PrimaryButton.displayName = 'PrimaryButton';
