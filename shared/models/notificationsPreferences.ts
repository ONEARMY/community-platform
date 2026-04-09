import { DBEmailContentReach } from './emailContentReach';
import { SelectValue } from './selectValue';

export type DBNotificationsPreferencesDefaults = {
  comments: boolean;
  email_content_reach: number;
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
      email_content_reach: DBEmailContentReach.toNotificationsFormField(
        dbNotifications.email_content_reach,
      ),
    };
  }
}

export class NotificationsPreferences {
  id?: number;
  userId?: number;
  comments: boolean;
  emailContentReach: number;
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

export interface NotificationsPreferencesViaEmailFormData extends NotificationsPreferencesFormData {
  userCode: string;
}

export interface DBPreferencesWithProfileContact {
  preferences: DBNotificationsPreferences;
  is_contactable: undefined | boolean;
}
