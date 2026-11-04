import { format } from 'date-fns';
import type { ProfileBadge } from 'oa-shared';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';

type UserBadgeProps = {
  badge: ProfileBadge;
  className?: string;
};

function UserBadge({ badge, className }: UserBadgeProps) {
  const image = (
    <img
      data-slot="user-badge"
      data-testid={`Username: ${badge.name} badge`}
      src={badge.imageUrl}
      alt={badge.displayName}
      className={cn('h-icon w-auto shrink-0 object-contain', className)}
    />
  );

  if (!badge.since) {
    return image;
  }

  return (
    <Tooltip>
      <TooltipTrigger render={image} />
      <TooltipContent>
        {badge.displayName} since {format(new Date(badge.since), 'MMM yyyy')}
      </TooltipContent>
    </Tooltip>
  );
}

export { UserBadge };
