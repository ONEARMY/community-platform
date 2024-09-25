import { firestore } from 'firebase-admin'
import * as functions from 'firebase-functions'
import { DB_ENDPOINTS } from '../models'
import {
  EmailNotificationFrequency,
  INotification,
} from 'oa-shared/models/notifications'
import { FieldValue } from 'firebase-admin/firestore'
import { db } from '../Firebase/firestoreDB'
import { IUserDB } from 'oa-shared/models/user'

const VALUE_MODIFIERS = {
  delete: () => FieldValue.delete(),
  increment: (value: number) => FieldValue.increment(value),
}

type PendingEmailUpdate = {
  [x: string]:
    | firestore.FieldValue
    | {
        _authID: string
        emailFrequency: EmailNotificationFrequency
        notifications: INotification[]
      }
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

export const processNotifications = (user: IUserDB): PendingEmailUpdate => {
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

const hasNotificationChanges = (beforeUser: IUserDB, user: IUserDB) => {
  return (
    JSON.stringify(beforeUser.notification_settings) !==
      JSON.stringify(user.notification_settings) ||
    JSON.stringify(beforeUser.notifications) !==
      JSON.stringify(user.notifications)
  )
}

/** Watch changes to all user docs and updates user_notifications */
exports.default = functions
  .runWith({ memory: '512MB' })
  .firestore.document(`${DB_ENDPOINTS.users}/{id}`)
  .onUpdate(async ({ before, after }) => {
    const beforeUser = before.data() as IUserDB
    const user = after.data() as IUserDB

    // ensures user_notifications are only updated if necessary
    if (!hasNotificationChanges(beforeUser, user)) {
      return
    }

    const update = processNotifications(user)

    db.collection('user_notifications').doc('emails_pending').update(update)
  })
