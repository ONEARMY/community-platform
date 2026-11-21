import { format } from 'date-fns';
import type { MapPin, Profile } from 'oa-shared';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import DefaultMemberImage from 'src/assets/images/default_member.svg';
import { logger } from 'src/logger';
import { mapPinService } from 'src/pages/Maps/map.service';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import MapIcon from '@/components/ui/icons/map.svg?react';
import { Username } from '@/components/ui/username';
import { ProfileTags } from './ProfileTags';

interface IProps {
  user: Profile;
}

export const ProfileHeader = ({ user }: IProps) => {
  const [pin, setPin] = useState<MapPin | undefined>(undefined);
  const { badges, tags } = user;

  useEffect(() => {
    mapPinService
      .getMapPinById(user.id)
      .then((pin) => pin && setPin(pin))
      .catch((error) => logger.error(error));
  }, [user.id]);

  return (
    <>
      <Avatar className="size-20 sm:-mt-21 sm:size-30">
        <AvatarImage
          data-cy={user.type?.isSpace ? 'userImage' : 'profile-avatar'}
          src={user.photo?.publicUrl ?? DefaultMemberImage}
          alt={user.displayName}
        />
      </Avatar>

      <div className="flex w-full flex-wrap justify-center gap-x-4 gap-y-3 text-center">
        <div className="flex w-full flex-col items-center gap-1">
          <h1
            data-cy="userDisplayName"
            className="m-0 font-heading text-3xl font-normal break-words"
          >
            {user.displayName}
          </h1>
          <Username user={{ username: user.username, country: user.country }} isLink={false} />
          <span className="text-sm">Member since {format(user.createdAt, 'MMMM yyyy')}</span>
        </div>

        {pin && (
          <Link
            to={`/map#${user.username}`}
            data-testid="location-link"
            className="flex items-center justify-center gap-2 hover:underline sm:mb-3 sm:w-full"
          >
            <MapIcon aria-hidden="true" className="size-5 shrink-0" />
            Find on map
          </Link>
        )}

        {badges && badges.length > 0 && (
          <ul className="contents sm:order-last sm:flex sm:w-full sm:flex-wrap sm:justify-center sm:gap-x-4">
            {badges.map((badge) => (
              <li
                key={badge.id}
                data-testid={`badge_${badge.name}`}
                className="flex items-center gap-2"
              >
                <img src={badge.imageUrl} alt="" className="size-5 shrink-0 object-contain" />
                {badge.actionUrl ? (
                  <a
                    href={badge.actionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {badge.displayName}
                  </a>
                ) : (
                  badge.displayName
                )}
              </li>
            ))}
          </ul>
        )}

        {tags && tags.length > 0 && <ProfileTags tags={tags} />}
      </div>
    </>
  );
};
