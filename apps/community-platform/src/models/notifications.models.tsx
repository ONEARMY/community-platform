import type { INotification, INotificationSettings } from './user.models'

export interface IPendingEmails {
  _authID: string
  _userId: string
  emailFrequency?: INotificationSettings['emailFrequency']
  notifications: INotification[]
}
