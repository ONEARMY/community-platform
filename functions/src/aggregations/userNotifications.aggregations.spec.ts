import { DB_ENDPOINTS, IUserDB } from '../models'
import { FirebaseEmulatedTest } from '../test/Firebase/emulator'
import type { INotification } from '../../../src/models'

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

describe('User Notifications Aggregation', () => {
  const db = FirebaseEmulatedTest.admin.firestore()

  beforeEach(async () => {
    await FirebaseEmulatedTest.clearFirestoreDB()
    await FirebaseEmulatedTest.seedFirestoreDB('users', [
      userFactory('user_1', {
        notifications: [mockNotification as INotification],
      }),
    ])
    await FirebaseEmulatedTest.seedFirestoreDB('user_notifications')
  })
  afterEach(async () => {
    await FirebaseEmulatedTest.clearFirestoreDB()
  })

  it('Aggregates user notifications to collection', async () => {
    const before = userFactory('user_1')
    const after = userFactory('user_1', {
      notifications: [mockNotification as INotification],
    })
    const change = FirebaseEmulatedTest.mockFirestoreChangeObject(
      before,
      after,
      'users',
      'user_1',
    )
    // use require to allow import of exports.default syntax for the function
    const {
      default: UserNotificationsAggregationFunction,
    } = require('./userNotifications.aggregations')
    await FirebaseEmulatedTest.run(UserNotificationsAggregationFunction, change)

    // check if aggregated list of pending emails created in user_notifications endpoint
    // with a subset of information
    const targetEndpoint = DB_ENDPOINTS['user_notifications']
    const res = await db.collection(targetEndpoint).doc('emails_pending').get()
    const { _authID, notification_settings, notifications } = after
    const { emailFrequency } = notification_settings
    expect(res.data()).toEqual({
      user_1: { _authID, emailFrequency, notifications },
    })
  })
})
