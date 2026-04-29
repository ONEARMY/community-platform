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

  data.id && body.append('id', data.id.toString());
  body.append('comments', data.comments.toString());
  body.append('news', data.news.toString());
  body.append('replies', data.replies.toString());
  body.append('researchUpdates', data.researchUpdates.toString());
  body.append('isUnsubscribed', 'false');

  if (data.emailContentReach?.value) {
    body.append('emailContentReach', data.emailContentReach.value.toString());
  }

  return fetch('/api/notifications-preferences', {
    method: 'POST',
    body,
  });
};

const setUnsubscribe = async (id: number | undefined) => {
  const body = new FormData();

  id && body.append('id', id.toString());
  body.append('comments', 'false');
  body.append('news', 'false');
  body.append('replies', 'false');
  body.append('researchUpdates', 'false');
  body.append('emailContentReach', 'null');
  body.append('isUnsubscribed', 'true');

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
