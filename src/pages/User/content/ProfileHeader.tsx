import { format, formatDistanceToNow } from 'date-fns';
import { MemberBadge } from 'oa-components';
import type { Profile } from 'oa-shared';
import DefaultMemberImage from 'src/assets/images/default_member.svg';
import { shortFormatNumber } from 'src/utils/helpers';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import StarActiveIcon from '@/components/ui/icons/star-active.svg?react';
import WebsiteIcon from '@/components/ui/icons/website.svg?react';
import { Username } from '@/components/ui/username';
import { ProfileTags } from './ProfileTags';
import { ProfileVisitorPolicy } from './ProfileVisitorPolicy';

interface IProps {
  user: Profile;
  onContact?: () => void;
  children?: React.ReactNode;
}

const chip = 'flex items-center rounded-md border border-border px-1.5 py-0.5 text-xs';
const stat = 'flex items-center gap-2 rounded-md bg-muted px-2 py-1 text-sm';

export const ProfileHeader = ({ user, onContact, children }: IProps) => {
  const { about, badges, lastActive, tags, type } = user;
  const website = type?.isSpace && user.website;
  const usefulCount = user.authorUsefulVotes?.reduce((sum, vote) => sum + vote.voteCount, 0) || 0;

  return (
    <div className="relative flex flex-col gap-6 sm:flex-row sm:gap-10">
      {lastActive && (
        <span className="absolute top-0 right-0 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          Last active {formatDistanceToNow(lastActive, { addSuffix: true })}
        </span>
      )}

      <div className="flex shrink-0 flex-col gap-4 sm:w-40">
        <div className="relative -mt-14 self-start sm:-mt-18">
          <Avatar className="size-28 sm:size-40">
            <AvatarImage
              data-cy={type?.isSpace ? 'userImage' : 'profile-avatar'}
              src={user.photo?.publicUrl ?? DefaultMemberImage}
              alt={user.displayName}
            />
          </Avatar>
          {type && (
            <span className="absolute right-0 bottom-0 flex">
              <MemberBadge profileType={type} size={40} useLowDetailVersion />
            </span>
          )}
        </div>

        {(!!badges?.length || usefulCount > 0) && (
          <ul className="flex flex-wrap gap-2 sm:flex-col sm:items-start">
            {badges?.map((badge) => (
              <li key={badge.id} data-testid={`badge_${badge.name}`} className={stat}>
                <img src={badge.imageUrl} alt="" className="size-4 shrink-0 object-contain" />
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
            {usefulCount > 0 && (
              <li data-testid="profile-useful-count" className={stat}>
                <StarActiveIcon aria-hidden="true" className="size-4 shrink-0" />
                {shortFormatNumber(usefulCount)} Useful
              </li>
            )}
          </ul>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-4 sm:pt-10">
        <div className="flex flex-col gap-2">
          <h1
            data-cy="userDisplayName"
            className="m-0 font-heading text-3xl font-normal break-words"
          >
            {user.displayName}
          </h1>
          <div className="flex flex-wrap gap-1.5">
            <span className={chip}>
              <Username user={{ username: user.username, country: user.country }} isLink={false} />
            </span>
            <span className={chip}>Member since {format(user.createdAt, 'MMMM yyyy')}</span>
          </div>
        </div>

        {about ? (
          <p className="m-0 text-sm whitespace-pre-wrap text-muted-foreground">{about}</p>
        ) : (
          <p className="m-0 text-sm text-muted-foreground italic">
            Looks like {type?.isSpace ? 'this space' : 'this user'} hasn't gotten around to filling
            this in yet...
          </p>
        )}

        {website && (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            data-cy="profile-website"
            className="flex min-w-0 items-center gap-2 text-sm break-all text-link hover:underline"
          >
            <WebsiteIcon aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
            {website}
          </a>
        )}

        {tags && tags.length > 0 && <ProfileTags tags={tags} />}

        <ProfileVisitorPolicy user={user} onContact={onContact} />

        {children}
      </div>
    </div>
  );
};
