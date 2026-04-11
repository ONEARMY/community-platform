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
  email_content_reach: DBEmailContentReach;
  replies: boolean;
  research_updates: boolean;
  is_unsubscribed: boolean;

  static toFormData(dbNotifications: DBNotificationsPreferences): NotificationsPreferencesFormData {
    return {
      ...dbNotifications,
      email_content_reach:
        dbNotifications.email_content_reach &&
        DBEmailContentReach.toNotificationsFormField(dbNotifications.email_content_reach),
    };
  }
}

export class NotificationsPreferences {
  id?: number;
  userId?: number;
  comments: boolean;
  emailContentReach: EmailContentReach | null;
  replies: boolean;
  researchUpdates: boolean;
  isUnsubscribed: boolean;
}

export interface NotificationsPreferencesFormData {
  id?: number;
  comments: boolean;
  email_content_reach: SelectValue;
  replies: boolean;
  research_updates: boolean;
  is_unsubscribed: boolean;
}

// For setting notifications via the links in emails

export interface DBPreferencesWithProfileContact extends DBNotificationsPreferences {
  is_contactable: undefined | boolean;
}

export interface NotificationsPreferencesViaEmailFormData extends NotificationsPreferencesFormData {
  is_contactable: undefined | boolean;
  user_code: string;
}
