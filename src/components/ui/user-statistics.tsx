import type { MapPin, Profile } from 'oa-shared';
import type { ComponentProps, ReactNode } from 'react';
import { Link } from 'react-router';
import Eye from './icons/eye.svg?react';
import Forum from './icons/forum.svg?react';
import Library from './icons/library.svg?react';
import MapIcon from './icons/map.svg?react';
import Research from './icons/research.svg?react';
import StarActive from './icons/star-active.svg?react';

type UserStatisticsProps = {
  profile: Pick<Profile, 'id' | 'username' | 'badges' | 'totalViews' | 'country'>;
  pin?: Pick<MapPin, 'country'>;
  libraryCount: number;
  usefulCount: number;
  researchCount: number;
  questionCount: number;
  showViews: boolean;
};

function Stat({ icon, children, ...props }: ComponentProps<'div'> & { icon: ReactNode }) {
  return (
    <div className="flex items-center gap-2" {...props}>
      {icon}
      {children}
    </div>
  );
}

const iconClassName = 'size-4.5 shrink-0';

function UserStatistics({
  profile,
  pin,
  libraryCount,
  usefulCount,
  researchCount,
  questionCount,
  showViews,
}: UserStatisticsProps) {
  const isEmpty =
    !pin &&
    !profile.badges?.length &&
    !profile.country &&
    !libraryCount &&
    !researchCount &&
    !profile.totalViews &&
    !questionCount &&
    !usefulCount;

  if (isEmpty) {
    return null;
  }

  return (
    <div data-slot="user-statistics" className="flex justify-center p-1 sm:justify-start">
      <div className="flex flex-col gap-4">
        {pin && profile.username && (
          <Link
            to={'/map#' + profile.username}
            className="hover:underline"
            data-testid="location-link"
          >
            <Stat icon={<MapIcon className={iconClassName} />}>
              Location: {pin.country || 'View on Map'}
            </Stat>
          </Link>
        )}

        {profile.badges?.map((badge) => (
          <div
            key={badge.id}
            className="flex items-center gap-1"
            data-testid={`badge_${badge.name}`}
          >
            <img src={badge.imageUrl} alt="" className="size-4 shrink-0 object-contain" />
            {badge.actionUrl ? (
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
                href={badge.actionUrl}
              >
                {badge.displayName}
              </a>
            ) : (
              <span>{badge.displayName}</span>
            )}
          </div>
        ))}

        {usefulCount > 0 && (
          <Stat icon={<StarActive className={iconClassName} />} data-testid="useful-stat">
            {`Useful: ${usefulCount}`}
          </Stat>
        )}

        {libraryCount > 0 && profile.username && (
          <Link
            to={'/library?q=' + profile.username}
            className="hover:underline"
            data-testid="library-link"
          >
            <Stat icon={<Library className={iconClassName} />} data-testid="library-stat">
              {`Library: ${libraryCount}`}
            </Stat>
          </Link>
        )}

        {researchCount > 0 && profile.username && (
          <Link
            to={'/research?q=' + profile.username}
            className="hover:underline"
            data-testid="research-link"
          >
            <Stat icon={<Research className={iconClassName} />} data-testid="research-stat">
              {`Research: ${researchCount}`}
            </Stat>
          </Link>
        )}

        {questionCount > 0 && (
          <Link to="/questions" className="hover:underline" data-testid="questions-link">
            <Stat icon={<Forum className={iconClassName} />} data-testid="questions-stat">
              {`Questions: ${questionCount}`}
            </Stat>
          </Link>
        )}

        {showViews && profile.totalViews > 0 && (
          <Stat icon={<Eye className={iconClassName} />} data-testid="profile-views-stat">
            {`Views: ${profile.totalViews}`}
          </Stat>
        )}
      </div>
    </div>
  );
}

export { UserStatistics, type UserStatisticsProps };
