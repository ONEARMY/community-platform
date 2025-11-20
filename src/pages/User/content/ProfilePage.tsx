import { useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, InternalLink } from 'oa-components';
// eslint-disable-next-line import/no-unresolved
import { ClientOnly } from 'remix-utils/client-only';
import { useProfileStore } from 'src/stores/Profile/profile.store';
import { Flex } from 'theme-ui';

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
  const { profile: activeUser } = useProfileStore();
  const isViewingOwnProfile = useMemo(
    () => activeUser?.username === profile?.username,
    [activeUser?.username],
  );
  const showMemberProfile = !profile?.type?.isSpace;

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
      {isViewingOwnProfile && (
        <InternalLink
          sx={{
            alignSelf: ['center', 'flex-end'],
            marginBottom: 6,
            zIndex: 2,
          }}
          to="/settings"
        >
          <Button type="button" data-cy="EditYourProfile">
            Edit Your Profile
          </Button>
        </InternalLink>
      )}

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
