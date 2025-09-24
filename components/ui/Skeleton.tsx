'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export function Skeleton({ className, children, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-muted rounded-md',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Specific skeleton components for common use cases
export function ProfileCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('card animate-fade-in', className)}>
      <div className="flex items-start space-x-3">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-2/3" />
          <div className="flex space-x-2 mt-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        </div>
        <Skeleton className="h-8 w-20 rounded-md" />
      </div>
    </div>
  );
}

export function OpportunityCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('card animate-fade-in', className)}>
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-12 w-full" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function CampaignCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('card animate-fade-in', className)}>
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-16 w-full" />
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function ResourceCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('card animate-fade-in', className)}>
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
        <Skeleton className="h-12 w-full" />
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <Skeleton className="h-4 w-12 rounded-full" />
            <Skeleton className="h-4 w-16 rounded-full" />
          </div>
          <Skeleton className="h-8 w-16 rounded-md" />
        </div>
      </div>
    </div>
  );
}