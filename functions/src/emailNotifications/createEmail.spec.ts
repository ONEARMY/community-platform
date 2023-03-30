import { FirebaseEmulatedTest } from '../test/Firebase/emulator'
import { DB_ENDPOINTS, INotification, IUserDB } from '../../../src/models'
import { createNotificationEmails, TEMPLATE_NAME } from './createEmail'

// mock pending emails fetch

// mock get user fetch

// assert doc we add to EMAIL_COLLECTION is correct

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

  beforeAll(async () => {
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
    await FirebaseEmulatedTest.seedFirestoreDB(
      'user_notifications',
      user1Notifications,
    )
  })

  afterEach(async () => {
    await FirebaseEmulatedTest.clearFirestoreDB()
  })

  it('Creates email from pending notifications', async () => {
    await createNotificationEmails()

    const targetEndpoint = DB_ENDPOINTS.emails
    const res = await db.collection(targetEndpoint).doc('user_1').get()
    expect(res.data()).toMatchObject({
      user_1: {
        template: TEMPLATE_NAME,
        data: {
          displayName: 'User 1',
          comments: [
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
              resourceType: 'research',
              actionType: 'comment',
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
              resourceType: 'howto',
              actionType: 'mention',
            },
          ],
          usefuls: [
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
              resourceType: 'howto',
              actionType: 'useful',
            },
          ],
        },
      },
    })
  })
})
