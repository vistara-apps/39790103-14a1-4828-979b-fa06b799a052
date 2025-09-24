import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'text';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  loading?: boolean;
}

export function PrimaryButton({ 
  variant = 'default', 
  size = 'md',
  children, 
  className,
  loading = false,
  disabled,
  ...props 
}: PrimaryButtonProps) {
  const isDisabled = disabled || loading;
  
  const baseClasses = cn(
    'inline-flex items-center justify-center font-medium transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
    'active:scale-95 transform-gpu'
  );
  
  const variantClasses = {
    default: cn(
      'bg-primary text-white shadow-sm',
      'hover:bg-primary-600 hover:shadow-md hover:scale-105',
      'focus:ring-primary/50'
    ),
    outline: cn(
      'border border-primary text-primary bg-transparent',
      'hover:bg-primary hover:text-white hover:scale-105',
      'focus:ring-primary/30'
    ),
    text: cn(
      'text-primary bg-transparent',
      'hover:bg-primary/10 hover:scale-105',
      'focus:ring-primary/30'
    ),
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm rounded-md min-h-[32px]',
    md: 'px-4 py-2 text-base rounded-md min-h-[40px]',
    lg: 'px-6 py-3 text-lg rounded-lg min-h-[48px]',
  };

  const loadingSpinner = loading && (
    <div className={cn(
      'animate-spin rounded-full border-2 border-transparent mr-2',
      variant === 'default' ? 'border-t-white' : 'border-t-primary',
      size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-5 w-5'
    )} />
  );

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        isDisabled && 'hover:scale-100 hover:shadow-none',
        className
      )}
      disabled={isDisabled}
      aria-busy={loading}
      {...props}
    >
      {loadingSpinner}
      <span className={cn(loading && 'opacity-75')}>
        {children}
      </span>
    </button>
  );
}
