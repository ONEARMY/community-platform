import { ConfirmModal, FieldSwitch, InformationTooltip, InternalLink, Loader } from 'oa-components';
import type { NotificationsPreferencesFormData } from 'oa-shared';
import { useContext, useState } from 'react';
import { Field, Form } from 'react-final-form';
import { Button, Flex } from 'theme-ui';
import { TenantContext } from '../common/TenantContext';
import { ContentReachRadioOptions } from './content/fields/ContentReachPreferenceField';
import { ContentReachSwitch } from './content/fields/ContentReachSwitch';
import { NotificationRow } from './NotificationRow';

const formId = 'SupabaseNotifications';

const StyledFieldSwitch = (props) => {
  return (
    <FieldSwitch
      {...props}
      sx={{
        'input:checked ~ &': {
          backgroundColor: '#20b7eb',
        },
      }}
    />
  );
};

interface IProps {
  initialValues: NotificationsPreferencesFormData | null;
  isLoading: boolean;
  onSubmit: (values: NotificationsPreferencesFormData) => Promise<void>;
  onUnsubscribe: () => Promise<void>;
  profileIsContactable?: boolean;
}

export const SupabaseNotificationsForm = (props: IProps) => {
  const { initialValues, isLoading, onSubmit, onUnsubscribe, profileIsContactable } = props;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const tenantContext = useContext(TenantContext);
  const showMessagingSetting = !tenantContext?.noMessaging;

  return (
    <Form
      id={formId}
      onSubmit={onSubmit}
      initialValues={initialValues || undefined}
      render={({ submitting, handleSubmit, values }) => {
        if (isLoading) {
          return (
            <Flex sx={{ minHeight: '700px', alignItems: 'center', justifyContent: 'center' }}>
              <Loader />
            </Flex>
          );
        }

        let rowIndex = 0;

        return (
          <Flex sx={{ flexDirection: 'column', gap: 4 }}>
            <Flex sx={{ flexDirection: 'column' }}>
              <NotificationRow
                index={rowIndex++}
                glyph="news"
                name="News updates"
                description="Get notified when news from HQ are posted"
                control={<ContentReachSwitch />}
                subContent={<ContentReachRadioOptions />}
              />

              <NotificationRow
                index={rowIndex++}
                glyph="comment"
                name="New comments"
                description="Top-level comments on your contributions or contributions you follow"
                control={
                  <Field
                    component={StyledFieldSwitch}
                    data-cy={`${formId}-field-comments`}
                    name="comments"
                  />
                }
              />

              <NotificationRow
                index={rowIndex++}
                glyph="reply"
                name="New replies"
                description="Replies under your comment or a comment thread that you follow. Note that you can always choose to follow or unfollow a single reply thread in the comment's options."
                control={
                  <Field
                    component={StyledFieldSwitch}
                    data-cy={`${formId}-field-replies`}
                    name="replies"
                  />
                }
              />

              <NotificationRow
                index={rowIndex++}
                glyph="update"
                name="Research Updates"
                description="Updates for the research that you follow."
                control={
                  <Field
                    component={StyledFieldSwitch}
                    data-cy={`${formId}-field-research_updates`}
                    name="researchUpdates"
                  />
                }
              />

              <NotificationRow
                index={rowIndex++}
                glyph="service-email"
                name="Service emails"
                description="Password resets, email verifications and other service emails"
                control={
                  <InformationTooltip
                    glyph="information"
                    size={22}
                    tooltip="Afriad we've got to send these to you,<br/>so you can't opt-out. "
                    sx={{ marginRight: 2 }}
                  />
                }
              />

              {showMessagingSetting && (
                <NotificationRow
                  index={rowIndex++}
                  glyph="email"
                  name="Receiving messages"
                  description="Through the contact form on your profile page"
                  control={
                    <InternalLink
                      data-cy="messages-link"
                      to="/settings/profile#public-contact"
                      sx={{ textAlign: 'center', ':hover': { textDecoration: 'underline' } }}
                    >
                      {profileIsContactable
                        ? 'Stop receiving messages'
                        : 'Start receiving messages'}
                    </InternalLink>
                  }
                />
              )}
            </Flex>
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
