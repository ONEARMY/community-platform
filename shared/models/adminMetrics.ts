// Row returned by the get_profile_type_counts RPC function
export interface ProfileTypeCount {
  profile_type_id: number;
  name: string;
  display_name: string;
  profile_count: number;
}

// Row returned by the get_supporter_badge_counts RPC function
export interface SupporterBadgeCount {
  badge_id: number;
  badge_name: string;
  supporter_count: number;
}

export interface NotificationWeekTotal {
  week_start: string;
  total: number;
}

export interface NotificationReadTotal {
  is_read: boolean;
  total: number;
}

export interface NotificationTypeTotal {
  action_type: string;
  content_type: string;
  total: number;
}

export interface NotificationBooleanPreference {
  enabled: number;
  disabled: number;
}

export interface NotificationPreferenceTotals {
  total: number;
  comments: NotificationBooleanPreference;
  replies: NotificationBooleanPreference;
  research_updates: NotificationBooleanPreference;
  content_reach: { all: number; important: number; unset: number };
}

export interface NotificationStats {
  total: number;
  weekly: NotificationWeekTotal[];
  read: NotificationReadTotal[];
  types: NotificationTypeTotal[];
  preferences: NotificationPreferenceTotals;
  unsubscribed: number;
}
