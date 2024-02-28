export enum EmailNotificationFrequency {
  NEVER = 'never',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

export const NotificationTypes = [
  'new_comment', // legacy format, should use new_comment_discussion
  'howto_useful',
  'howto_mention',
  'howto_approved',
  'howto_needs_updates',
  'map_pin_approved',
  'map_pin_needs_updates',
  'new_comment_discussion',
  'new_comment_research', // legacy format, should use new_comment_discussion
  'research_useful',
  'research_mention',
  'research_update',
  'research_approved',
  'research_needs_updates',
] as const

export type NotificationType = typeof NotificationTypes[number]
