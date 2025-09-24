'use client';

import { cn } from '@/lib/utils';
import { 
  Search, 
  Users, 
  Briefcase, 
  Megaphone, 
  BookOpen, 
  AlertCircle,
  Inbox,
  Wifi,
  LucideIcon 
} from 'lucide-react';
import { PrimaryButton } from './PrimaryButton';

interface EmptyStateProps {
  variant?: 'search' | 'connections' | 'opportunities' | 'campaigns' | 'resources' | 'error' | 'offline' | 'default';
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: LucideIcon;
  className?: string;
}

const variantConfig = {
  search: {
    icon: Search,
    title: 'No results found',
    description: 'Try adjusting your search terms or filters to find what you\'re looking for.',
  },
  connections: {
    icon: Users,
    title: 'No connections yet',
    description: 'Start building your professional network by connecting with other health professionals.',
  },
  opportunities: {
    icon: Briefcase,
    title: 'No opportunities available',
    description: 'Check back later for new job postings and career opportunities.',
  },
  campaigns: {
    icon: Megaphone,
    title: 'No active campaigns',
    description: 'Be the first to create a campaign and advocate for important health issues.',
  },
  resources: {
    icon: BookOpen,
    title: 'No resources found',
    description: 'Resources will appear here as they become available.',
  },
  error: {
    icon: AlertCircle,
    title: 'Something went wrong',
    description: 'We encountered an unexpected error. Please try again.',
  },
  offline: {
    icon: Wifi,
    title: 'You\'re offline',
    description: 'Check your internet connection and try again.',
  },
  default: {
    icon: Inbox,
    title: 'Nothing here yet',
    description: 'Content will appear here when available.',
  },
};

export function EmptyState({ 
  variant = 'default',
  title,
  description,
  action,
  icon: CustomIcon,
  className 
}: EmptyStateProps) {
  const config = variantConfig[variant];
  const Icon = CustomIcon || config.icon;
  const finalTitle = title || config.title;
  const finalDescription = description || config.description;

  return (
    <div className={cn(
      'flex flex-col items-center justify-center text-center py-12 px-4',
      'min-h-[300px]',
      className
    )}>
      <div className={cn(
        'flex items-center justify-center w-16 h-16 mb-4 rounded-full',
        'bg-surface-secondary border border-border',
        variant === 'error' && 'bg-red-50 border-red-200 text-red-500',
        variant === 'offline' && 'bg-yellow-50 border-yellow-200 text-yellow-500'
      )}>
        <Icon className="h-8 w-8 text-text-tertiary" />
      </div>
      
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {finalTitle}
      </h3>
      
      <p className="text-text-secondary max-w-md mb-6 leading-relaxed">
        {finalDescription}
      </p>
      
      {action && (
        <PrimaryButton
          onClick={action.onClick}
          className="animate-fade-in"
        >
          {action.label}
        </PrimaryButton>
      )}
    </div>
  );
}

// Specialized empty states for common scenarios
export function SearchEmptyState({ 
  query, 
  onClear 
}: { 
  query: string; 
  onClear: () => void; 
}) {
  return (
    <EmptyState
      variant="search"
      title={`No results for "${query}"`}
      description="Try different keywords or check your spelling."
      action={{
        label: 'Clear search',
        onClick: onClear,
      }}
    />
  );
}

export function NetworkEmptyState({ 
  onExplore 
}: { 
  onExplore: () => void; 
}) {
  return (
    <EmptyState
      variant="connections"
      description="Connect with public health professionals, researchers, and advocates to expand your network."
      action={{
        label: 'Explore professionals',
        onClick: onExplore,
      }}
    />
  );
}

export function OpportunitiesEmptyState({ 
  onCreateAlert 
}: { 
  onCreateAlert: () => void; 
}) {
  return (
    <EmptyState
      variant="opportunities"
      description="Set up job alerts to be notified when new opportunities match your interests."
      action={{
        label: 'Create job alert',
        onClick: onCreateAlert,
      }}
    />
  );
}

export function CampaignsEmptyState({ 
  onCreateCampaign 
}: { 
  onCreateCampaign: () => void; 
}) {
  return (
    <EmptyState
      variant="campaigns"
      title="No campaigns yet"
      description="Start a movement for change. Create your first advocacy campaign and rally the community."
      action={{
        label: 'Create campaign',
        onClick: onCreateCampaign,
      }}
    />
  );
}