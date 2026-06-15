import { observer } from 'mobx-react';
import { Button, Modal } from 'oa-components';
import type { Profile } from 'oa-shared';
import { UserRole } from 'oa-shared';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useToast } from 'src/common/Toast';
import { useProfileStore } from 'src/stores/Profile/profile.store';
import { Checkbox, Flex, Label, Text } from 'theme-ui';

interface BanUserButtonProps {
  profile: Profile;
}

export const BanUserButton = observer(({ profile }: BanUserButtonProps) => {
  const { profile: activeUser, isUserAuthorized } = useProfileStore();
  const toast = useToast();
  const navigate = useNavigate();

  const [showBanModal, setShowBanModal] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isBanning, setIsBanning] = useState(false);

  const isViewingOwnProfile = activeUser?.username === profile?.username;
  const hasPermission = isUserAuthorized([UserRole.ADMIN, UserRole.MODERATOR]);

  // Prevent banning users with ADMIN, EDITOR, or MODERATOR roles
  const targetHasProtectedRole =
    profile.roles?.includes(UserRole.ADMIN) ||
    profile.roles?.includes(UserRole.EDITOR) ||
    profile.roles?.includes(UserRole.RESEARCH_CREATOR) ||
    profile.roles?.includes(UserRole.MODERATOR);

  const canBanUser = !isViewingOwnProfile && hasPermission && !targetHasProtectedRole;

  if (!canBanUser) {
    return null;
  }

  const handleBanUser = async () => {
    if (!profile?.id || !profile?.username) return;

    setIsBanning(true);
    const promise = fetch(`/api/profile/${profile.id}/ban`, {
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

  const handleCloseModal = () => {
    setShowBanModal(false);
    setIsConfirmed(false);
  };

  return (
    <>
      <Button
        type="button"
        variant="destructive"
        data-cy="BanUserButton"
        data-testid="BanUserButton"
        onClick={() => setShowBanModal(true)}
        disabled={isBanning}
      >
        Ban User
      </Button>

      <Modal isOpen={showBanModal} onDismiss={handleCloseModal} width={500}>
        <Flex
          data-cy="BanUserModal"
          data-testid="BanUserModal"
          sx={{
            flexDirection: 'column',
            gap: 3,
          }}
        >
          <Text sx={{ fontWeight: 'bold', fontSize: 3 }}>Ban User - This action will:</Text>

          <ul>
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
              data-testid="BanUserConfirmCheckbox"
            />
            I understand this action is permanent and cannot be undone
          </Label>

          <Flex sx={{ gap: 2, flexWrap: 'wrap', mt: 2 }}>
            <Button
              type="button"
              variant="outline"
              data-cy="BanUserModal: Cancel"
              data-testid="BanUserModal: Cancel"
              onClick={handleCloseModal}
              disabled={isBanning}
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="destructive"
              data-cy="BanUserModal: Confirm"
              data-testid="BanUserModal: Confirm"
              onClick={handleBanUser}
              disabled={!isConfirmed || isBanning}
            >
              Ban User
            </Button>
          </Flex>
        </Flex>
      </Modal>
    </>
  );
});
