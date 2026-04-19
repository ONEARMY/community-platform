import { observer } from 'mobx-react';
import type { DBNotificationsPreferences } from 'oa-shared';
import { useEffect, useState } from 'react';
import { useToast } from 'src/common/Toast/useToast';
import { form } from 'src/pages/UserSettings/labels';
import { notificationsPreferencesService } from 'src/services/notificationsPreferencesService';
import { useProfileStore } from 'src/stores/Profile/profile.store';
import { isUserContactable } from 'src/utils/helpers';
import { SupabaseNotificationsForm } from './SupabaseNotificationsForm';

export const SupabaseNotifications = observer(() => {
  const [isLoading, setIsLoading] = useState(true);
  const [initialValues, setInitialValues] = useState<DBNotificationsPreferences | null>(null);
  const toast = useToast();

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
    const promise = notificationsPreferencesService.setPreferences(values);

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
    const promise = notificationsPreferencesService.setUnsubscribe(initialValues?.id);

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
    />
  );
});
