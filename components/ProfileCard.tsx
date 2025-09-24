import Image from 'next/image';
import { User, MapPin, Tag as TagIcon } from 'lucide-react';
import { ProfileCardProps } from '@/lib/types';
import { Tag } from './ui/Tag';
import { PrimaryButton } from './ui/PrimaryButton';
import { getInitials, truncateText } from '@/lib/utils';
import { cn } from '@/lib/utils';

export function ProfileCard({ 
  user, 
  variant = 'default', 
  onConnect 
}: ProfileCardProps) {
  const isCompact = variant === 'compact';

  return (
    <div className={cn(
      'card-interactive animate-fade-in',
      isCompact ? 'p-3' : 'p-4'
    )}>
      <div className="flex items-start space-x-3">
        {/* Profile Image */}
        <div className={cn(
          'flex-shrink-0 rounded-full bg-accent/10 flex items-center justify-center ring-2 ring-accent/20',
          isCompact ? 'h-12 w-12' : 'h-16 w-16'
        )}>
          {user.profileImageUrl ? (
            <Image
              src={user.profileImageUrl}
              alt={user.displayName}
              width={isCompact ? 48 : 64}
              height={isCompact ? 48 : 64}
              className="rounded-full object-cover"
            />
          ) : (
            <span className={cn(
              'font-semibold text-accent',
              isCompact ? 'text-sm' : 'text-lg'
            )}>
              {getInitials(user.displayName)}
            </span>
          )}
        </div>

        {/* Profile Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <h3 className={cn(
                'font-semibold text-foreground truncate',
                isCompact ? 'text-sm' : 'text-base'
              )}>
                {user.displayName}
              </h3>
              {user.username && (
                <p className={cn(
                  'text-text-secondary',
                  isCompact ? 'text-xs' : 'text-sm'
                )}>
                  @{user.username}
                </p>
              )}
            </div>
            {onConnect && !isCompact && (
              <PrimaryButton
                variant="outline"
                size="sm"
                onClick={onConnect}
              >
                Connect
              </PrimaryButton>
            )}
          </div>

          {/* Location */}
          <div className="flex items-center mt-1">
            <MapPin className={cn(
              'text-text-secondary mr-1',
              isCompact ? 'h-3 w-3' : 'h-4 w-4'
            )} />
            <span className={cn(
              'text-text-secondary',
              isCompact ? 'text-xs' : 'text-sm'
            )}>
              {user.location}
            </span>
          </div>

          {/* Bio */}
          {!isCompact && (
            <p className="text-sm text-foreground mt-2 line-clamp-2">
              {truncateText(user.bio, 120)}
            </p>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mt-2">
            {(isCompact ? user.expertiseTags.slice(0, 2) : user.expertiseTags.slice(0, 3)).map((tag) => (
              <Tag key={tag} label={tag} variant="default" />
            ))}
            {user.expertiseTags.length > (isCompact ? 2 : 3) && (
              <span className={cn(
                'text-text-secondary',
                isCompact ? 'text-xs' : 'text-sm'
              )}>
                +{user.expertiseTags.length - (isCompact ? 2 : 3)} more
              </span>
            )}
          </div>

          {/* Connect button for compact variant */}
          {onConnect && isCompact && (
            <div className="mt-2">
              <PrimaryButton
                variant="outline"
                size="sm"
                onClick={onConnect}
                className="w-full"
              >
                Connect
              </PrimaryButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
