import { observer } from 'mobx-react';
import type { NotificationsPreferencesFormData } from 'oa-shared';
import { useEffect, useState } from 'react';
import type { SubmitResults } from 'src/pages/User/contact/UserContactError';
import { form } from 'src/pages/UserSettings/labels';
import { notificationsPreferencesService } from 'src/services/notificationsPreferencesService';
import { useProfileStore } from 'src/stores/Profile/profile.store';
import {
  defaultNewContentReachValue,
  NewsContentReachOptions,
} from './content/fields/NotificationsNewsField';
import { SupabaseNotificationsForm } from './SupabaseNotificationsForm';

export const SupabaseNotifications = observer(() => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [initialValues, setInitialValues] = useState<NotificationsPreferencesFormData | null>(null);
  const [submitResults, setSubmitResults] = useState<SubmitResults | null>(null);

  const { profile } = useProfileStore();

  const refreshPreferences = async () => {
    const dbPreferences = await notificationsPreferencesService.getPreferences();
    const preferences: NotificationsPreferencesFormData = {
      ...dbPreferences,
      news:
        NewsContentReachOptions.find(({ value }) => value === dbPreferences?.news) ||
        defaultNewContentReachValue,
    };

    setInitialValues(preferences);
    setIsLoading(false);
  };

  useEffect(() => {
    refreshPreferences();
  }, []);

  const onSubmit = async (formValues) => {
    const values = {
      ...formValues,
      news: formValues.news.value,
    };

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
      profile={profile}
      submitResults={submitResults}
    />
  );
});
