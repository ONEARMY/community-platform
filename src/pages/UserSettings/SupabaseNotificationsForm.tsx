import type { GridFormFields } from 'oa-components';
import {
  ConfirmModal,
  FieldCheckbox,
  GridForm,
  InformationTooltip,
  InternalLink,
  Loader,
} from 'oa-components';
import type { DBNotificationsPreferences, Profile } from 'oa-shared';
import { useContext, useMemo, useState } from 'react';
import { Field, Form } from 'react-final-form';
import { UserContactError } from 'src/pages/User/contact';
import type { SubmitResults } from 'src/pages/User/contact/UserContactError';
import { isUserContactable } from 'src/utils/helpers';
import { isUserAdmin } from 'src/utils/isAdmin';
import { Button, Flex, Text } from 'theme-ui';
import { TenantContext } from '../common/TenantContext';
import { NotificationsNewsField } from './content/fields/NotificationsNewsField';

const formId = 'SupabaseNotifications';

const baseFields: GridFormFields[] = [
  {
    component: (
      <Field component={FieldCheckbox} data-cy={`${formId}-field-comments`} name="comments" />
    ),
    description: 'Top-level comments on your contributions or contributions you follow',
    glyph: 'comment',
    name: 'New comments',
  },
  {
    component: (
      <Field component={FieldCheckbox} data-cy={`${formId}-field-replies`} name="replies" />
    ),
    description:
      "Replies under your comment or a comment thread that you follow. Note that you can always choose to follow or unfollow a single reply thread in the comment's options.",
    glyph: 'reply',
    name: 'New replies',
  },
  {
    component: (
      <Field
        component={FieldCheckbox}
        data-cy={`${formId}-field-research_updates`}
        name="research_updates"
      />
    ),
    description: 'Updates for the research that you follow.',
    glyph: 'update',
    name: 'Research Updates',
  },
  {
    component: (
      <InformationTooltip
        glyph="information"
        size={22}
        tooltip="Afriad we've got to send these to you,<br/>so you can't opt-out. "
      />
    ),
    description: 'Password resets, email verifications and other service emails',
    glyph: 'service-email',
    name: 'Service emails',
  },
];

interface IProps {
  initialValues: DBNotificationsPreferences | null;
  isLoading: boolean;
  onSubmit: (values: DBNotificationsPreferences) => Promise<void>;
  onUnsubscribe: () => Promise<void>;
  profile: Profile;
  submitResults: SubmitResults | null;
}

export const SupabaseNotificationsForm = (props: IProps) => {
  const { initialValues, isLoading, onSubmit, onUnsubscribe, profile, submitResults } = props;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const tenantContext = useContext(TenantContext);
  const showMessagingSetting = !tenantContext?.noMessaging;

  const profileIsContactable = isUserContactable(profile);
  const showNewsPreference = profile.badges?.length || isUserAdmin(profile);

  const fields = useMemo(() => {
    const allFields = [...baseFields];

    if (showMessagingSetting) {
      allFields.push({
        component: (
          <InternalLink
            data-cy="messages-link"
            to="/settings/profile#public-contact"
            sx={{ textAlign: 'center', ':hover': { textDecoration: 'underline' } }}
          >
            {profileIsContactable ? 'Stop receiving messages' : 'Start receiving messages'}
          </InternalLink>
        ),
        description: 'Through the contact form on your profile page',
        glyph: 'email',
        name: 'Receiving messages',
      });
    }

    if (showNewsPreference) {
      allFields.unshift({
        component: <NotificationsNewsField defaultValue={initialValues?.news} />,
        description: 'Get notified when news from HQ are posted',
        glyph: 'news',
        name: 'Coming soon: News updates',
        evenGridSplit: true,
      });
    }

    return allFields;
  }, [showMessagingSetting, profileIsContactable, initialValues]);

  return (
    <Form
      id={formId}
      onSubmit={onSubmit}
      initialValues={initialValues || undefined}
      render={({ submitting, handleSubmit }) => {
        if (isLoading) {
          return (
            <Flex sx={{ minHeight: '700px', alignItems: 'center', justifyContent: 'center' }}>
              <Loader />
            </Flex>
          );
        }

        return (
          <Flex sx={{ flexDirection: 'column', gap: 2 }}>
            <UserContactError submitResults={submitResults} />

            <Text as="h3">We should email you about...</Text>

            <GridForm fields={fields} />

            <Flex sx={{ gap: 2 }}>
              <Button
                type="submit"
                form={formId}
                data-cy="save-notifications-preferences"
                variant="primary"
                onClick={handleSubmit}
                disabled={submitting}
              >
                Update preferences
              </Button>
              <Button
                data-cy="save-notifications-preferences-unsubscribe"
                variant="destructive"
                onClick={() => setShowDeleteModal(true)}
                disabled={submitting}
              >
                Unsubscribe from all emails
              </Button>
              <ConfirmModal
                isOpen={showDeleteModal}
                message="Unsubscribe from all current email notification types and any others we might add in the future."
                confirmButtonText="Confirm"
                handleCancel={() => setShowDeleteModal(false)}
                handleConfirm={() => {
                  onUnsubscribe();
                  setShowDeleteModal(false);
                }}
                confirmVariant="destructive"
              />
            </Flex>
          </Flex>
        );
      }}
    />
  );
};
