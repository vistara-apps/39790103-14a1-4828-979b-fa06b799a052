'use client';

import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PrimaryButton } from './PrimaryButton';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'text';
  };
  children?: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  children,
  className,
  size = 'md'
}: EmptyStateProps) {
  const sizeClasses = {
    sm: {
      container: 'py-8 px-4',
      icon: 'w-8 h-8',
      title: 'text-lg',
      description: 'text-sm',
      spacing: 'space-y-3',
    },
    md: {
      container: 'py-12 px-6',
      icon: 'w-12 h-12',
      title: 'text-xl',
      description: 'text-base',
      spacing: 'space-y-4',
    },
    lg: {
      container: 'py-16 px-8',
      icon: 'w-16 h-16',
      title: 'text-2xl',
      description: 'text-lg',
      spacing: 'space-y-6',
    },
  };

  const classes = sizeClasses[size];

  return (
    <div className={cn(
      'flex flex-col items-center justify-center text-center',
      classes.container,
      classes.spacing,
      className
    )}>
      {Icon && (
        <div className="flex items-center justify-center rounded-full bg-border/50 p-4 animate-fade-in">
          <Icon className={cn(classes.icon, 'text-secondary-text')} />
        </div>
      )}
      
      <div className={cn('space-y-2', size === 'lg' ? 'max-w-md' : 'max-w-sm')}>
        <h3 className={cn('font-semibold text-text', classes.title)}>
          {title}
        </h3>
        
        {description && (
          <p className={cn('text-secondary-text leading-relaxed', classes.description)}>
            {description}
          </p>
        )}
      </div>

      {action && (
        <PrimaryButton
          variant={action.variant || 'default'}
          onClick={action.onClick}
          className="animate-fade-in"
          style={{ animationDelay: '0.1s' }}
        >
          {action.label}
        </PrimaryButton>
      )}

      {children && (
        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {children}
        </div>
      )}
    </div>
  );
}

// Specialized Empty State Components
import { 
  Search, 
  Users, 
  Briefcase, 
  BookOpen, 
  Heart,
  Wifi,
  AlertCircle
} from 'lucide-react';

export function SearchEmptyState({ 
  query, 
  onClear,
  className 
}: { 
  query?: string;
  onClear?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      icon={Search}
      title={query ? `No results for "${query}"` : 'Start your search'}
      description={query 
        ? 'Try adjusting your search terms or filters to find what you\'re looking for.'
        : 'Search for professionals, opportunities, campaigns, or resources to get started.'
      }
      action={query && onClear ? {
        label: 'Clear search',
        onClick: onClear,
        variant: 'outline'
      } : undefined}
      className={className}
    />
  );
}

export function NetworkEmptyState({ 
  onExplore,
  className 
}: { 
  onExplore?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      icon={Users}
      title="Build your network"
      description="Connect with public health professionals, students, and advocates to expand your professional network."
      action={onExplore ? {
        label: 'Explore professionals',
        onClick: onExplore
      } : undefined}
      className={className}
    />
  );
}

export function OpportunitiesEmptyState({ 
  onBrowse,
  className 
}: { 
  onBrowse?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      icon={Briefcase}
      title="No opportunities yet"
      description="Stay tuned for new job postings, internships, and project opportunities in public health."
      action={onBrowse ? {
        label: 'Browse all opportunities',
        onClick: onBrowse,
        variant: 'outline'
      } : undefined}
      className={className}
    />
  );
}

export function CampaignsEmptyState({ 
  onCreate,
  className 
}: { 
  onCreate?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      icon={Heart}
      title="Start making a difference"
      description="Join advocacy campaigns or create your own to drive positive change in public health."
      action={onCreate ? {
        label: 'Create campaign',
        onClick: onCreate
      } : undefined}
      className={className}
    />
  );
}

export function ResourcesEmptyState({ 
  onExplore,
  className 
}: { 
  onExplore?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      icon={BookOpen}
      title="Explore resources"
      description="Discover curated public health data, research papers, policy documents, and educational materials."
      action={onExplore ? {
        label: 'Browse resources',
        onClick: onExplore
      } : undefined}
      className={className}
    />
  );
}

export function OfflineEmptyState({ 
  onRetry,
  className 
}: { 
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      icon={Wifi}
      title="You're offline"
      description="Check your internet connection and try again."
      action={onRetry ? {
        label: 'Try again',
        onClick: onRetry,
        variant: 'outline'
      } : undefined}
      className={className}
      size="sm"
    />
  );
}

export function ErrorEmptyState({ 
  onRetry,
  className,
  error
}: { 
  onRetry?: () => void;
  className?: string;
  error?: string;
}) {
  return (
    <EmptyState
      icon={AlertCircle}
      title="Something went wrong"
      description={error || "We encountered an unexpected error. Please try again."}
      action={onRetry ? {
        label: 'Try again',
        onClick: onRetry
      } : undefined}
      className={className}
      size="sm"
    />
  );
}