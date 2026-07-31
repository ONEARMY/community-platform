import { MemberBadge, MemberHistory } from 'oa-components';
import type { Profile, UserCreatedDocs } from 'oa-shared';
import { PremiumTier } from 'oa-shared';
import { useContext } from 'react';
import { PremiumTierWrapper } from 'src/common/PremiumTierWrapper';
import { TenantContext } from 'src/pages/common/TenantContext';
import { useProfileStore } from 'src/stores/Profile/profile.store';
import { isContactable } from 'src/utils/helpers';
import { Alert, Card, Flex } from 'theme-ui';
import { Impact } from '../impact/Impact';
import { ProfileContact } from './ProfileContact';
import { ProfileDetails } from './ProfileDetails';
import { ProfileHeader } from './ProfileHeader';
import { ProfileImage } from './ProfileImage';
import UserCreatedDocuments from './UserCreatedDocuments';

interface IProps {
  docs: UserCreatedDocs;
  isViewingOwnProfile: boolean;
  user: Profile;
}

export const UserProfile = ({ docs, isViewingOwnProfile, user }: IProps) => {
  const { impact, type } = user;
  const { isComplete } = useProfileStore();
  const tenantContext = useContext(TenantContext);

  const isMember = !type?.isSpace;
  const hasContactOption =
    (!tenantContext?.noMessaging && isContactable(user.isContactable)) || !!user.website;
  const hasContributed = docs?.projects.length + docs?.research.length + docs?.questions.length > 0;
  const hasImpacted = !!impact;

  const showEmptyProfileAlert = isViewingOwnProfile && isComplete === false;

  return (
    <Flex
      data-cy={isMember ? 'MemberProfile' : 'SpaceProfile'}
      sx={{
        width: '100%',
        height: '100%',
        flexDirection: 'column',
      }}
    >
      {isMember && (
        <MemberBadge
          profileType={type || undefined}
          size={50}
          sx={{
            alignSelf: 'center',
            position: 'absolute',
            transform: 'translateY(-25px)',
          }}
          useLowDetailVersion
        />
      )}
      <Card variant="responsive" sx={{ borderRadius: [3, 3, 3] }}>
        <ProfileImage user={user} />
        <Flex
          sx={{
            borderTop: isMember ? '' : '2px solid',
            flexDirection: 'column',
            gap: 4,
            padding: [2, 4],
          }}
        >
          {showEmptyProfileAlert && (
            <Alert variant="info" data-cy="emptyProfileMessage">
              Oh hey! Your profile is looking SO empty. Fancy filling it in...?
            </Alert>
          )}

          <Flex sx={{ width: '100%', flexDirection: 'column', gap: 4 }}>
            <ProfileHeader user={user} />

            <ProfileDetails docs={docs} profile={user} />
            {hasContributed && <UserCreatedDocuments columns={isMember ? 1 : 2} docs={docs} />}
            {hasImpacted && tenantContext?.showImpact && <Impact impact={impact} user={user} />}
            {hasContactOption && (
              <ProfileContact user={user} isViewingOwnProfile={isViewingOwnProfile} />
            )}
          </Flex>
          <PremiumTierWrapper tierRequired={PremiumTier.ONE}>
            <MemberHistory memberSince={user.createdAt} lastActive={user.lastActive} />
          </PremiumTierWrapper>
        </Flex>
      </Card>
    </Flex>
  );
};
