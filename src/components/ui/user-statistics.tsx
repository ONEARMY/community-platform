import type { MapPin, Profile } from 'oa-shared';
import { Link } from 'react-router';
import EyeIcon from './icons/eye.svg?react';
import ForumIcon from './icons/icon-forum.svg?react';
import HowToCountIcon from './icons/icon-library.svg?react';
import ResearchIcon from './icons/icon-research.svg?react';
import StarActiveIcon from './icons/icon-star-active.svg?react';
import MapIcon from './icons/map.svg?react';

export interface UserStatisticsProps {
  profile: Pick<Profile, 'id' | 'username' | 'badges' | 'totalViews' | 'country'>;
  pin?: Pick<MapPin, 'country'>;
  libraryCount: number;
  usefulCount: number;
  researchCount: number;
  questionCount: number;
  showViews: boolean;
  className?: string;
}

const isEmpty = (props: UserStatisticsProps & { pin?: Pick<MapPin, 'country'> }) =>
  !props.pin &&
  !props.profile.badges?.length &&
  !props.profile.country &&
  !props.libraryCount &&
  !props.researchCount &&
  !props.profile.totalViews &&
  !props.questionCount &&
  !props.usefulCount;

export const UserStatistics = (props: UserStatisticsProps) => {
  if (isEmpty(props)) {
    return null;
  }

  return (
    <div className={`p-1 ${props.className || ''}`}>
      <div className="flex flex-row sm:flex-col items-center sm:items-start justify-center sm:justify-start gap-4">
        <div className="flex flex-col gap-4">
          {props.pin && props.profile.username && (
            <Link
              to={`/map#${props.profile.username}`}
              className="text-foreground hover:underline"
              data-testid="location-link"
            >
              <div className="flex items-center gap-2">
                <MapIcon className="size-5" />
                <span>Location: {props.pin.country || 'View on Map'}</span>
              </div>
            </Link>
          )}

          {props.profile.badges?.map((badge) => (
            <div
              key={badge.id}
              className="flex items-center gap-1"
              data-testid={`badge_${badge.name}`}
            >
              <img width={20} height={20} src={badge.imageUrl} alt="" />
              <div>
                {badge.actionUrl ? (
                  <a
                    href={badge.actionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:underline"
                  >
                    <span>{badge.displayName}</span>
                  </a>
                ) : (
                  <span className="text-foreground">{badge.displayName}</span>
                )}
              </div>
            </div>
          ))}

          {props.usefulCount > 0 && (
            <div className="flex items-center gap-2" data-testid="useful-stat">
              <StarActiveIcon className="size-5 shrink-0" />
              Useful: {props.usefulCount}
            </div>
          )}

          {props.libraryCount > 0 && props.profile.username && (
            <Link
              to={`/library?q=${props.profile.username}`}
              className="text-foreground hover:underline"
              data-testid="library-link"
            >
              <div className="flex items-center gap-2" data-testid="library-stat">
                <HowToCountIcon className="size-5 shrink-0" />
                Library: {props.libraryCount}
              </div>
            </Link>
          )}

          {props.researchCount > 0 && props.profile.username && (
            <Link
              to={`/research?q=${props.profile.username}`}
              className="text-foreground hover:underline"
              data-testid="research-link"
            >
              <div className="flex items-center gap-2" data-testid="research-stat">
                <ResearchIcon className="size-5 shrink-0" />
                Research: {props.researchCount}
              </div>
            </Link>
          )}

          {props.questionCount > 0 && (
            <Link
              to="/questions"
              className="text-foreground hover:underline"
              data-testid="questions-link"
            >
              <div className="flex items-center gap-2" data-testid="questions-stat">
                <ForumIcon className="size-5 shrink-0" />
                Questions: {props.questionCount}
              </div>
            </Link>
          )}

          {props.showViews && props.profile.totalViews > 0 && (
            <div className="flex items-center gap-2" data-testid="profile-views-stat">
              <EyeIcon className="size-5 shrink-0" />
              <span>Views: {props.profile.totalViews}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
