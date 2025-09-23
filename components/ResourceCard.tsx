import { ExternalLink, BookOpen, BarChart3, FileText, GraduationCap } from 'lucide-react';
import { ResourceCardProps } from '@/lib/types';
import { Tag } from './ui/Tag';
import { PrimaryButton } from './ui/PrimaryButton';
import { truncateText } from '@/lib/utils';
import { cn } from '@/lib/utils';

export function ResourceCard({ 
  resource, 
  variant = 'default', 
  onView 
}: ResourceCardProps) {
  const isNews = variant === 'news';

  const typeIcons = {
    data: BarChart3,
    research: FileText,
    policy: BookOpen,
    education: GraduationCap,
  };

  const typeColors = {
    data: 'bg-blue-100 text-blue-800',
    research: 'bg-green-100 text-green-800',
    policy: 'bg-purple-100 text-purple-800',
    education: 'bg-orange-100 text-orange-800',
  };

  const typeLabels = {
    data: 'Data & Statistics',
    research: 'Research',
    policy: 'Policy',
    education: 'Education',
  };

  const Icon = typeIcons[resource.type];

  return (
    <div className={cn(
      'card animate-fade-in',
      isNews && 'border-l-4 border-l-accent'
    )}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <div className={cn(
            'p-2 rounded-lg mr-3',
            typeColors[resource.type]
          )}>
            <Icon className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="heading text-text truncate">
              {resource.title}
            </h3>
            <span className={cn(
              'text-xs font-medium px-2 py-1 rounded-full',
              typeColors[resource.type]
            )}>
              {typeLabels[resource.type]}
            </span>
          </div>
        </div>
      </div>

      <p className="text-sm text-text mb-3 line-clamp-3">
        {truncateText(resource.description, 150)}
      </p>

      <div className="flex flex-wrap gap-1 mb-4">
        {resource.tags.slice(0, 3).map((tag) => (
          <Tag key={tag} label={tag} variant="default" />
        ))}
        {resource.tags.length > 3 && (
          <span className="text-xs text-secondary-text">
            +{resource.tags.length - 3} more
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-accent hover:underline flex items-center"
        >
          View Resource
          <ExternalLink className="h-3 w-3 ml-1" />
        </a>
        <PrimaryButton
          variant="outline"
          size="sm"
          onClick={onView}
        >
          Learn More
        </PrimaryButton>
      </div>
    </div>
  );
}
