'use client';

import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  variant?: 'default' | 'card' | 'inline' | 'skeleton';
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export function LoadingState({ 
  variant = 'default',
  size = 'md',
  text = 'Loading...',
  className 
}: LoadingStateProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6', 
    lg: 'h-8 w-8',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  if (variant === 'skeleton') {
    return <LoadingSkeleton className={className} />;
  }

  if (variant === 'inline') {
    return (
      <div className={cn('flex items-center space-x-2', className)}>
        <Loader2 className={cn('animate-spin text-text-secondary', sizeClasses[size])} />
        {text && (
          <span className={cn('text-text-secondary', textSizeClasses[size])}>
            {text}
          </span>
        )}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={cn(
        'flex flex-col items-center justify-center p-8 space-y-4',
        'bg-surface border border-border rounded-lg',
        className
      )}>
        <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
        {text && (
          <p className={cn('text-text-secondary text-center', textSizeClasses[size])}>
            {text}
          </p>
        )}
      </div>
    );
  }

  // Default variant - centered
  return (
    <div className={cn(
      'flex flex-col items-center justify-center min-h-[200px] space-y-4',
      className
    )}>
      <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
      {text && (
        <p className={cn('text-text-secondary text-center', textSizeClasses[size])}>
          {text}
        </p>
      )}
    </div>
  );
}

// Skeleton loading components
export function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('loading-skeleton h-4 w-full', className)} />
  );
}

export function ProfileCardSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="flex items-start space-x-3">
        <div className="h-16 w-16 bg-surface-secondary rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-surface-secondary rounded w-3/4" />
          <div className="h-3 bg-surface-secondary rounded w-1/2" />
          <div className="h-3 bg-surface-secondary rounded w-2/3" />
          <div className="flex space-x-2 mt-2">
            <div className="h-6 bg-surface-secondary rounded-full w-16" />
            <div className="h-6 bg-surface-secondary rounded-full w-20" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function OpportunityCardSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <div className="space-y-2 flex-1">
            <div className="h-5 bg-surface-secondary rounded w-3/4" />
            <div className="h-4 bg-surface-secondary rounded w-1/2" />
          </div>
          <div className="h-8 bg-surface-secondary rounded w-20" />
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-surface-secondary rounded w-full" />
          <div className="h-3 bg-surface-secondary rounded w-4/5" />
        </div>
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <div className="h-6 bg-surface-secondary rounded-full w-16" />
            <div className="h-6 bg-surface-secondary rounded-full w-20" />
          </div>
          <div className="h-4 bg-surface-secondary rounded w-24" />
        </div>
      </div>
    </div>
  );
}

export function CampaignCardSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="h-5 bg-surface-secondary rounded w-4/5" />
            <div className="h-4 bg-surface-secondary rounded w-2/3" />
          </div>
          <div className="h-8 bg-surface-secondary rounded w-16" />
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-surface-secondary rounded w-full" />
          <div className="h-3 bg-surface-secondary rounded w-3/4" />
        </div>
        <div className="space-y-2">
          <div className="h-2 bg-surface-secondary rounded-full w-full" />
          <div className="flex justify-between text-xs">
            <div className="h-3 bg-surface-secondary rounded w-20" />
            <div className="h-3 bg-surface-secondary rounded w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}