import type { DBNotificationsPreferences } from 'oa-shared';

export const factoryNotificationsPreferences = (
  userOverloads: Partial<DBNotificationsPreferences> = {},
): DBNotificationsPreferences =>
  ({
    id: 1,
    user_id: 123,
    comments: true,
    replies: false,
    research_updates: true,
    is_unsubscribed: false,
    ...userOverloads,
  }) as DBNotificationsPreferences;
