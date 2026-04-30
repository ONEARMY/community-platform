import { EmailContentReach } from './emailContentReach';
import { SelectValue } from './selectValue';

export type DBNotificationsPreferencesDefaults = {
  comments: boolean;
  email_content_reach: number | null;
  replies: boolean;
  research_updates: boolean;
  is_unsubscribed: boolean;
};

export class DBNotificationsPreferences {
  id: number;
  user_id: number;
  comments: boolean;
  email_content_reach: number | null;
  replies: boolean;
  research_updates: boolean;
  is_unsubscribed: boolean;
}

export class NotificationsPreferences {
  id?: number;
  userId?: number;
  comments: boolean;
  emailContentReach: number | null;
  replies: boolean;
  researchUpdates: boolean;
  isUnsubscribed: boolean;

  static fromDB(dBNotificationsPreferences: DBNotificationsPreferences) {
    return {
      id: dBNotificationsPreferences.id || undefined,
      userId: dBNotificationsPreferences.user_id || undefined,
      comments: dBNotificationsPreferences.comments,
      emailContentReach: dBNotificationsPreferences.email_content_reach,
      replies: dBNotificationsPreferences.replies,
      researchUpdates: dBNotificationsPreferences.research_updates,
      isUnsubscribed: dBNotificationsPreferences.is_unsubscribed,
    } satisfies NotificationsPreferences;
  }

  static toFormData(
    notificationsPreferences: NotificationsPreferences,
    emailContentReaches: EmailContentReach[] | null,
  ) {
    let emailContentReach: SelectValue | null = null;

    if (notificationsPreferences.emailContentReach) {
      const setting = emailContentReaches?.find(
        (x) => x.id === notificationsPreferences.emailContentReach,
      );
      emailContentReach = setting
        ? {
            value: setting.id.toString(),
            label: setting.preferencesLabel,
          }
        : null;
    }

    return {
      comments: notificationsPreferences.comments,
      replies: notificationsPreferences.replies,
      researchUpdates: notificationsPreferences.researchUpdates,
      isUnsubscribed: notificationsPreferences.isUnsubscribed,
      emailContentReach,
    } satisfies NotificationsPreferencesFormData;
  }
}

export interface NotificationsPreferencesFormData {
  comments: boolean;
  emailContentReach: SelectValue | null;
  replies: boolean;
  researchUpdates: boolean;
  isUnsubscribed: boolean;
}

// For setting notifications via the links in emails

export interface PreferencesWithProfileContact extends NotificationsPreferences {
  isContactable: undefined | boolean;
}

export interface NotificationsPreferencesViaEmailFormData extends NotificationsPreferencesFormData {
  isContactable: undefined | boolean;
  userCode: string;
}
