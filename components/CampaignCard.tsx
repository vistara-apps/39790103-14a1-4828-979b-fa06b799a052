import { Users, Calendar, Target, ArrowRight } from 'lucide-react';
import { CampaignCardProps } from '@/lib/types';
import { PrimaryButton } from './ui/PrimaryButton';
import { formatDate, truncateText } from '@/lib/utils';
import { cn } from '@/lib/utils';

export function CampaignCard({ 
  campaign, 
  variant = 'active', 
  onJoin 
}: CampaignCardProps) {
  const isCompleted = variant === 'completed';

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className={cn(
      'card animate-fade-in hover-lift cursor-pointer transition-all',
      isCompleted && 'opacity-75'
    )}>
      <div className="flex items-start justify-between mb-3">
        <h3 className="heading text-text flex-1 min-w-0 truncate">
          {campaign.title}
        </h3>
        <div className={cn(
          'px-3 py-1 rounded-full text-xs font-medium ml-3 animate-scale-in',
          statusColors[campaign.status]
        )}>
          {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
        </div>
      </div>

      <p className="text-sm text-text mb-3 line-clamp-2">
        {truncateText(campaign.description, 120)}
      </p>

      <div className="bg-accent/5 rounded-lg p-3 mb-3">
        <div className="flex items-start">
          <Target className="h-4 w-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-medium text-accent mb-1">Goal</p>
            <p className="text-sm text-text">{campaign.goal}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-secondary-text">
            <Calendar className="h-4 w-4 mr-1" />
            {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
          </div>
        </div>
        
        {campaign.participantCount && (
          <div className="flex items-center text-sm text-secondary-text">
            <Users className="h-4 w-4 mr-1" />
            {campaign.participantCount} participants
          </div>
        )}
      </div>

      <div className="bg-gray-50 rounded-lg p-3 mb-4">
        <p className="text-xs font-medium text-secondary-text mb-1">Call to Action</p>
        <p className="text-sm text-text">{campaign.callToAction}</p>
      </div>

      {!isCompleted && onJoin && (
        <PrimaryButton
          onClick={onJoin}
          className="w-full flex items-center justify-center transition-all hover:bg-primary-600 hover:shadow-md"
        >
          Join Campaign
          <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
        </PrimaryButton>
      )}

      {isCompleted && (
        <div className="text-center py-2">
          <span className="text-sm text-secondary-text">Campaign Completed</span>
        </div>
      )}
    </div>
  );
}
