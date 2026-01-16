import { observer } from 'mobx-react';
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { Accordion, Button } from 'oa-components';
import { logger } from 'src/logger';
import { profileService } from 'src/services/profileService';
import { useProfileStore } from 'src/stores/Profile/profile.store';
import { Flex, Heading, Text } from 'theme-ui';

import { DeleteAccountModal } from './content/modals/DeleteAccountModal';
import { PatreonIntegration } from './content/fields/PatreonIntegration';
import { ChangeEmailForm } from './content/sections/ChangeEmail.form';
import { ChangePasswordForm } from './content/sections/ChangePassword.form';
import { headings } from './labels';

export const SettingsPageAccount = observer(() => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const { clear: clearProfile } = useProfileStore();

  const handleDeleteAccount = useCallback(async () => {
    setIsDeleting(true);
    try {
      await profileService.delete();
      // Clear profile from store
      clearProfile();
      // Redirect to logout which will handle sign out and redirect to homepage
      window.location.href = '/logout?returnUrl=/';
    } catch (error) {
      logger.error('Failed to delete account', error);
      setIsDeleting(false);
      // Show error to user - could add a toast notification here
      alert('Failed to delete account. Please try again or contact support.');
    }
  }, [clearProfile]);

  const handleOpenDeleteModal = useCallback(() => {
    setShowDeleteModal(true);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
  }, []);

  return (
    <Flex
      sx={{
        justifyContent: 'space-between',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      <Flex sx={{ flexDirection: 'column', gap: 1 }}>
        <Heading as="h2">{headings.accountSettings}</Heading>
        <Text variant="quiet">Here you can manage the core settings of your account.</Text>
      </Flex>

      <PatreonIntegration />
      <ChangePasswordForm />
      <ChangeEmailForm />

      <Accordion
        title="Delete Profile"
        subtitle="Permanently delete your account and all associated data. This action cannot be undone."
      >
        <Flex sx={{ flexDirection: 'column', gap: 2 }}>
          <Button
            variant="primary"
            onClick={handleOpenDeleteModal}
            disabled={isDeleting}
            sx={{
              alignSelf: 'flex-start',
            }}
          >
            Delete Profile
          </Button>
        </Flex>
      </Accordion>

      <DeleteAccountModal
        isOpen={showDeleteModal}
        onCancel={handleCloseDeleteModal}
        onConfirm={handleDeleteAccount}
        isDeleting={isDeleting}
      />
    </Flex>
  );
});
