// Do not use
// Old firebase database type

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

export type NotificationType = (typeof NotificationTypes)[number]

export type UserNotificationItem = {
  type: NotificationType
  children: React.ReactNode
}

export interface INotification {
  _id: string
  _created: string
  triggeredBy: {
    displayName: string
    // this field is the userName of the user, which we use as a unique id as of https://github.com/ONEARMY/community-platform/pull/2479/files
    userId: string
  }
  relevantUrl?: string
  type: NotificationType
  read: boolean
  notified: boolean
  // email contains the id of the doc in the emails collection if the notification was included in
  // an email or 'failed' if an email with this notification was attempted and encountered an error
  email?: string
  title?: string
}

export type INotificationSettings = {
  enabled?: {
    [T in NotificationType]: boolean
  }
  emailFrequency: EmailNotificationFrequency
}

export interface IPendingEmails {
  _authID: string
  _userId: string
  emailFrequency?: INotificationSettings['emailFrequency']
  notifications: INotification[]
}
