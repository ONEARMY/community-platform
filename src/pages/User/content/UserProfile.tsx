import type { MapPin, Profile, UserCreatedDocs } from 'oa-shared';
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router';
import { logger } from 'src/logger';
import { TenantContext } from 'src/pages/common/TenantContext';
import { mapPinService } from 'src/pages/Maps/map.service';
import { useProfileStore } from 'src/stores/Profile/profile.store';
import { isUserContactable } from 'src/utils/helpers';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import MapIcon from '@/components/ui/icons/map.svg?react';
import { cn } from '@/lib/utils';
import { Impact } from '../impact/Impact';
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
  const { coverImages, impact, type } = user;
  const { isComplete } = useProfileStore();
  const tenantContext = useContext(TenantContext);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [pin, setPin] = useState<MapPin | undefined>(undefined);

  useEffect(() => {
    mapPinService
      .getMapPinById(user.id)
      .then((pin) => pin && setPin(pin))
      .catch((error) => logger.error(error));
  }, [user.id]);

  const isMember = !type?.isSpace;
  const hasCoverImages = !isMember && !!coverImages?.length;
  const showContact =
    !tenantContext?.noMessaging && (isViewingOwnProfile || isUserContactable(user));

  const showSupport = !isMember && !!user.donationsEnabled;
  const showImpact = !!impact && !!tenantContext?.showImpact;
  const showEmptyProfileAlert = isViewingOwnProfile && isComplete === false;

  return (
    <div
      data-cy={isMember ? 'MemberProfile' : 'SpaceProfile'}
      className={cn(
        'mx-auto flex w-full max-w-192 flex-col gap-3',
        !hasCoverImages && 'mt-10 sm:mt-12',
      )}
    >
      <Card variant="flush">
        {hasCoverImages && <ProfileImage images={coverImages} alt={`${user.displayName} cover`} />}
        <div className="flex flex-col gap-6 p-4 sm:p-10">
          <ProfileHeader
            user={user}
            onContact={
              showContact && !isViewingOwnProfile ? () => setIsContactOpen(true) : undefined
            }
          >
            {showEmptyProfileAlert && (
              <Alert variant="info" data-cy="emptyProfileMessage">
                <AlertDescription>
                  Oh hey! Your profile is looking SO empty. Fancy filling it in...?
                </AlertDescription>
              </Alert>
            )}
          </ProfileHeader>

          {(showContact || showSupport || pin) && (
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              {showContact && (
                <ProfileContact
                  user={user}
                  isViewingOwnProfile={isViewingOwnProfile}
                  open={isContactOpen}
                  onOpenChange={setIsContactOpen}
                />
              )}
              {showSupport && <ProfileSupportButton profile={user} />}
              {pin && (
                <Button
                  variant="outline"
                  nativeButton={false}
                  render={<Link to={`/map#${user.username}`} />}
                  data-testid="location-link"
                >
                  <MapIcon data-icon="inline-start" aria-hidden="true" />
                  Find on map
                </Button>
              )}
            </div>
          )}
        </div>
      </Card>

      <Card variant="outline">
        <div className="flex flex-col gap-10 px-4 sm:px-10">
          <ProfileContributions docs={docs} username={user.username ?? ''} />
          {showImpact && (
            <section className="flex flex-col gap-4">
              <Impact impact={impact} user={user} />
            </section>
          )}
        </div>
      </Card>
    </div>
  );
};
