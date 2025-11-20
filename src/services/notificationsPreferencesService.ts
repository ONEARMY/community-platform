import type { DBNotificationsPreferences, NotificationsPreferencesFormData } from 'oa-shared';

const getPreferences = async (): Promise<DBNotificationsPreferences | null> => {
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

  data.id && body.append('id', data.id.toString());
  body.append('comments', data.comments.toString());
  body.append('replies', data.replies.toString());
  body.append('research_updates', data.research_updates.toString());
  body.append('is_unsubscribed', 'false');

  return fetch('/api/notifications-preferences', {
    method: 'POST',
    body,
  });
};

const setUnsubscribe = async (id: number | undefined) => {
  const body = new FormData();

  id && body.append('id', id.toString());
  body.append('comments', 'false');
  body.append('replies', 'false');
  body.append('research_updates', 'false');
  body.append('is_unsubscribed', 'true');

  return fetch('/api/notifications-preferences', {
    method: 'POST',
    body,
  });
};

export const notificationsPreferencesService = {
  getPreferences,
  setPreferences,
  setUnsubscribe,
};
