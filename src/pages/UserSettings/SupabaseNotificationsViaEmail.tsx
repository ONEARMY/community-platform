import type { DBNotificationsPreferences, DBPreferencesWithProfileContact } from 'oa-shared';
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
  const [initialValues, setInitialValues] = useState<DBPreferencesWithProfileContact | null>(null);
  const toast = useToast();

  const refreshPreferences = async () => {
    const preferences = await notificationsPreferencesViaEmailService.getPreferences(userCode);

    setInitialValues(preferences);
    setIsLoading(false);
  };

  useEffect(() => {
    refreshPreferences();
  }, []);

  const onSubmit = async (values: DBNotificationsPreferences) => {
    setIsLoading(true);

    const promise = notificationsPreferencesViaEmailService.setPreferences({
      ...values,
      userCode,
    });

    toast.promise(promise, {
      loading: 'Saving your notification preferences...',
      success: () => {
        refreshPreferences().finally(() => setIsLoading(false));
        return form.saveNotificationPreferences;
      },
      error: (error) => {
        setIsLoading(false);
        return `Error: ${error.message}`;
      },
    });
  };

  const onUnsubscribe = async () => {
    setIsLoading(true);

    const promise = notificationsPreferencesViaEmailService.setUnsubscribe(
      userCode,
      initialValues?.preferences.id,
    );
    toast.promise(promise, {
      loading: 'Unsubscribing...',
      success: () => {
        refreshPreferences().finally(() => setIsLoading(false));
        return form.saveNotificationPreferences;
      },
      error: (error) => {
        setIsLoading(false);
        return `Error: ${error.message}`;
      },
    });
  };

  if (!userCode) {
    return null;
  }

  return (
    <SupabaseNotificationsForm
      initialValues={initialValues?.preferences || null}
      isLoading={isLoading}
      onSubmit={onSubmit}
      onUnsubscribe={onUnsubscribe}
      profileIsContactable={initialValues?.is_contactable}
    />
  );
};
