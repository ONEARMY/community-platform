export class NotificationsPreferences {
  id?: number;
  user_id?: number;
  comments: boolean;
  news: NewsContentReachOption;
  replies: boolean;
  researchUpdates: boolean;
  isUnsubscribed: boolean;
}

export class DBNotificationsPreferencesFields {
  comments: boolean;
  news: NewsContentReachOption;
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

export type NotificationsPreferenceTypes = 'comments' | 'news' | 'replies' | 'research_updates';

export type NewsContentReachOption = 'all' | 'important' | 'none';
export const NewsContentReachOptionList = ['all', 'important', 'none'] as NewsContentReachOption[];
export const NEWS_CONTENT_REACH_DEFAULT = 'important';

export interface NotificationsPreferencesFormData {
  comments: boolean;
  news: { value: NewsContentReachOption; label: string };
  replies: boolean;
  research_updates: boolean;
  id?: number;
}

export interface NotificationsPreferencesViaEmailFormData {
  comments: boolean;
  news: { value: NewsContentReachOption; label: string };
  replies: boolean;
  research_updates: boolean;
  userCode: string;
}
