export class NotificationsPreferences {
  id?: number
  user_id?: number
  comments: boolean
  replies: boolean
}

export class DBNotificationsPreferences {
  id: number
  user_id: number
  comments: boolean
  replies: boolean
}

export type NotificationsPreferenceTypes = 'comments' | 'replies' | 'news'

export interface NotificationsPreferencesFormData {
  comments: boolean
  replies: boolean
  id?: number
}
