import { Briefcase, MapPin, Calendar, ExternalLink } from 'lucide-react';
import { OpportunityListItemProps } from '@/lib/types';
import { Tag } from './ui/Tag';
import { PrimaryButton } from './ui/PrimaryButton';
import { formatRelativeTime, truncateText } from '@/lib/utils';
import { cn } from '@/lib/utils';

export function OpportunityListItem({ 
  opportunity, 
  variant = 'default', 
  onApply 
}: OpportunityListItemProps) {
  const isFeatured = variant === 'featured';

  const typeColors = {
    job: 'bg-green-100 text-green-800',
    internship: 'bg-blue-100 text-blue-800',
    project: 'bg-purple-100 text-purple-800',
  };

  const typeLabels = {
    job: 'Full-time',
    internship: 'Internship',
    project: 'Project',
  };

  return (
    <div className={cn(
      'card animate-fade-in',
      isFeatured && 'border-2 border-accent'
    )}>
      {isFeatured && (
        <div className="flex items-center mb-3">
          <div className="bg-accent text-white px-2 py-1 rounded text-xs font-medium">
            Featured
          </div>
        </div>
      )}

      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="heading text-text mb-1 truncate">
            {opportunity.title}
          </h3>
          <p className="text-accent font-medium mb-2">
            {opportunity.organization}
          </p>
        </div>
        <div className={cn(
          'px-2 py-1 rounded-full text-xs font-medium ml-3',
          typeColors[opportunity.type]
        )}>
          {typeLabels[opportunity.type]}
        </div>
      </div>

      <p className="text-sm text-text mb-3 line-clamp-2">
        {truncateText(opportunity.description, 150)}
      </p>

      <div className="flex items-center space-x-4 mb-3 text-sm text-secondary-text">
        <div className="flex items-center">
          <MapPin className="h-4 w-4 mr-1" />
          {opportunity.location}
        </div>
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-1" />
          {formatRelativeTime(opportunity.postedAt)}
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mb-4">
        {opportunity.tags.slice(0, 3).map((tag) => (
          <Tag key={tag} label={tag} variant="default" />
        ))}
        {opportunity.tags.length > 3 && (
          <span className="text-xs text-secondary-text">
            +{opportunity.tags.length - 3} more
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-secondary-text">
          Expires {formatRelativeTime(opportunity.expiryDate)}
        </span>
        <PrimaryButton
          size="sm"
          onClick={onApply}
          className="flex items-center"
        >
          Apply
          <ExternalLink className="h-3 w-3 ml-1" />
        </PrimaryButton>
      </div>
    </div>
  );
}
