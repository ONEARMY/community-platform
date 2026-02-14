export class NotificationsPreferences {
  id?: number;
  user_id?: number;
  comments: boolean;
  news: boolean;
  replies: boolean;
  researchUpdates: boolean;
  isUnsubscribed: boolean;
}

export class DBNotificationsPreferencesFields {
  comments: boolean;
  news: boolean;
  replies: boolean;
  research_updates: boolean;
  is_unsubscribed: boolean;
}

export class DBNotificationsPreferences extends DBNotificationsPreferencesFields {
  id: number;
  user_id: number;
}

export interface DBPreferencesWithProfileContact {
  preferences: DBNotificationsPreferences;
  is_contactable: undefined | boolean;
}

export type NotificationsPreferenceTypes = 'comments' | 'replies' | 'research_updates';

export interface NotificationsPreferencesFormData {
  comments: boolean;
  news: boolean;
  replies: boolean;
  research_updates: boolean;
  id?: number;
}

export interface NotificationsPreferencesViaEmailFormData {
  comments: boolean;
  news: boolean;
  replies: boolean;
  research_updates: boolean;
  userCode: string;
}
