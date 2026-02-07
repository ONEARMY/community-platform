import { observer } from 'mobx-react';
import type { DBNotificationsPreferences } from 'oa-shared';
import { useEffect, useState } from 'react';
import type { SubmitResults } from 'src/pages/User/contact/UserContactError';
import { form } from 'src/pages/UserSettings/labels';
import { notificationsPreferencesService } from 'src/services/notificationsPreferencesService';
import { useProfileStore } from 'src/stores/Profile/profile.store';
import { isUserContactable } from 'src/utils/helpers';
import { SupabaseNotificationsForm } from './SupabaseNotificationsForm';

export const SupabaseNotifications = observer(() => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [initialValues, setInitialValues] = useState<DBNotificationsPreferences | null>(null);
  const [submitResults, setSubmitResults] = useState<SubmitResults | null>(null);

  const { profile } = useProfileStore();

  const refreshPreferences = async () => {
    const preferences = await notificationsPreferencesService.getPreferences();
    setInitialValues(preferences);
    setIsLoading(false);
  };

  useEffect(() => {
    refreshPreferences();
  }, []);

  const onSubmit = async (values: DBNotificationsPreferences) => {
    setIsLoading(true);
    setSubmitResults(null);

    try {
      await notificationsPreferencesService.setPreferences(values);
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
      await notificationsPreferencesService.setUnsubscribe(initialValues?.id);
      await refreshPreferences();
      setSubmitResults({
        type: 'success',
        message: form.saveNotificationPreferences,
      });
    } catch (error) {
      setSubmitResults({ type: 'error', message: error.message });
    }
  };

  if (!profile) {
    return null;
  }

  return (
    <SupabaseNotificationsForm
      initialValues={initialValues}
      isLoading={isLoading}
      onSubmit={onSubmit}
      onUnsubscribe={onUnsubscribe}
      profileIsContactable={isUserContactable(profile)}
      submitResults={submitResults}
    />
  );
});
