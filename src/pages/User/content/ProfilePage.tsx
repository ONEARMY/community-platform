import { useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, ExternalLink, InternalLink } from 'oa-components';
// eslint-disable-next-line import/no-unresolved
import { ClientOnly } from 'remix-utils/client-only';
import { trackEvent } from 'src/common/Analytics';
import { useProfileStore } from 'src/stores/Profile/profile.store';
import { Flex, Image } from 'theme-ui';

import { UserProfile } from './UserProfile';

import type { Profile, UserCreatedDocs } from 'oa-shared';

interface IProps {
  profile: Profile;
  userCreatedDocs: UserCreatedDocs;
}

/**
 * High level wrapper which loads state, then determines
 * whether to render a MemberProfile or SpaceProfile.
 */
export const ProfilePage = observer((props: IProps) => {
  const { profile, userCreatedDocs } = props;
  const { profile: activeUser, getUpgradeBadgeForCurrentUser } = useProfileStore();

  const isViewingOwnProfile = useMemo(
    () => activeUser?.username === profile?.username,
    [activeUser?.username],
  );
  const showMemberProfile = !profile?.type?.isSpace;

  const upgradeBadge = getUpgradeBadgeForCurrentUser();
  const shouldShowUpgrade = upgradeBadge && isViewingOwnProfile;

  return (
    <Flex
      sx={{
        alignSelf: 'center',
        maxWidth: showMemberProfile ? '42em' : '60em',
        flexDirection: 'column',
        width: '100%',
        marginTop: isViewingOwnProfile ? 4 : [6, 8],
      }}
    >
      <ClientOnly fallback={<></>}>
        {() => (
          <>
            {isViewingOwnProfile && (
              <Flex
                sx={{
                  alignSelf: ['center', 'flex-end'],
                  marginBottom: 6,
                  zIndex: 2,
                  gap: 2,
                  flexDirection: ['column', 'row'],
                }}
              >
                {shouldShowUpgrade && (
                  <ExternalLink
                    href={upgradeBadge.actionUrl}
                    data-cy="UpgradeBadge"
                    onClick={() => {
                      trackEvent({
                        category: 'profiles',
                        action: 'upgradeBadgeClicked',
                        label: upgradeBadge.actionLabel,
                      });
                    }}
                    sx={{ textDecoration: 'none' }}
                  >
                    <Button
                      type="button"
                      sx={{
                        backgroundColor: 'white',
                      }}
                    >
                      <Flex sx={{ alignItems: 'center', gap: 1 }}>
                        {upgradeBadge.badge?.imageUrl && (
                          <Image
                            src={upgradeBadge.badge.imageUrl}
                            sx={{ height: 20, width: 20, flexShrink: 0 }}
                            alt={upgradeBadge.badge.displayName || 'badge'}
                          />
                        )}
                        {upgradeBadge.actionLabel}
                      </Flex>
                    </Button>
                  </ExternalLink>
                )}
                <InternalLink to="/settings">
                  <Button type="button" data-cy="EditYourProfile">
                    Edit Your Profile
                  </Button>
                </InternalLink>
              </Flex>
            )}
          </>
        )}
      </ClientOnly>

      <ClientOnly fallback={<></>}>
        {() => (
          <UserProfile
            user={profile}
            docs={userCreatedDocs}
            isViewingOwnProfile={isViewingOwnProfile}
          />
        )}
      </ClientOnly>
    </Flex>
  );
});
