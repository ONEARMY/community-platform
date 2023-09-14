import { FirebaseEmulatedTest } from '../test/Firebase/emulator'
import { DB_ENDPOINTS, IUserDB, INotification } from '../models'
import { createNotificationEmails } from './createNotificationEmails'
import { EmailNotificationFrequency } from 'oa-shared'

jest.mock('../Firebase/auth', () => ({
  firebaseAuth: {
    getUser: () => ({
      email: 'test@test.com',
    }),
  },
}))

jest.mock('../config/config', () => ({
  CONFIG: {
    deployment: {
      site_url: 'https://community.preciousplastic.com',
    },
  },
}))

const notificationFactory = (
  _userId: string,
  _id: string,
  notification: Partial<INotification>,
): INotification => ({
  _id,
  _created: '',
  triggeredBy: {
    displayName: '',
    userId: '',
  },
  relevantUrl: '',
  type: 'new_comment',
  read: false,
  notified: false,
  ...notification,
})

const userFactory = (_id: string, user: Partial<IUserDB> = {}): IUserDB => ({
  _id,
  _authID: _id,
  ...(user as IUserDB),
})

describe('create email test', () => {
  const db = FirebaseEmulatedTest.admin.firestore()

  beforeEach(async () => {
    await FirebaseEmulatedTest.clearFirestoreDB()
    await FirebaseEmulatedTest.seedFirestoreDB('emails')

    const user1Notifications = [
      notificationFactory('user_1', 'notification_1', {
        triggeredBy: {
          displayName: 'User 2',
          userId: 'user_2',
        },
        relevantUrl: '/test',
        type: 'howto_useful',
      }),
      notificationFactory('user_1', 'notification_2', {
        triggeredBy: {
          displayName: 'User 2',
          userId: 'user_2',
        },
        relevantUrl: '/test',
        type: 'new_comment_research',
      }),
      notificationFactory('user_1', 'notification_3', {
        triggeredBy: {
          displayName: 'User 3',
          userId: 'user_3',
        },
        relevantUrl: '/test',
        type: 'howto_mention',
      }),
      notificationFactory('user_1', 'notification_4', {
        triggeredBy: {
          displayName: 'User 1',
          userId: 'user_1',
        },
        relevantUrl: '/test',
        type: 'map_pin_approved',
      }),
    ]

    const user2Notifications = [
      notificationFactory('user_2', 'notification_1', {
        triggeredBy: {
          displayName: 'User 1',
          userId: 'user_1',
        },
        relevantUrl: '/test',
        type: 'new_comment',
      }),
      notificationFactory('user_2', 'notification_2', {
        triggeredBy: {
          displayName: 'User 3',
          userId: 'user_3',
        },
        relevantUrl: '/test',
        type: 'new_comment_research',
      }),
      notificationFactory('user_2', 'notification_3', {
        triggeredBy: {
          displayName: 'User 3',
          userId: 'user_3',
        },
        relevantUrl: '/test',
        type: 'research_update',
      }),
      notificationFactory('user_2', 'notification_4', {
        triggeredBy: {
          displayName: 'User 2',
          userId: 'user_2',
        },
        relevantUrl: '/test',
        type: 'research_needs_updates',
      }),
    ]

    const user3Notifications = [
      notificationFactory('user_3', 'notification_1', {
        triggeredBy: {
          displayName: 'User 1',
          userId: 'user_1',
        },
        relevantUrl: '/test',
        type: 'new_comment',
      }),
    ]

    await FirebaseEmulatedTest.seedFirestoreDB('users', [
      userFactory('user_1', {
        notifications: user1Notifications,
        displayName: 'User 1',
        userName: 'user_1',
      }),
      userFactory('user_2', {
        notifications: user2Notifications,
        displayName: 'User 2',
        userName: 'user_2',
      }),
      userFactory('user_3', {
        notifications: user3Notifications,
        displayName: 'User 3',
        userName: 'user_3',
      }),
      userFactory('user_4', {
        displayName: 'User 4',
        userName: 'user_4',
      }),
    ])

    await FirebaseEmulatedTest.seedFirestoreDB('user_notifications')

    await db
      .collection(DB_ENDPOINTS['user_notifications'])
      .doc('emails_pending')
      .set({
        ['user_1']: {
          _authId: '',
          _userId: 'user_1',
          notifications: user1Notifications,
          emailFrequency: EmailNotificationFrequency.WEEKLY,
        },
        ['user_2']: {
          _authId: '',
          _userId: 'user_2',
          notifications: user2Notifications,
          emailFrequency: EmailNotificationFrequency.MONTHLY,
        },
        ['user_3']: {
          _authId: '',
          _userId: 'user_3',
          notifications: user3Notifications,
          emailFrequency: EmailNotificationFrequency.NEVER,
        },
        ['user_4']: {
          _authId: '',
          _userId: 'user_4',
          notifications: [],
          emailFrequency: EmailNotificationFrequency.DAILY,
        },
      })
  })

  afterEach(async () => {
    await FirebaseEmulatedTest.clearFirestoreDB()
  })

  it('Creates email from pending notifications weekly', async () => {
    await createNotificationEmails(EmailNotificationFrequency.WEEKLY)

    // Only one weekly email should have been created
    const countSnapshot = await db.collection(DB_ENDPOINTS.emails).count().get()
    expect(countSnapshot.data().count).toEqual(1)

    const querySnapshot = await db.collection(DB_ENDPOINTS.emails).get()

    querySnapshot.forEach((doc) => {
      const {
        message: { html, subject },
        to,
      } = doc.data()
      expect(html).toMatchSnapshot()
      expect(subject).toBe(`You've missed notifications from Precious Plastic`)
      expect(to).toBe('test@test.com')
    })

    // Notifications should have been updated with email id
    const notificationsQuerySnapshot = await db
      .collection(DB_ENDPOINTS.users)
      .doc('user_1')
      .get()
    const { notifications } = notificationsQuerySnapshot.data()
    notifications.forEach(({ email }) =>
      expect(email).toBe(querySnapshot.docs[0].id),
    )
  })

  it('Creates email from pending notifications monthly', async () => {
    await createNotificationEmails(EmailNotificationFrequency.MONTHLY)

    // Only one monthly email should have been created
    const countSnapshot = await db.collection(DB_ENDPOINTS.emails).count().get()
    expect(countSnapshot.data().count).toEqual(1)

    const querySnapshot = await db.collection(DB_ENDPOINTS.emails).get()
    querySnapshot.forEach((doc) => {
      const {
        message: { html, subject },
        to,
      } = doc.data()
      expect(html).toMatchSnapshot()
      expect(subject).toBe(`You've missed notifications from Precious Plastic`)
      expect(to).toBe('test@test.com')
    })

    // Notifications should have been updated with email id
    const notificationsQuerySnapshot = await db
      .collection(DB_ENDPOINTS.users)
      .doc('user_2')
      .get()
    const { notifications } = notificationsQuerySnapshot.data()
    notifications.forEach(({ email }) =>
      expect(email).toBe(querySnapshot.docs[0].id),
    )
  })

  it('Creates emails from pending notifications all', async () => {
    await createNotificationEmails()

    // Two emails should have been created
    const countSnapshot = await db.collection(DB_ENDPOINTS.emails).count().get()
    expect(countSnapshot.data().count).toEqual(2)
  })
})
