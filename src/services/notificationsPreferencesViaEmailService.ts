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
  body.append('news', data.comments.toString());
  body.append('replies', data.replies.toString());
  body.append('research_updates', data.research_updates.toString());
  data.email_content_reach &&
    body.append('email_content_reach', data.email_content_reach.value.toString());
  body.append('is_unsubscribed', 'false');

  return fetch(`/api/notifications-preferences-via-email/${data.user_code}`, {
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
  body.append('research_updates', 'false');
  body.append('email_content_reach', 'null');
  body.append('is_unsubscribed', 'true');

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
