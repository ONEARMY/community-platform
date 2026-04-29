import { NotificationsPreferences, NotificationsPreferencesViaEmailFormData } from 'oa-shared';
import { useEffect, useState } from 'react';
import { useToast } from 'src/common/Toast';
import { form } from 'src/pages/UserSettings/labels';
import { notificationsPreferencesViaEmailService } from 'src/services/notificationsPreferencesViaEmailService';
import { SupabaseNotificationsForm } from './SupabaseNotificationsForm';

interface IProps {
  userCode: string;
}

export const SupabaseNotificationsViaEmail = ({ userCode }: IProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [initialValues, setInitialValues] =
    useState<NotificationsPreferencesViaEmailFormData | null>(null);
  const toast = useToast();

  const refreshPreferences = async () => {
    const dbPreferences = await notificationsPreferencesViaEmailService.getPreferences(userCode);

    if (!dbPreferences) {
      return null;
    }

    const asFormData = {
      ...NotificationsPreferences.toFormData(dbPreferences),
      isContactable: dbPreferences.isContactable,
      userCode: userCode,
    };

    setInitialValues(asFormData);
    setIsLoading(false);
  };

  useEffect(() => {
    refreshPreferences();
  }, []);

  const onSubmit = async (values: NotificationsPreferencesViaEmailFormData) => {
    const promise = notificationsPreferencesViaEmailService.setPreferences({
      ...values,
      userCode,
    });

    toast.promise(promise, {
      loading: 'Saving your notification preferences...',
      success: () => {
        refreshPreferences();
        return form.saveNotificationPreferences;
      },
      error: (error) => {
        return `Error: ${error.message}`;
      },
    });
  };

  const onUnsubscribe = async () => {
    const promise = notificationsPreferencesViaEmailService.setUnsubscribe(
      userCode,
      initialValues?.id,
    );
    toast.promise(promise, {
      loading: 'Unsubscribing...',
      success: () => {
        refreshPreferences();
        return form.saveNotificationPreferences;
      },
      error: (error) => {
        return `Error: ${error.message}`;
      },
    });
  };

  if (!userCode) {
    return null;
  }

  return (
    <SupabaseNotificationsForm
      initialValues={initialValues || null}
      isLoading={isLoading}
      onSubmit={onSubmit as any}
      onUnsubscribe={onUnsubscribe}
      profileIsContactable={initialValues?.isContactable}
    />
  );
};
