import { IModerationStatus } from 'oa-shared'
import { IUserDB, UserRole } from 'oa-shared/models/user'

import { getMockHowto } from '../emulator/seed/content-generate'
import { DB_ENDPOINTS } from '../models'
import { FirebaseEmulatedTest } from '../test/Firebase/emulator'
import { PP_SIGNOFF } from './constants'
import {
  createHowtoSubmissionEmail,
  createMapPinSubmissionEmail,
  createMessageEmails,
} from './createSubmissionEmails'
import {
  HOW_TO_SUBMISSION_SUBJECT,
  MAP_PIN_SUBMISSION_SUBJECT,
} from './templateHelpers'
import * as utils from './utils'
import { IMapPin } from 'oa-shared/models/maps'
import { IMessageDB } from 'oa-shared/models/messages'

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

const userFactory = (_id: string, user: Partial<IUserDB> = {}): IUserDB =>
  ({
    _id,
    _authID: _id,
    ...user,
  }) as IUserDB

describe('Create howto submission emails', () => {
  const db = FirebaseEmulatedTest.admin.firestore()

  beforeAll(async () => {
    await FirebaseEmulatedTest.clearFirestoreDB()
    await FirebaseEmulatedTest.seedFirestoreDB('emails')

    await FirebaseEmulatedTest.seedFirestoreDB('users', [
      userFactory('user_1', {
        displayName: 'User 1',
        userName: 'user_1',
      }),
    ])
  })

  afterAll(async () => {
    await FirebaseEmulatedTest.clearFirestoreDB()
  })

  it('Creates an email for a submitted howto', async () => {
    const howto = getMockHowto('user_1', IModerationStatus.AWAITING_MODERATION)
    await createHowtoSubmissionEmail(howto)

    // Only one submitted howto email should have been created
    const countSnapshot = await db.collection(DB_ENDPOINTS.emails).count().get()
    expect(countSnapshot.data().count).toEqual(1)

    const querySnapshot = await db.collection(DB_ENDPOINTS.emails).get()
    querySnapshot.forEach((doc) => {
      const {
        message: { html, subject },
        to,
      } = doc.data()
      expect(subject).toBe(HOW_TO_SUBMISSION_SUBJECT)
      // Check that the email contains the correct user name
      expect(html).toContain('Hey User 1')
      // Check that the email contains the correct howto title
      expect(html).toContain('Mock Howto')
      // Check that the email contains the correct PP signoff
      expect(html).toContain(PP_SIGNOFF)
      expect(to).toBe('test@test.com')
    })
  })

  it('Does not create email for draft projects', async () => {
    const howto = getMockHowto('user_1', IModerationStatus.DRAFT)
    await createHowtoSubmissionEmail(howto)

    // No new emails should have been created
    const countSnapshot = await db.collection(DB_ENDPOINTS.emails).count().get()
    expect(countSnapshot.data().count).toEqual(1)
  })
})

describe('Create map pin submission emails', () => {
  const db = FirebaseEmulatedTest.admin.firestore()

  beforeAll(async () => {
    await FirebaseEmulatedTest.clearFirestoreDB()
    await FirebaseEmulatedTest.seedFirestoreDB('emails')

    await FirebaseEmulatedTest.seedFirestoreDB('users', [
      userFactory('user_1', {
        displayName: 'User 1',
        userName: 'user_1',
      }),
    ])
  })

  afterAll(async () => {
    await FirebaseEmulatedTest.clearFirestoreDB()
  })

  it('Creates an email for a submitted map pin', async () => {
    const mapPin = {
      _id: 'user_1',
      moderation: IModerationStatus.AWAITING_MODERATION,
    }
    await createMapPinSubmissionEmail(mapPin as IMapPin)

    // Only one submitted map pin email should have been created
    const countSnapshot = await db.collection(DB_ENDPOINTS.emails).count().get()
    expect(countSnapshot.data().count).toEqual(1)

    const querySnapshot = await db.collection(DB_ENDPOINTS.emails).get()
    querySnapshot.forEach((doc) => {
      const {
        message: { html, subject },
        to,
      } = doc.data()
      expect(subject).toBe(MAP_PIN_SUBMISSION_SUBJECT)
      // Check that the email contains the correct user name
      expect(html).toContain('Hey User 1')
      // Check that the email contains the correct title
      expect(html).toContain('Your map pin has been submitted.')
      // Check that the email contains the correct PP signoff
      expect(html).toContain(PP_SIGNOFF)
      expect(to).toBe('test@test.com')
    })
  })
})

describe('Message emails', () => {
  const db = FirebaseEmulatedTest.admin.firestore()
  const message = {
    _id: '234dfsb',
    email: 'jeffery@gmail.com',
    text: 'Hi, can we be friends please?',
    toUserName: 'user_1',
    isSent: false,
  }
  const user = userFactory('user_1', {
    displayName: 'User 1',
    userName: 'user_1',
    userRoles: [UserRole.BETA_TESTER],
    isContactableByPublic: true,
  })

  beforeEach(async () => {
    await FirebaseEmulatedTest.clearFirestoreDB()
    await FirebaseEmulatedTest.seedFirestoreDB('users', [user])
    await FirebaseEmulatedTest.seedFirestoreDB('messages', [message])
    await FirebaseEmulatedTest.seedFirestoreDB('emails')
  })

  afterEach(async () => {
    await FirebaseEmulatedTest.clearFirestoreDB()
  })

  it('Creates emails to the sender and receiver', async () => {
    jest.spyOn(utils, 'isValidMessageRequest').mockResolvedValue(true)
    jest
      .spyOn(utils, 'getUserAndEmail')
      .mockResolvedValue({ toUserEmail: 'jeffery@email', toUser: user })

    await createMessageEmails(message as IMessageDB)
    const countSnapshot = await db.collection(DB_ENDPOINTS.emails).count().get()

    expect(countSnapshot.data().count).toEqual(2)
  })

  it("Doesn't create emails if checks fail", async () => {
    jest.spyOn(utils, 'isValidMessageRequest').mockImplementation(() => {
      throw new Error()
    })
    jest
      .spyOn(utils, 'getUserAndEmail')
      .mockResolvedValue({ toUserEmail: 'jeffery@email', toUser: user })

    await expect(() => {
      createMessageEmails(message as IMessageDB)
    }).rejects

    const countSnapshot = await db.collection(DB_ENDPOINTS.emails).count().get()

    expect(countSnapshot.data().count).toEqual(0)
  })
})
