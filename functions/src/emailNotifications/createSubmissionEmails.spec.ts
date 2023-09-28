import { FirebaseEmulatedTest } from '../test/Firebase/emulator'
import { DB_ENDPOINTS, IMapPin, IUserDB } from '../models'
import {
  HOW_TO_SUBMISSION_SUBJECT,
  MAP_PIN_SUBMISSION_SUBJECT,
} from './templates'
import { setMockHowto } from '../emulator/seed/content-generate'
import {
  createHowtoSubmissionEmail,
  createMapPinSubmissionEmail,
} from './createSubmissionEmails'
import { PP_SIGNOFF } from './constants'

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
  } as IUserDB)

describe('Create howto submission emails', () => {
  const db = FirebaseEmulatedTest.admin.firestore()

  beforeAll(async () => {
    await FirebaseEmulatedTest.clearFirestoreDB()
    await FirebaseEmulatedTest.seedFirestoreDB('emails')

    await FirebaseEmulatedTest.seedFirestoreDB('users', [
      userFactory('user_1', {
        displayName: 'User 1',
        userName: 'user_1',
        userRoles: ['beta-tester'],
      }),
      userFactory('user_2', {
        displayName: 'User 2',
        userName: 'user_2',
      }),
    ])

    await FirebaseEmulatedTest.seedFirestoreDB('howtos')
  })

  afterAll(async () => {
    await FirebaseEmulatedTest.clearFirestoreDB()
  })

  it('Creates an email for a submitted howto', async () => {
    const howto = await setMockHowto({ uid: 'user_1' }, 'awaiting-moderation')
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
      expect(html).toMatchSnapshot()
      expect(subject).toBe(HOW_TO_SUBMISSION_SUBJECT)
      // Check that the email contains the correct user name
      expect(html).toContain('Hey User 1')
      // Check that the email contains the correct howto title
      expect(html).toContain(
        `Huzzah! Your How-To Mock Howto has been submitted.`,
      )
      // Check that the email contains the correct PP signoff
      expect(html).toContain(PP_SIGNOFF)
      expect(to).toBe('test@test.com')
    })
  })

  it('Does not create email for draft how tos', async () => {
    const howto = await setMockHowto({ uid: 'user_2' }, 'draft')
    await createHowtoSubmissionEmail(howto)

    // No new emails should have been created
    const countSnapshot = await db.collection(DB_ENDPOINTS.emails).count().get()
    expect(countSnapshot.data().count).toEqual(1)
  })

  // Remove this test once released to all users.
  it('Does not create email for people who are not beta testers', async () => {
    const howto = await setMockHowto({ uid: 'user_2' })
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
        userRoles: ['beta-tester'],
      }),
      userFactory('user_2', {
        displayName: 'User 2',
        userName: 'user_2',
      }),
    ])

    await FirebaseEmulatedTest.seedFirestoreDB('mappins')
  })

  afterAll(async () => {
    await FirebaseEmulatedTest.clearFirestoreDB()
  })

  it('Creates an email for a submitted map pin', async () => {
    const mapPin = {
      _id: 'user_1',
      moderation: 'awaiting-moderation',
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
      expect(html).toMatchSnapshot()
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

  // Remove this test once released to all users.
  it('Does not creates email for people who are not beta testers', async () => {
    const howto = await setMockHowto({ uid: 'user_2' })
    await createHowtoSubmissionEmail(howto)

    // No new emails should have been created
    const countSnapshot = await db.collection(DB_ENDPOINTS.emails).count().get()
    expect(countSnapshot.data().count).toEqual(1)
  })
})
