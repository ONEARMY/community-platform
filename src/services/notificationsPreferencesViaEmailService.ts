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
  body.append('replies', data.replies.toString());
  body.append('researchUpdates', data.researchUpdates.toString());
  body.append('isUnsubscribed', 'false');

  if (data.contentReach?.value) {
    body.append('contentReach', data.contentReach.value.toString());
  }

  return fetch(`/api/notifications-preferences-via-email/${data.userCode}`, {
    method: 'POST',
    body,
  });
};

const unsubscribe = async (userCode: string): Promise<Response> => {
  const body = new FormData();

  body.append('comments', 'false');
  body.append('replies', 'false');
  body.append('researchUpdates', 'false');
  body.append('contentReach', 'null');
  body.append('isUnsubscribed', 'true');

  return fetch(`/api/notifications-preferences-via-email/${userCode}`, {
    method: 'POST',
    body,
  });
};

export const notificationsPreferencesViaEmailService = {
  getPreferences,
  setPreferences,
  unsubscribe,
};
