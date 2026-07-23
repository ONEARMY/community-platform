import { observer } from 'mobx-react';
import { Button, ConfirmModal, Tooltip } from 'oa-components';
import type { Profile } from 'oa-shared';
import { UserRole } from 'oa-shared';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useToast } from 'src/common/Toast';
import { profileService } from 'src/services/profileService';
import { useProfileStore } from 'src/stores/Profile/profile.store';

interface BanUserButtonProps {
  profile: Profile;
}

export const BanUserButton = observer(({ profile }: BanUserButtonProps) => {
  const { profile: activeUser, isUserAuthorized } = useProfileStore();
  const toast = useToast();
  const navigate = useNavigate();

  const [showBanModal, setShowBanModal] = useState(false);

  const isViewingOwnProfile = activeUser?.username === profile?.username;
  const hasPermission = isUserAuthorized([UserRole.ADMIN, UserRole.MODERATOR]);

  // Prevent banning users with ADMIN, EDITOR, or MODERATOR roles
  const targetHasProtectedRole =
    profile.roles?.includes(UserRole.ADMIN) ||
    profile.roles?.includes(UserRole.EDITOR) ||
    profile.roles?.includes(UserRole.RESEARCH_CREATOR) ||
    profile.roles?.includes(UserRole.MODERATOR);

  // Don't show button at all if user doesn't have permission
  if (!hasPermission) {
    return null;
  }

  // Determine if button should be disabled and why
  const isDisabled = isViewingOwnProfile || targetHasProtectedRole;
  const tooltipMessage = isViewingOwnProfile
    ? 'Cannot ban your own profile'
    : targetHasProtectedRole
      ? 'Cannot ban users with protected roles (Admin, Editor, Moderator, Research Creator)'
      : '';

  const tooltipId = 'ban-user-button-tooltip';

  const handleBanUser = async () => {
    if (!profile?.id || !profile?.username) {
      return;
    }

    setShowBanModal(false);

    toast.promise(profileService.ban(profile.id), {
      loading: 'Banning user...',
      success: () => {
        navigate('/');
        return {
          message: 'User banned successfully',
          description: 'The user profile and all their content has been deleted.',
        };
      },
      error: (error) => {
        return `Error: ${error.message || 'Failed to ban user'}`;
      },
    });
  };

  return (
    <>
      <Button
        type="button"
        variant="destructive"
        data-cy="BanUserButton"
        data-testid="BanUserButton"
        data-tooltip-id={tooltipId}
        data-tooltip-content={tooltipMessage}
        onClick={() => setShowBanModal(true)}
        disabled={isDisabled}
      >
        Ban User
      </Button>

      {isDisabled && <Tooltip id={tooltipId} />}

      <ConfirmModal
        isOpen={showBanModal}
        message="Ban User - This action will:"
        confirmButtonText="Ban User"
        handleCancel={() => setShowBanModal(false)}
        handleConfirm={handleBanUser}
        confirmVariant="destructive"
        checkboxLabel="I understand this action cannot be undone"
        width={500}
      >
        <ul>
          <li>Prevent the user from logging in again</li>
          <li>Delete the user profile permanently</li>
          <li>
            Soft delete all content created by this user (comments, questions, research, etc.)
          </li>
        </ul>
      </ConfirmModal>
    </>
  );
});
