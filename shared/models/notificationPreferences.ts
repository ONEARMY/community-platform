import { SelectValue } from './selectValue';

export type ContentReach = 'all' | 'important' | null;

export const contentReachSettings: {
  value: ContentReach;
  contentLabel: string;
  preferencesLabel: string;
  description: string;
}[] = [
  {
    value: 'all',
    contentLabel: 'Send email to a small group of super-fans (Keep me close)',
    preferencesLabel: 'Keep me close',
    description: 'Get notified for all news posts',
  },
  {
    value: 'important',
    contentLabel: 'Send email to the large group (Big updates)',
    preferencesLabel: 'Big updates',
    description: 'Major news posts only, like new versions or annual reports',
  },
  {
    value: null,
    contentLabel: "Don't send any emails",
    preferencesLabel: 'No Emails',
    description: 'Do not receive any emails',
  },
];

export const NotificationsPreferencesDefaults = {
  comments: true,
  content_reach: null,
  replies: true,
  research_updates: true,
  is_unsubscribed: false,
};

export class DBNotificationsPreferences {
  id: number;
  user_id: number;
  comments: boolean;
  content_reach: ContentReach;
  replies: boolean;
  research_updates: boolean;
  is_unsubscribed: boolean;
}

export class NotificationsPreferences {
  id?: number;
  userId?: number;
  comments: boolean;
  contentReach: ContentReach;
  replies: boolean;
  researchUpdates: boolean;
  isUnsubscribed: boolean;

  static fromDB(dBNotificationsPreferences: DBNotificationsPreferences) {
    return {
      id: dBNotificationsPreferences.id || undefined,
      userId: dBNotificationsPreferences.user_id || undefined,
      comments: dBNotificationsPreferences.comments,
      contentReach: dBNotificationsPreferences.content_reach,
      replies: dBNotificationsPreferences.replies,
      researchUpdates: dBNotificationsPreferences.research_updates,
      isUnsubscribed: dBNotificationsPreferences.is_unsubscribed,
    } satisfies NotificationsPreferences;
  }

  static toFormData(notificationsPreferences: NotificationsPreferences) {
    const setting = contentReachSettings.find(
      (option) => option.value === notificationsPreferences.contentReach,
    );

    const option: SelectValue | null = setting
      ? { value: setting.value, label: setting.preferencesLabel }
      : null;

    return {
      comments: notificationsPreferences.comments,
      replies: notificationsPreferences.replies,
      researchUpdates: notificationsPreferences.researchUpdates,
      isUnsubscribed: notificationsPreferences.isUnsubscribed,
      contentReach: option || null,
    } satisfies NotificationsPreferencesFormData;
  }
}

export interface NotificationsPreferencesFormData {
  comments: boolean;
  contentReach: SelectValue | null;
  replies: boolean;
  researchUpdates: boolean;
  isUnsubscribed: boolean;
}

// For setting notifications via the links in emails

export interface PreferencesWithProfileContact extends NotificationsPreferences {
  isContactable: undefined | boolean;
  roles: string[];
}

export interface NotificationsPreferencesViaEmailFormData extends NotificationsPreferencesFormData {
  isContactable: undefined | boolean;
  userCode: string;
}

// Profile with email and notification preferences returned by badge/staff RPC functions
// Used by getProfilesWithAnyBadge, getProfilesByBadgeIds, and getStaffProfiles
export interface ProfileWithEmailAndPreferences {
  profile_id: number;
  profile_created_at: string;
  display_name: string;
  username: string;
  roles: string[]; // Coalesced to empty array in SQL
  email: string;
  comments: boolean;
  replies: boolean;
  research_updates: boolean;
  is_unsubscribed: boolean;
  content_reach: ContentReach;
  badge_ids: number[]; // Empty array by default, for compatibility with SubscribedUser
}
