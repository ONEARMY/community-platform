import type {
  NotificationsPreferencesViaEmailFormData,
  PreferencesWithProfileContact,
} from 'oa-shared';

const getPreferences = async (userCode: string): Promise<PreferencesWithProfileContact | null> => {
  try {
    const response = await fetch(`/api/notifications-preferences-via-email/${userCode}`);

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return null;
    }

    const { preferences, isContactable } = await response.json();

    return { ...preferences, isContactable };
  } catch (err) {
    console.error(err);
    return null;
  }
};

const setPreferences = async (
  data: NotificationsPreferencesViaEmailFormData,
): Promise<Response> => {
  const body = new FormData();

  body.append('comments', data.comments.toString());
  body.append('news', data.news.toString());
  body.append('replies', data.replies.toString());
  body.append('researchUpdates', data.researchUpdates.toString());
  body.append('isUnsubscribed', 'false');

  if (data.emailContentReach?.value) {
    body.append('emailContentReach', data.emailContentReach.value.toString());
  }

  return fetch(`/api/notifications-preferences-via-email/${data.userCode}`, {
    method: 'POST',
    body,
  });
};

const setUnsubscribe = async (userCode: string, id?: number): Promise<Response> => {
  const body = new FormData();

  id && body.append('id', id.toString());
  body.append('comments', 'false');
  body.append('news', 'false');
  body.append('replies', 'false');
  body.append('researchUpdates', 'false');
  body.append('emailContentReach', 'null');
  body.append('isUnsubscribed', 'true');

  return fetch(`/api/notifications-preferences-via-email/${userCode}`, {
    method: 'POST',
    body,
  });
};

export const notificationsPreferencesViaEmailService = {
  getPreferences,
  setPreferences,
  setUnsubscribe,
};
