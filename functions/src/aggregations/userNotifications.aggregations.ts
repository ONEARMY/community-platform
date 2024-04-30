import * as functions from 'firebase-functions'
import { DB_ENDPOINTS, INotification, IUserDB } from '../models'
import { handleDBAggregations, VALUE_MODIFIERS } from './common.aggregations'
import type { IAggregation, IDBChange } from './common.aggregations'
import { EmailNotificationFrequency } from 'oa-shared'

interface INotificationAggregation extends IAggregation {
  sourceFields: (keyof IUserDB)[]
}

const getPendingNotifications = (notifications: INotification[]) => {
  return notifications.filter((n) => !n.notified && !n.read && !n.email)
}

const shouldSendNotifications = (
  emailFrequency: EmailNotificationFrequency,
  pendingNotifications: INotification[],
) => {
  return (
    emailFrequency &&
    emailFrequency !== EmailNotificationFrequency.NEVER &&
    pendingNotifications.length > 0
  )
}

export const processNotifications = (dbChange: IDBChange) => {
  const user = dbChange.after.data() as IUserDB
  const emailFrequency = user.notification_settings?.emailFrequency || null
  const pending = getPendingNotifications(user.notifications || [])

  // remove user from list if they do not have emails enabled or no pending notifications
  if (!shouldSendNotifications(emailFrequency, pending)) {
    return {
      [user._id]: VALUE_MODIFIERS.delete(),
    }
  }

  // return list of pending notifications alongside metadata
  return {
    [user._id]: {
      _authID: user._authID,
      emailFrequency,
      notifications: pending,
    },
  }
}

const UserNotificationAggregation: INotificationAggregation =
  // When a user's list of notifications changes reflect to aggregation
  {
    sourceCollection: 'users',
    sourceFields: ['notifications', 'notification_settings'],
    changeType: 'updated',
    targetCollection: 'user_notifications',
    targetDocId: 'emails_pending',
    process: ({ dbChange }) => processNotifications(dbChange),
  }

/** Watch changes to all user docs and apply aggregations */
exports.default = functions
  .runWith({ memory: '512MB' })
  .firestore.document(`${DB_ENDPOINTS.users}/{id}`)
  .onUpdate((change) => {
    return handleDBAggregations(change, [UserNotificationAggregation])
  })
