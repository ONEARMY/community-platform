import { FirebaseEmulatedTest } from '../test/Firebase/emulator'
import { INotification } from '../../../src/models'
import { DB_ENDPOINTS, IUserDB } from '../models'
import { createNotificationEmails, TEMPLATE_NAME } from './createEmail'

jest.mock('../Firebase/auth', () => ({
  firebaseAuth: {
    getUser: () => ({
      email: 'test@test.com',
    }),
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
  notifications: [],
  notification_settings: {
    emailFrequency: 'weekly' as any,
    enabled: {} as any,
  },
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
        relevantUrl: 'https://community.preciousplastic.com/test',
        type: 'howto_useful',
      }),
      notificationFactory('user_1', 'notification_2', {
        triggeredBy: {
          displayName: 'User 2',
          userId: 'user_2',
        },
        relevantUrl: 'https://community.preciousplastic.com/test',
        type: 'new_comment_research',
      }),
      notificationFactory('user_1', 'notification_3', {
        triggeredBy: {
          displayName: 'User 3',
          userId: 'user_3',
        },
        relevantUrl: 'https://community.preciousplastic.com/test',
        type: 'howto_mention',
      }),
    ]

    await FirebaseEmulatedTest.seedFirestoreDB('users', [
      userFactory('user_1', {
        notifications: user1Notifications,
        displayName: 'User 1',
      }),
      userFactory('user_2', {
        userName: 'user2',
      }),
      userFactory('user_3', {
        userName: 'user3',
      }),
      userFactory('user_4', {
        userName: 'user4',
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
        },
        ['user_2']: {
          _authId: '',
          _userId: 'user_2',
          notifications: [],
        },
      })
  })

  afterEach(async () => {
    await FirebaseEmulatedTest.clearFirestoreDB()
  })

  it('Creates email from pending notifications', async () => {
    await createNotificationEmails()

    const countSnapshot = await db
      .collection(DB_ENDPOINTS.emails)
      .where('template.data.displayName', '==', 'User 1')
      .count()
      .get()

    expect(countSnapshot.data().count).toEqual(1)

    const querySnapshot = await db
      .collection(DB_ENDPOINTS.emails)
      .where('toUids', 'array-contains', 'user_1')
      .limit(1)
      .get()

    querySnapshot.forEach((doc) => {
      expect(doc.data()).toMatchObject({
        template: {
          name: TEMPLATE_NAME,
          data: {
            displayName: 'User 1',
            hasComments: true,
            hasUsefuls: true,
            notifications: [
              {
                _id: 'notification_1',
                _created: '',
                triggeredBy: {
                  displayName: 'User 2',
                  userId: 'user_2',
                  userName: 'user2',
                },
                relevantUrl: 'https://community.preciousplastic.com/test',
                type: 'howto_useful',
                read: false,
                notified: false,
                resourceLabel: 'how-to',
                isComment: false,
                isMention: false,
                isUseful: true,
              },
              {
                _id: 'notification_2',
                _created: '',
                triggeredBy: {
                  displayName: 'User 2',
                  userId: 'user_2',
                  userName: 'user2',
                },
                relevantUrl: 'https://community.preciousplastic.com/test',
                type: 'new_comment_research',
                read: false,
                notified: false,
                resourceLabel: 'research',
                isComment: true,
                isMention: false,
                isUseful: false,
              },
              {
                _id: 'notification_3',
                _created: '',
                triggeredBy: {
                  displayName: 'User 3',
                  userId: 'user_3',
                  userName: 'user3',
                },
                relevantUrl: 'https://community.preciousplastic.com/test',
                type: 'howto_mention',
                read: false,
                notified: false,
                resourceLabel: 'how-to',
                isComment: false,
                isMention: true,
                isUseful: false,
              },
            ],
          },
        },
        to: ['test@test.com'],
      })
      return
    })
  })

  it('Does not create an email if no notifications are present', async () => {
    await createNotificationEmails()

    const querySnapshot = await db
      .collection(DB_ENDPOINTS.emails)
      .where('toUids', 'array-contains', 'user_2')
      .count()
      .get()

    expect(querySnapshot.data().count).toEqual(0)
  })
})
