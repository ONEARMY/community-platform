import type { ProfileBadge } from 'oa-shared';
import { cn } from '@/lib/utils';

type UserBadgeProps = {
  badge: ProfileBadge;
  className?: string;
};

function UserBadge({ badge, className }: UserBadgeProps) {
  return (
    <img
      data-slot="user-badge"
      data-testid={`Username: ${badge.name} badge`}
      src={badge.imageUrl}
      alt={badge.displayName}
      className={cn('h-icon w-auto shrink-0 object-contain', className)}
    />
  );
}

export { UserBadge };
