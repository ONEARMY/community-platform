import { observer } from 'mobx-react';
import { Button, ExternalLink, InternalLink, Modal } from 'oa-components';
import type { Profile, UserCreatedDocs } from 'oa-shared';
import { UserRole } from 'oa-shared';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { ClientOnly } from 'remix-utils/client-only';
import { trackEvent } from 'src/common/Analytics';
import { useToast } from 'src/common/Toast';
import { useProfileStore } from 'src/stores/Profile/profile.store';
import { Checkbox, Flex, Image, Label, Text } from 'theme-ui';
import { UserProfile } from './UserProfile';

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
  const { profile: activeUser, upgradeBadgeForCurrentUser, isUserAuthorized } = useProfileStore();
  const toast = useToast();
  const navigate = useNavigate();

  const [showBanModal, setShowBanModal] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isBanning, setIsBanning] = useState(false);

  const isViewingOwnProfile = useMemo(
    () => activeUser?.username === profile?.username,
    [activeUser?.username],
  );
  const showMemberProfile = !profile?.type?.isSpace;
  const upgradeBadge = upgradeBadgeForCurrentUser;
  const shouldShowUpgrade = upgradeBadge && isViewingOwnProfile;

  const canBanUser = !isViewingOwnProfile && isUserAuthorized([UserRole.ADMIN, UserRole.MODERATOR]);

  const handleBanUser = async () => {
    if (!profile?.id || !profile?.username) return;

    setIsBanning(true);
    const promise = fetch(`/api/user/${profile.id}/ban`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    toast.promise(promise, {
      loading: 'Banning user...',
      success: () => {
        setShowBanModal(false);
        setIsConfirmed(false);
        setIsBanning(false);
        navigate('/');
        return {
          message: 'User banned successfully',
          description: 'The user profile and all their content has been deleted.',
        };
      },
      error: (error) => {
        setIsBanning(false);
        return `Error: ${error.message || 'Failed to ban user'}`;
      },
    });
  };

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
                  flexDirection: 'row',
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
            {canBanUser && (
              <Flex
                sx={{
                  alignSelf: ['center', 'flex-end'],
                  marginBottom: 6,
                  zIndex: 2,
                  gap: 2,
                  flexDirection: 'row',
                }}
              >
                <Button
                  type="button"
                  variant="destructive"
                  data-cy="BanUserButton"
                  onClick={() => setShowBanModal(true)}
                  disabled={isBanning}
                >
                  Ban User
                </Button>
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

      <Modal
        isOpen={showBanModal}
        onDismiss={() => {
          setShowBanModal(false);
          setIsConfirmed(false);
        }}
        width={500}
      >
        <Flex
          data-cy="BanUserModal"
          sx={{
            flexDirection: 'column',
            gap: 3,
          }}
        >
          <Text sx={{ fontWeight: 'bold', fontSize: 3 }}>Ban User - This action will:</Text>

          <ul style={{ marginLeft: '20px', marginTop: 0 }}>
            <li>Prevent the user from logging in again</li>
            <li>Delete the user profile permanently</li>
            <li>Delete all content created by this user (comments, questions, research, etc.)</li>
          </ul>

          <Label
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: 2,
            }}
          >
            <Checkbox
              checked={isConfirmed}
              onChange={(e) => setIsConfirmed(e.target.checked)}
              disabled={isBanning}
              data-cy="BanUserConfirmCheckbox"
            />
            I understand this action is permanent and cannot be undone
          </Label>

          <Flex sx={{ gap: 2, flexWrap: 'wrap', mt: 2 }}>
            <Button
              type="button"
              variant="outline"
              data-cy="BanUserModal: Cancel"
              onClick={() => {
                setShowBanModal(false);
                setIsConfirmed(false);
              }}
              disabled={isBanning}
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="destructive"
              data-cy="BanUserModal: Confirm"
              onClick={handleBanUser}
              disabled={!isConfirmed || isBanning}
            >
              Ban User
            </Button>
          </Flex>
        </Flex>
      </Modal>
    </Flex>
  );
});
