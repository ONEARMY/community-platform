import { DB_ENDPOINTS, IUserDB } from '../models'
import { FirebaseEmulatedTest } from '../test/Firebase/emulator'
import type { INotification } from '../../../src/models'
import { EmailNotificationFrequency } from 'oa-shared'
import { processNotifications } from './userNotifications.aggregations'
import { FieldValue } from 'firebase-admin/firestore'

const mockNotification: Partial<INotification> = { _id: 'notification_1' }

const userFactory = (_id: string, user: Partial<IUserDB> = {}): IUserDB => ({
  _id,
  _authID: _id,
  notifications: [],
  notification_settings: {
    emailFrequency: EmailNotificationFrequency.WEEKLY,
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
  it('Aggregates user notifications to collection', async () => {
    const { _authID, notification_settings, notifications } =
      userWithNotifications
    const { emailFrequency } = notification_settings

    const data = processNotifications(
      FirebaseEmulatedTest.mockFirestoreChangeObject(
        userWithoutNotifications,
        userWithNotifications,
        'users',
        'user_1',
      ),
    )
    expect(data).toEqual({
      user_1: { _authID, emailFrequency, notifications },
    })
  })

  it('Does not aggregate read, notified, or emailed user notifications to collection', async () => {
    const data = processNotifications(
      FirebaseEmulatedTest.mockFirestoreChangeObject(
        userWithNotifications,
        userWithReadNotifications,
        'users',
        'user_1',
      ),
    )
    expect(data).toEqual({ user_1: FieldValue.delete() })
  })

  it('Does not aggregate user notifications to collection for users with never frequency ', async () => {
    const data = processNotifications(
      FirebaseEmulatedTest.mockFirestoreChangeObject(
        userWithNotifications,
        userWithNeverEmailFrequency,
        'users',
        'user_1',
      ),
    )
    expect(data).toEqual({ user_1: FieldValue.delete() })
  })
})
