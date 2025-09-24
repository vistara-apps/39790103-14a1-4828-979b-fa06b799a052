'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'pulse';
  children?: ReactNode;
  text?: string;
}

export function LoadingState({ 
  className, 
  size = 'md', 
  variant = 'spinner',
  children,
  text = 'Loading...'
}: LoadingStateProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  if (variant === 'spinner') {
    return (
      <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
        <div className={cn(
          'animate-spin rounded-full border-2 border-primary/20 border-t-primary',
          sizeClasses[size]
        )} />
        {text && (
          <p className="text-sm text-secondary-text animate-pulse">
            {text}
          </p>
        )}
        {children}
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                'rounded-full bg-primary animate-bounce',
                size === 'sm' ? 'w-1 h-1' : size === 'md' ? 'w-2 h-2' : 'w-3 h-3'
              )}
              style={{
                animationDelay: `${i * 0.15}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>
        {text && (
          <p className="text-sm text-secondary-text">
            {text}
          </p>
        )}
        {children}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
        <div className={cn(
          'rounded-full bg-primary/20 animate-pulse',
          sizeClasses[size]
        )} />
        {text && (
          <p className="text-sm text-secondary-text animate-pulse">
            {text}
          </p>
        )}
        {children}
      </div>
    );
  }

  return null;
}

// Skeleton Components
interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  lines?: number;
}

export function Skeleton({ 
  className, 
  variant = 'rectangular',
  lines = 1
}: SkeletonProps) {
  if (variant === 'text' && lines > 1) {
    return (
      <div className={cn('space-y-2', className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-4 skeleton rounded',
              i === lines - 1 ? 'w-3/4' : 'w-full'
            )}
          />
        ))}
      </div>
    );
  }

  const variantClasses = {
    text: 'h-4 w-full',
    circular: 'rounded-full aspect-square',
    rectangular: 'h-20 w-full',
  };

  return (
    <div className={cn(
      'skeleton',
      variantClasses[variant],
      className
    )} />
  );
}

// Card Skeleton
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('card space-y-4', className)}>
      <div className="flex items-start space-x-4">
        <Skeleton variant="circular" className="w-12 h-12" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" className="h-4 w-3/4" />
          <Skeleton variant="text" className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton variant="text" lines={3} />
      <div className="flex space-x-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  );
}

// List Skeleton
export function ListSkeleton({ 
  items = 3, 
  className 
}: { 
  items?: number;
  className?: string;
}) {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: items }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

// Button Loading State
interface ButtonLoadingProps {
  loading?: boolean;
  children: ReactNode;
  className?: string;
}

export function ButtonLoading({ 
  loading = false, 
  children, 
  className 
}: ButtonLoadingProps) {
  return (
    <span className={cn('inline-flex items-center', className)}>
      {loading && (
        <LoadingState 
          size="sm" 
          variant="spinner" 
          className="mr-2" 
        />
      )}
      {children}
    </span>
  );
}