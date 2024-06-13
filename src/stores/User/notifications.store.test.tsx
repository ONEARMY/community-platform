import { FactoryNotification } from 'src/test/factories/Notification'
import { FactoryUser } from 'src/test/factories/User'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { MockDBStore } from '../common/__mocks__/module.store'
import { UserNotificationsStore } from './notifications.store'

vi.mock('../common/module.store')

/**
 * When mocking unit tests the db will be mocked from the common module store mock
 * and userStore manually overridden with mocks below
 */
class MockNotificationsStore extends UserNotificationsStore {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  db = new MockDBStore()
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  userStore = {
    user: FactoryUser({
      _id: 'userId',
      userName: 'userName',
      notifications: [],
    }),
    refreshActiveUserDetails: vi.fn(),
  }
  constructor() {
    super(null as any)
  }
}

describe('triggerNotification', () => {
  let store: MockNotificationsStore
  beforeEach(() => {
    store = new MockNotificationsStore()
  })

  it('adds a new notification to user', async () => {
    const store = new MockNotificationsStore()
    const userName = 'exampleUser'
    store.db.getWhere.mockReturnValue([
      FactoryUser({ _id: 'exampleId', userName }),
    ])
    // Act
    await store.triggerNotification(
      'howto_mention',
      userName,
      'https://example.com',
      'exampleTitle',
    )
    // Expect
    const [newUser] = store.db.update.mock.calls[0]

    expect(store.db.doc).toBeCalledWith(userName)
    expect(store.db.update).toBeCalledTimes(1)
    expect(store.db.update).toHaveBeenCalledWith(expect.objectContaining({}), {
      keep_modified_timestamp: true,
    })
    expect(newUser.notifications).toHaveLength(1)
    expect(newUser.notifications[0]).toEqual(
      expect.objectContaining({
        type: 'howto_mention',
      }),
    )
  })

  it('throws error when invalid user passed', async () => {
    // Act
    expect(
      store.triggerNotification(
        'howto_mention',
        'non-existent-user',
        'https://example.com',
        'example',
      ),
    ).rejects.toThrow('User not found')
  })
})

describe('notifications.store', () => {
  let store: MockNotificationsStore
  beforeEach(() => {
    store = new MockNotificationsStore()
    // Mock notification assortment
    const FactoryNotificationSample = () => [
      FactoryNotification({ read: true, notified: true }),
      FactoryNotification({ read: true, notified: true }),
      FactoryNotification({ read: true, notified: true }),
      FactoryNotification({ read: false, notified: false }),
      FactoryNotification({ read: false, notified: false }),
      FactoryNotification({ read: false, notified: true }),
    ]
    store.userStore.user.notifications = FactoryNotificationSample()
  })
  it('loads user with notifications', async () => {
    const notifications = store.userStore.user?.notifications
    expect(notifications).toHaveLength(6)
  })
  it('gets unnotified notifications', async () => {
    const unnotified = store.getUnnotifiedNotifications()
    expect(unnotified).toHaveLength(2)
  })
  it('gets unread notifications', async () => {
    const unread = store.getUnreadNotifications()
    expect(unread).toHaveLength(3)
  })
  it('deletes a notification', async () => {
    await store.deleteNotification(store.user!.notifications![0]._id)

    expect(store.db.doc).toBeCalledWith('userName')
    expect(store.db.update).toHaveBeenCalledTimes(1)

    const updatedUser = store.db.update.mock.calls[0][0]
    expect(updatedUser.notifications).toHaveLength(
      store.userStore.user!.notifications!.length - 1,
    )
  })
  it('marks all notifications as notified', async () => {
    await store.markAllNotificationsNotified()

    expect(store.db.doc).toBeCalledWith('userName')
    expect(store.db.update).toHaveBeenCalledTimes(1)
  })
  it('marks all notifications as read', async () => {
    await store.markAllNotificationsRead()

    expect(store.db.doc).toBeCalledWith('userName')
    expect(store.db.update).toHaveBeenCalledTimes(1)
  })
})
