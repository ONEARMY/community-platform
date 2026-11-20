import { cva, type VariantProps } from 'class-variance-authority';
import { countryToAlpha2 } from 'country-to-iso';
import type { Author } from 'oa-shared';
import type { HTMLAttributeAnchorTarget } from 'react';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage } from './avatar';
import { FlagIcon } from './flag-icon';
import FlagUnknown from './icons/flag-unknown.svg?react';
import { UserBadge } from './user-badge';

const usernameLinkVariants = cva(
  'inline-flex max-w-full min-w-0 rounded-card-flat border border-transparent text-sm text-foreground transition-all duration-80 ease-out hover:border-highlight hover:bg-softblue focus:border-highlight focus:bg-softblue focus:outline-none',
  {
    variants: {
      variant: {
        default: '-ml-1 py-thin',
        inline: '-translate-y-px',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

type UsernameProps = {
  user: Partial<Author>;
  isLink?: boolean;
  target?: HTMLAttributeAnchorTarget;
  showAvatar?: boolean;
  className?: string;
} & VariantProps<typeof usernameLinkVariants>;

function Username({
  user,
  isLink = true,
  target = '_self',
  showAvatar = false,
  variant,
  className,
}: UsernameProps) {
  const { username, badges, country, photo, displayName } = user;

  if (!username) {
    return null;
  }

  const countryCode = country ? countryToAlpha2(country) : null;
  const rootClassName = showAvatar ? undefined : className;

  const body = (
    <span
      data-slot="username"
      data-cy="Username"
      className={cn('flex min-w-0 items-center gap-1 px-1', !isLink && rootClassName)}
    >
      {countryCode ? (
        <span data-testid="Username: known flag" className="flex">
          <FlagIcon countryCode={countryCode} />
        </span>
      ) : (
        <FlagUnknown
          data-testid="Username: unknown flag"
          className="h-flag-height w-flag-width shrink-0 overflow-hidden rounded-flag"
        />
      )}

      <span className="truncate text-foreground" title={username}>
        {username}
      </span>

      {badges && badges.length > 0 && (
        <span className="flex items-center gap-1">
          {badges.map((badge) => (
            <UserBadge key={badge.id} badge={badge} />
          ))}
        </span>
      )}
    </span>
  );

  const name = isLink ? (
    <Link
      to={`/u/${username}`}
      target={target}
      className={cn(usernameLinkVariants({ variant }), rootClassName)}
    >
      {body}
    </Link>
  ) : (
    body
  );

  if (!showAvatar) {
    return name;
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {photo && (
        <Avatar data-cy="authorAvatar">
          <AvatarImage src={photo.publicUrl} alt={displayName} loading="lazy" />
        </Avatar>
      )}
      {name}
    </div>
  );
}

export { Username, usernameLinkVariants };
