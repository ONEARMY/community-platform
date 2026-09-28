import { ProfileLink } from 'oa-components';
import type { Profile } from 'oa-shared';
import { useContext } from 'react';
import { ClientOnly } from 'remix-utils/client-only';
import { UserAction } from 'src/common/UserAction';
import { TenantContext } from 'src/pages/common/TenantContext';
import { isUserContactable } from 'src/utils/helpers';
import { Box, Flex, Text } from 'theme-ui';
import { UserContactFormAvailable } from '../contact';
import { UserContactForm } from '../contact/UserContactForm';
import { UserContactFormNotLoggedIn } from '../contact/UserContactFormNotLoggedIn';

interface IProps {
  user: Profile;
  isViewingOwnProfile: boolean;
}

export const ProfileContact = ({ user, isViewingOwnProfile }: IProps) => {
  const isUserProfileContactable = isUserContactable(user);
  const tenantContext = useContext(TenantContext);
  const shouldShowContactOutput = !tenantContext?.noMessaging;

  if (!shouldShowContactOutput && !user.website) {
    return null;
  }

  return (
    <Flex sx={{ flexDirection: 'column', gap: '1rem' }}>
      <Text variant="h2">Contact</Text>
      {shouldShowContactOutput && (
        <Box data-cy="UserContactWrapper" sx={{}}>
          <ClientOnly fallback={<></>}>
            {() => (
              <UserAction
                loggedIn={
                  isViewingOwnProfile ? (
                    <UserContactFormAvailable isUserProfileContactable={isUserProfileContactable} />
                  ) : (
                    <UserContactForm user={user} />
                  )
                }
                loggedOut={
                  isUserProfileContactable ? (
                    <UserContactFormNotLoggedIn user={user} />
                  ) : (
                    <UserContactFormNotLoggedIn user={user} />
                  )
                }
              />
            )}
          </ClientOnly>
        </Box>
      )}

      {user.website && (
        <Flex sx={{ flexDirection: 'column', gap: '0.5rem' }}>
          <span>Website</span>
          <ProfileLink url={user.website} />
        </Flex>
      )}
    </Flex>
  );
};
