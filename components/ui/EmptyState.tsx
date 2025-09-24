'use client';

import { ReactNode } from 'react';
import { PrimaryButton } from './PrimaryButton';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className
}: EmptyStateProps) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center py-12 px-4 text-center',
      className
    )}>
      {icon && (
        <div className="mb-4 p-3 rounded-full bg-muted">
          {icon}
        </div>
      )}
      
      <h3 className="heading mb-2 text-text">
        {title}
      </h3>
      
      <p className="text-secondary-text mb-6 max-w-sm">
        {description}
      </p>
      
      {action && (
        <PrimaryButton onClick={action.onClick}>
          {action.label}
        </PrimaryButton>
      )}
    </div>
  );
}