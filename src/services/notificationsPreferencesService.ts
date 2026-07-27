import type { NotificationsPreferences, NotificationsPreferencesFormData } from 'oa-shared';

const getPreferences = async (): Promise<NotificationsPreferences | null> => {
  try {
    const preferencesData = await fetch('/api/notifications-preferences');
    const { preferences } = await preferencesData.json();

    return preferences;
  } catch (err) {
    console.error(err);
    return null;
  }
};

const setPreferences = async (data: NotificationsPreferencesFormData) => {
  const body = new FormData();

  body.append('comments', data.comments.toString());
  body.append('replies', data.replies.toString());
  body.append('researchUpdates', data.researchUpdates.toString());
  body.append('isUnsubscribed', 'false');

  if (data.contentReach?.value) {
    body.append('contentReach', data.contentReach.value.toString());
  }

  const response = await fetch('/api/notifications-preferences', {
    method: 'POST',
    body,
  });

  if (response.status !== 200 && response.status !== 201) {
    const errorData = await response.json().catch(() => ({ error: 'Error saving preferences' }));
    const errorMessage = errorData.error || errorData.message || 'Error saving preferences';
    throw new Error(errorMessage, { cause: response.status });
  }

  return response;
};

const unsubscribe = async () => {
  const body = new FormData();

  body.append('comments', 'false');
  body.append('news', 'false');
  body.append('replies', 'false');
  body.append('researchUpdates', 'false');
  body.append('contentReach', 'null');
  body.append('isUnsubscribed', 'true');

  return fetch('/api/notifications-preferences', {
    method: 'POST',
    body,
  });
};

export const notificationsPreferencesService = {
  getPreferences,
  setPreferences,
  unsubscribe,
};
