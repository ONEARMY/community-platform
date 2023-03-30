import type {
  INotification,
  IUser,
  NotificationType,
} from 'src/models/user.models'
import { action, makeObservable, toJS } from 'mobx'
import { randomID } from 'src/utils/helpers'

import { ModuleStore } from '../common/module.store'
// eslint-disable-next-line import/namespace
import { COLLECTION_NAME as USER_COLLECTION_NAME } from './user.store'

import type { RootStore } from '..'
import type { IUserPP } from 'src/models/userPreciousPlastic.models'
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
            userId: triggeredBy._id,
          },
          relevantUrl: relevantUrl,
          type: type,
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
        const updatedUser: IUser = {
          ...toJS(user),
          notifications: user.notifications
            ? [...toJS(user.notifications), newNotification]
            : [newNotification],
        }

        const dbRef = this.db
          .collection<IUser>(USER_COLLECTION_NAME)
          .doc(updatedUser._authID)

        await dbRef.set(updatedUser)
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
        const updatedUser: IUser = {
          ...toJS(user),
          notifications,
        }

        const dbRef = this.db
          .collection<IUser>(USER_COLLECTION_NAME)
          .doc(updatedUser._authID)

        await dbRef.set(updatedUser)
        await this.userStore.updateUserProfile({ notifications })
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
        const updatedUser: IUser = {
          ...toJS(user),
          notifications,
        }

        const dbRef = this.db
          .collection<IUser>(USER_COLLECTION_NAME)
          .doc(updatedUser._authID)

        await dbRef.set(updatedUser)
        await this.userStore.updateUserProfile({ notifications })
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

        const updatedUser: IUser = {
          ...toJS(user),
          notifications,
        }

        const dbRef = this.db
          .collection<IUser>(USER_COLLECTION_NAME)
          .doc(updatedUser._authID)
        await dbRef.set(updatedUser)
        //TODO: ensure current user is updated
      }
    } catch (err) {
      logger.error(err)
      throw new Error(err)
    }
  }
}
