import type { Profile, UserCreatedDocs } from 'oa-shared';
import { useContext } from 'react';
import { TenantContext } from 'src/pages/common/TenantContext';
import { useProfileStore } from 'src/stores/Profile/profile.store';
import { isContactable, isUserContactable } from 'src/utils/helpers';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import WebsiteIcon from '@/components/ui/icons/website.svg?react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { ProfileContact } from './ProfileContact';
import { ProfileContributions } from './ProfileContributions';
import { ProfileHeader } from './ProfileHeader';
import { ProfileImage } from './ProfileImage';
import { ProfileSupportButton } from './ProfileSupportButton';

interface IProps {
  docs: UserCreatedDocs;
  isViewingOwnProfile: boolean;
  user: Profile;
}

export const UserProfile = ({ docs, isViewingOwnProfile, user }: IProps) => {
  const { about, coverImages, type, website } = user;
  const { isComplete } = useProfileStore();
  const tenantContext = useContext(TenantContext);

  const isMember = !type?.isSpace;
  const hasCoverImages = !isMember && !!coverImages?.length;
  const hasContactOption =
    (!tenantContext?.noMessaging && isContactable(user.isContactable)) || !!user.website;
  const showContact =
    !tenantContext?.noMessaging &&
    (isViewingOwnProfile ? hasContactOption : isUserContactable(user));

  const showSupport = !isMember && !!user.donationsEnabled;
  const showEmptyProfileAlert = isViewingOwnProfile && isComplete === false;

  return (
    <div data-cy={isMember ? 'MemberProfile' : 'SpaceProfile'} className="flex w-full flex-col">
      {hasCoverImages && <ProfileImage images={coverImages} alt={`${user.displayName} cover`} />}
      <div
        className={cn(
          'relative mx-auto flex w-full max-w-128 flex-col gap-6',
          hasCoverImages ? '-mt-10 sm:-mt-25' : 'mt-6 sm:mt-21',
        )}
      >
        <Card variant="elevated" className="items-center">
          <ProfileHeader user={user} />

          {showEmptyProfileAlert && (
            <Alert variant="info" data-cy="emptyProfileMessage" className="w-full">
              <AlertDescription>
                Oh hey! Your profile is looking SO empty. Fancy filling it in...?
              </AlertDescription>
            </Alert>
          )}

          <div className="flex w-full flex-col gap-3">
            {about ? (
              <p className="m-0 whitespace-pre-wrap text-muted-foreground">{about}</p>
            ) : (
              <p className="m-0 text-muted-foreground italic">
                Looks like {isMember ? 'this user' : 'this space'} hasn't gotten around to filling
                this in yet...
              </p>
            )}
            {(website || showSupport || showContact) && (
              <>
                <Separator />
                <div
                  className={cn(
                    'flex flex-wrap items-center gap-3',
                    website ? 'justify-between' : 'justify-center',
                  )}
                >
                  {website && (
                    <a
                      href={website}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cy="profile-website"
                      className="flex min-w-0 items-center gap-2 text-sm break-all text-link hover:underline"
                    >
                      <WebsiteIcon
                        aria-hidden="true"
                        className="size-4 shrink-0 text-muted-foreground"
                      />
                      {website}
                    </a>
                  )}
                  <div className="flex flex-wrap justify-center gap-2">
                    {showSupport && <ProfileSupportButton profile={user} />}
                    {showContact && (
                      <ProfileContact user={user} isViewingOwnProfile={isViewingOwnProfile} />
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </Card>

        <ProfileContributions docs={docs} username={user.username ?? ''} />
      </div>
    </div>
  );
};
