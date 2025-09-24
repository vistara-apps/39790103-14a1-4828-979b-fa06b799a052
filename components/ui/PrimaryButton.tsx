import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'text' | 'destructive' | 'success';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
}

const PrimaryButton = forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  ({ 
    variant = 'default', 
    size = 'md',
    children, 
    className,
    loading = false,
    disabled,
    fullWidth = false,
    ...props 
  }, ref) => {
    const baseClasses = cn(
      'inline-flex items-center justify-center font-medium transition-all duration-200',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      'active:scale-95',
      fullWidth && 'w-full'
    );
    
    const variantClasses = {
      default: 'bg-primary text-white hover:bg-primary/90 shadow-sm hover:shadow-md',
      outline: 'border border-primary text-primary hover:bg-primary hover:text-white bg-transparent',
      text: 'text-primary hover:bg-primary/10 hover:text-primary/90',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm hover:shadow-md',
      success: 'bg-success text-success-foreground hover:bg-success/90 shadow-sm hover:shadow-md',
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm rounded-md h-8',
      md: 'px-4 py-2 text-base rounded-md h-10',
      lg: 'px-6 py-3 text-lg rounded-lg h-12',
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
        {...props}
      >
        {loading && (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        )}
        {children}
      </button>
    );
  }
);

PrimaryButton.displayName = 'PrimaryButton';

export { PrimaryButton };
