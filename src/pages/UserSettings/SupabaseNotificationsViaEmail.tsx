import { DBNotificationsPreferences, NotificationsPreferencesViaEmailFormData } from 'oa-shared';
import { useEffect, useState } from 'react';
import type { SubmitResults } from 'src/pages/User/contact/UserContactError';
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
  const [submitResults, setSubmitResults] = useState<SubmitResults | null>(null);

  const refreshPreferences = async () => {
    const dbPreferences = await notificationsPreferencesViaEmailService.getPreferences(userCode);

    if (!dbPreferences) {
      return setSubmitResults({ type: 'error', message: 'Error finding preferences' });
    }

    const asFormData = {
      ...DBNotificationsPreferences.toFormData(dbPreferences),
      is_contactable: dbPreferences.is_contactable,
      user_code: userCode,
    };

    setInitialValues(asFormData);
    setIsLoading(false);
  };

  useEffect(() => {
    refreshPreferences();
  }, []);

  const onSubmit = async (formValues: NotificationsPreferencesViaEmailFormData) => {
    setIsLoading(true);
    setSubmitResults(null);

    try {
      await notificationsPreferencesViaEmailService.setPreferences(formValues);
      await refreshPreferences();
      setSubmitResults({
        type: 'success',
        message: form.saveNotificationPreferences,
      });
    } catch (error) {
      setSubmitResults({ type: 'error', message: error.message });
    }
  };

  const onUnsubscribe = async () => {
    setIsLoading(true);
    setSubmitResults(null);

    try {
      await notificationsPreferencesViaEmailService.setUnsubscribe(userCode, initialValues?.id);
      await refreshPreferences();
      setSubmitResults({
        type: 'success',
        message: form.saveNotificationPreferences,
      });
    } catch (error) {
      setSubmitResults({ type: 'error', message: error.message });
    }
  };

  if (!userCode) return null;

  return (
    <SupabaseNotificationsForm
      initialValues={initialValues || null}
      isLoading={isLoading}
      onSubmit={onSubmit as any}
      onUnsubscribe={onUnsubscribe}
      // profileIsContactable={initialValues?.is_contactable}
      submitResults={submitResults}
    />
  );
};
