export class NotificationsPreferences {
  id?: number
  user_id?: number
  comments: boolean
  replies: boolean
  research_updates: boolean
}

export class DBNotificationsPreferences {
  id: number
  user_id: number
  comments: boolean
  replies: boolean
  research_updates: boolean
}

export type NotificationsPreferenceTypes =
  | 'comments'
  | 'replies'
  | 'research_updates'

export interface NotificationsPreferencesFormData {
  comments: boolean
  replies: boolean
  research_updates: boolean
  id?: number
}
