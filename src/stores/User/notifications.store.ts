import type {
  INotification,
  INotificationUpdate,
  NotificationType,
} from 'src/models/user.models'
import { action, makeObservable, toJS } from 'mobx'
import { randomID } from 'src/utils/helpers'

import { ModuleStore } from '../common/module.store'
// eslint-disable-next-line import/namespace
import { COLLECTION_NAME as USER_COLLECTION_NAME } from './user.store'

import type { RootStore } from '..'
import type { IUserPP, IUserPPDB } from 'src/models/userPreciousPlastic.models'
import { logger } from 'src/logger'

// const COLLECTION_NAME = 'user_notifications'

export class UserNotificationsStore extends ModuleStore {
  constructor(rootStore: RootStore) {
    super(rootStore)
    makeObservable(this)
  }

  get user() {
    return this.userStore.user
  }

  // Returns all users created and notified but not read notifications
  //
  // Notification states are `created -> notified -> read`
  public getUnreadNotifications() {
    return (
      this.user?.notifications
        ?.filter((notification) => !notification.read)
        .sort(
          (a, b) =>
            new Date(b._created).getTime() - new Date(a._created).getTime(),
        ) || []
    )
  }

  // Returns all users created but not notified and not read notifications
  //
  // Notification states are `created -> notified -> read`
  public getUnnotifiedNotifications() {
    return (
      this.user?.notifications
        ?.filter((notification) => !notification.notified && !notification.read)
        .sort(
          (a, b) =>
            new Date(b._created).getTime() - new Date(a._created).getTime(),
        ) || []
    )
  }

  @action
  public async triggerNotification(
    type: NotificationType,
    username: string,
    relevantUrl: string,
  ) {
    try {
      const triggeredBy = this.user
      if (triggeredBy) {
        // do not get notified when you're the one making a new comment or how-to useful vote
        if (triggeredBy.userName === username) {
          return
        }
        const newNotification: INotification = {
          _id: randomID(),
          _created: new Date().toISOString(),
          triggeredBy: {
            displayName: triggeredBy.displayName,
            // userName is used here as user records now use userName as userId.
            // The property name hasn't been refactored as it would require a data migration for existing records.
            // Plan is to move to a relational database when time allows.
            // Notifications would be migrated to their own table at this point.
            userId: triggeredBy.userName,
          },
          relevantUrl: relevantUrl,
          type,
          read: false,
          notified: false,
        }

        const lookup = await this.db
          .collection<IUserPP>(USER_COLLECTION_NAME)
          .getWhere('userName', '==', username)

        const user = lookup[0]
        if (!user) {
          throw new Error('User not found.')
        }
        const notifications = user.notifications
          ? [...toJS(user.notifications), newNotification]
          : [newNotification]

        await this._updateUserNotifications(user, notifications)
      }
    } catch (err) {
      logger.error(err)
      throw new Error(err)
    }
  }

  @action
  public async markAllNotificationsNotified() {
    try {
      const user = this.user
      if (user) {
        const notifications = toJS(user.notifications)
        notifications?.forEach((notification) => (notification.notified = true))

        await this._updateUserNotifications(user, notifications)
        await this.userStore.refreshActiveUserDetails()
      }
    } catch (err) {
      logger.error(err)
      throw new Error(err)
    }
  }

  @action
  public async markAllNotificationsRead() {
    try {
      const user = this.user
      if (user) {
        const notifications = toJS(user.notifications)
        notifications?.forEach((notification) => (notification.read = true))

        await this._updateUserNotifications(user, notifications)
        await this.userStore.refreshActiveUserDetails()
      }
    } catch (err) {
      logger.error(err)
      throw new Error(err)
    }
  }

  @action
  public async deleteNotification(id: string) {
    try {
      const user = this.user
      if (id && user && user.notifications) {
        const notifications = toJS(user.notifications).filter(
          (notification) => !(notification._id === id),
        )

        await this._updateUserNotifications(user, notifications)
      }
    } catch (err) {
      logger.error(err)
      throw new Error(err)
    }
  }

  private async _updateUserNotifications(user: IUserPPDB, notifications) {
    const dbRef = this.db
      .collection<INotificationUpdate>(USER_COLLECTION_NAME)
      .doc(user.userName)

    const notificationUpdate = {
      _id: user.userName,
      notifications,
    }

    await dbRef.update(notificationUpdate)
  }
}
