jest.mock('../common/module.store')
import { FactoryNotificationSample } from 'src/test/factories/Notification'

import { FactoryUser } from 'src/test/factories/User'
import type { IMockDB } from '../common/__mocks__/module.store'
import { UserNotificationsStore } from './notifications.store'

const factory = async () => {
  const store = new UserNotificationsStore(null as any)

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  store.userStore = {
    user: FactoryUser({
      _authID: 'userId',
      userName: 'username',
      notifications: FactoryNotificationSample(),
    }),
    updateUserProfile: jest.fn(),
  }
  // db mock methods already mocked in common __mocks__ folder, just extend
  ;(store.db as any as IMockDB).getWhere.mockResolvedValue([
    {
      _authID: 'user_to_notify',
    },
  ])
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment

  return {
    store,
    db: store.db as any as IMockDB,
  }
}

describe('notifications.store', () => {
  it('loads user with notifications', async () => {
    const { store } = await factory()
    const notifications = store.userStore.user?.notifications
    expect(notifications).toHaveLength(6)
  })

  it('gets unnotified notifications', async () => {
    const { store } = await factory()
    const unnotified = store.getUnnotifiedNotifications()
    expect(unnotified).toHaveLength(2)
  })
  it('gets unread notifications', async () => {
    const { store } = await factory()
    const unread = store.getUnreadNotifications()
    expect(unread).toHaveLength(3)
  })
  it('deletes a notification', async () => {
    const { store, db } = await factory()
    await store.deleteNotification(store.user!.notifications![0]._id)
    expect(db.set).toHaveBeenCalledTimes(1)
    const updatedUser = db.set.mock.calls[0][0]
    expect(updatedUser.notifications).toHaveLength(
      store.userStore.user!.notifications!.length - 1,
    )
  })
  it('marks all notifications as notified', async () => {
    const { store, db } = await factory()
    await store.markAllNotificationsNotified()
    expect(db.set).toHaveBeenCalledTimes(1)
  })
  it('marks all notifications as read', async () => {
    const { store, db } = await factory()
    await store.markAllNotificationsRead()
    expect(db.set).toHaveBeenCalledTimes(1)
  })
  it('triggers notification', async () => {
    const { store, db } = await factory()
    await store.triggerNotification('howto_useful', 'test', '/')
    expect(db.set).toHaveBeenCalledTimes(1)
  })
})
