import { DBEmailContentReach, EmailContentReach } from './emailContentReach';
import { SelectValue } from './selectValue';

export type DBNotificationsPreferencesDefaults = {
  comments: boolean;
  email_content_reach: DBEmailContentReach;
  replies: boolean;
  research_updates: boolean;
  is_unsubscribed: boolean;
};

export class DBNotificationsPreferences {
  id: number;
  user_id: number;
  comments: boolean;
  news: boolean;
  email_content_reach: DBEmailContentReach;
  replies: boolean;
  research_updates: boolean;
  is_unsubscribed: boolean;
}

export class NotificationsPreferences {
  id?: number;
  userId?: number;
  comments: boolean;
  news: boolean;
  emailContentReach: EmailContentReach | null;
  replies: boolean;
  researchUpdates: boolean;
  isUnsubscribed: boolean;

  static fromDB(dBNotificationsPreferences: DBNotificationsPreferences) {
    return {
      id: dBNotificationsPreferences.id || undefined,
      userId: dBNotificationsPreferences.user_id || undefined,
      comments: dBNotificationsPreferences.comments,
      news: dBNotificationsPreferences.news,
      emailContentReach: EmailContentReach.fromDB(dBNotificationsPreferences.email_content_reach),
      replies: dBNotificationsPreferences.replies,
      researchUpdates: dBNotificationsPreferences.research_updates,
      isUnsubscribed: dBNotificationsPreferences.is_unsubscribed,
    };
  }

  static toFormData(
    notificationsPreferences: NotificationsPreferences,
  ): NotificationsPreferencesFormData {
    return {
      id: notificationsPreferences.id || undefined,
      comments: notificationsPreferences.comments,
      replies: notificationsPreferences.replies,
      researchUpdates: notificationsPreferences.researchUpdates,
      isUnsubscribed: notificationsPreferences.isUnsubscribed,
      news: notificationsPreferences.news,
      emailContentReach:
        notificationsPreferences.emailContentReach &&
        EmailContentReach.toNotificationsFormField(notificationsPreferences.emailContentReach),
    };
  }
}

export interface NotificationsPreferencesFormData {
  id?: number;
  news: boolean;
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
