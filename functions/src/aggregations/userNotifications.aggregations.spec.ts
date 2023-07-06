import { DB_ENDPOINTS, IUserDB } from '../models'
import { FirebaseEmulatedTest } from '../test/Firebase/emulator'
import type { INotification } from '../../../src/models'
import { EmailNotificationFrequency } from 'oa-shared'

// use require to allow import of exports.default syntax for the function
const {
  default: UserNotificationsAggregationFunction,
} = require('./userNotifications.aggregations')

const mockNotification: Partial<INotification> = { _id: 'notification_1' }

const userFactory = (_id: string, user: Partial<IUserDB> = {}): IUserDB => ({
  _id,
  _authID: _id,
  notifications: [],
  notification_settings: {
    emailFrequency: 'weekly' as any,
    enabled: {} as any,
  },
  ...(user as IUserDB),
})

const userWithoutNotifications = userFactory('user_1')
const userWithNotifications = userFactory('user_1', {
  notifications: [mockNotification as INotification],
})
const userWithReadNotifications = userFactory('user_1', {
  notifications: [
    { read: true, ...(mockNotification as INotification) },
    { notified: true, ...(mockNotification as INotification) },
    { email: 'abc123', ...(mockNotification as INotification) },
  ],
})
const userWithNeverEmailFrequency = userFactory('user_1', {
  notifications: [mockNotification as INotification],
  notification_settings: {
    emailFrequency: EmailNotificationFrequency.NEVER,
  },
})

describe('User Notifications Aggregation', () => {
  const db = FirebaseEmulatedTest.admin.firestore()

  beforeAll(async () => {
    await FirebaseEmulatedTest.clearFirestoreDB()
    await FirebaseEmulatedTest.seedFirestoreDB('users', [userFactory('user_1')])
    await FirebaseEmulatedTest.seedFirestoreDB('user_notifications')
    const targetEndpoint = DB_ENDPOINTS['user_notifications']
    db.collection(targetEndpoint).doc('emails_pending').set({})
  })
  afterAll(async () => {
    await FirebaseEmulatedTest.clearFirestoreDB()
  })

  it('Aggregates user notifications to collection', async () => {
    const change = FirebaseEmulatedTest.mockFirestoreChangeObject(
      userWithoutNotifications,
      userWithNotifications,
      'users',
      'user_1',
    )
    await FirebaseEmulatedTest.run(UserNotificationsAggregationFunction, change)

    // check if aggregated list of pending emails created in user_notifications endpoint
    // with a subset of information
    const targetEndpoint = DB_ENDPOINTS['user_notifications']
    const res = await db.collection(targetEndpoint).doc('emails_pending').get()
    const { _authID, notification_settings, notifications } =
      userWithNotifications
    const { emailFrequency } = notification_settings
    expect(res.data()).toEqual({
      user_1: { _authID, emailFrequency, notifications },
    })
  })

  it('Does not aggregate read, notified, or emailed user notifications to collection', async () => {
    const change = FirebaseEmulatedTest.mockFirestoreChangeObject(
      userWithNotifications,
      userWithReadNotifications,
      'users',
      'user_1',
    )
    await FirebaseEmulatedTest.run(UserNotificationsAggregationFunction, change)

    // check if list is removed when all notifications are read, notified, or filtered
    const targetEndpoint = DB_ENDPOINTS['user_notifications']
    const res = await db.collection(targetEndpoint).doc('emails_pending').get()
    expect(res.data()).toEqual({})
  })

  it('Does not aggregate user notifications to collection for users with never frequency ', async () => {
    const change = FirebaseEmulatedTest.mockFirestoreChangeObject(
      userWithNotifications,
      userWithNeverEmailFrequency,
      'users',
      'user_1',
    )
    await FirebaseEmulatedTest.run(UserNotificationsAggregationFunction, change)

    // check if user is not added to list when they have "never" email frequency setting
    const targetEndpoint = DB_ENDPOINTS['user_notifications']
    const res = await db.collection(targetEndpoint).doc('emails_pending').get()
    expect(res.data()).toEqual({})
  })
})
