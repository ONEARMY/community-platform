import * as functions from 'firebase-functions'
import { DB_ENDPOINTS, IUserDB } from '../models'
import { handleDBAggregations, VALUE_MODIFIERS } from './common.aggregations'
import type { IAggregation } from './common.aggregations'

interface INotificationAggregation extends IAggregation {
  sourceFields: (keyof IUserDB)[]
}

const UserNotificationAggregation: INotificationAggregation =
  // When a user's list of notifications changes reflect to aggregation
  {
    sourceCollection: 'users',
    sourceFields: ['notifications', 'notification_settings'],
    changeType: 'updated',
    targetCollection: 'user_notifications',
    targetDocId: 'emails_pending',
    process: ({ dbChange }) => {
      const user: IUserDB = dbChange.after.data() as any
      const { _id, _authID, notification_settings, notifications } = user
      const emailFrequency = notification_settings?.emailFrequency || null
      const pending = (notifications || []).filter(
        (n) => !n.notified && !n.read && !n.email,
      )
      // remove user from list if they do not have emails enabled or no pending notifications
      if (!emailFrequency || pending.length === 0) {
        return {
          [_id]: VALUE_MODIFIERS.delete(),
        }
      }
      // return list of pending notifications alongside metadata
      return {
        [_id]: { _authID, emailFrequency, notifications: pending },
      }
    },
  }

/** Watch changes to all user docs and apply aggregations */
exports.default = functions.firestore
  .document(`${DB_ENDPOINTS.users}/{id}`)
  .onUpdate((change) => {
    return handleDBAggregations(change, [UserNotificationAggregation])
  })
