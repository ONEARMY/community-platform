import { FirebaseEmulatedTest } from '../test/Firebase/emulator'
import { DB_ENDPOINTS, IMapPin, IUserDB } from '../models'
import { HOW_TO_APPROVAL_SUBJECT, MAP_PIN_APPROVAL_SUBJECT } from './templates'
import { setMockHowto } from '../emulator/seed/content-generate'
import {
  createHowtoModerationEmail,
  createMapPinModerationEmail,
  handleModerationUpdate,
} from './createModerationEmails'

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

describe('Create howto moderation emails', () => {
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

  it('Creates an email for an accepted howto', async () => {
    const howtoApproved = await setMockHowto({ uid: 'user_1' })
    const howtoAwaitingModeration = {
      ...howtoApproved,
      moderation: 'awaiting-moderation',
    }
    const change = FirebaseEmulatedTest.mockFirestoreChangeObject(
      howtoAwaitingModeration,
      howtoApproved,
      'howtos',
      howtoApproved._id,
    )

    await handleModerationUpdate(change, createHowtoModerationEmail)

    // Only one approved howto email should have been created
    const countSnapshot = await db.collection(DB_ENDPOINTS.emails).count().get()
    expect(countSnapshot.data().count).toEqual(1)

    const querySnapshot = await db.collection(DB_ENDPOINTS.emails).get()
    querySnapshot.forEach((doc) => {
      const {
        message: { html, subject },
        to,
      } = doc.data()
      expect(html).toMatchSnapshot()
      expect(subject).toBe(HOW_TO_APPROVAL_SUBJECT)
      // Check that the email contains the correct user name
      expect(html).toContain('Hey User 1')
      // Check that the email contains the correct howto title
      expect(html).toContain(
        'Huzzah! Your How-To Mock Howto has been approved.',
      )
      // Check that the email contains the correct howto link
      expect(html).toContain(
        'https://community.preciousplastic.com/how-to/00_user_1_howto',
      )
      // Check that the email contains the correct PP signoff
      expect(html).toContain('Charlie your Precious Plastic Community Manager')
      expect(to).toBe('test@test.com')
    })
  })

  // Remove this test once released to all users.
  it('Does not creates email for people who are not beta testers', async () => {
    const howtoApproved = await setMockHowto({ uid: 'user_2' })
    const howtoAwaitingModeration = {
      ...howtoApproved,
      moderation: 'awaiting-moderation',
    }
    const change = FirebaseEmulatedTest.mockFirestoreChangeObject(
      howtoAwaitingModeration,
      howtoApproved,
      'howtos',
      howtoApproved._id,
    )

    await handleModerationUpdate(change, createHowtoModerationEmail)

    // No new emails should have been created
    const countSnapshot = await db.collection(DB_ENDPOINTS.emails).count().get()
    expect(countSnapshot.data().count).toEqual(1)
  })

  it('Does not creates email for non-approved howtos', async () => {
    const howtoApproved = await setMockHowto({ uid: 'user_1' })
    const howtoDraft = {
      ...howtoApproved,
      moderation: 'draft',
    }
    const change = FirebaseEmulatedTest.mockFirestoreChangeObject(
      howtoApproved,
      howtoDraft,
      'howtos',
      howtoApproved._id,
    )

    await handleModerationUpdate(change, createHowtoModerationEmail)

    // No new emails should have been created
    const countSnapshot = await db.collection(DB_ENDPOINTS.emails).count().get()
    expect(countSnapshot.data().count).toEqual(1)
  })
})

describe('Create map pin moderation emails', () => {
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

  it('Creates an email for an accepted map pin', async () => {
    const mapPinApproved = {
      _id: 'map_pin_1',
      _createdBy: 'user_1',
      moderation: 'accepted',
    }
    const mapPinAwaitingModeration = {
      _id: 'map_pin_1',
      _createdBy: 'user_1',
      moderation: 'awaiting-moderation',
    }
    const change = FirebaseEmulatedTest.mockFirestoreChangeObject(
      mapPinAwaitingModeration,
      mapPinApproved,
      'mappins',
      mapPinApproved._id,
    )

    await handleModerationUpdate(change, createMapPinModerationEmail)

    // Only one approved howto email should have been created
    const countSnapshot = await db.collection(DB_ENDPOINTS.emails).count().get()
    expect(countSnapshot.data().count).toEqual(1)

    const querySnapshot = await db.collection(DB_ENDPOINTS.emails).get()
    querySnapshot.forEach((doc) => {
      const {
        message: { html, subject },
        to,
      } = doc.data()
      expect(html).toMatchSnapshot()
      expect(subject).toBe(MAP_PIN_APPROVAL_SUBJECT)
      // Check that the email contains the correct user name
      expect(html).toContain('Hey User 1')
      // Check that the email contains the correct map pin link
      expect(html).toContain(
        'https://community.preciousplastic.com/map#map_pin_1',
      )
      // Check that the email contains the correct PP signoff
      expect(html).toContain('Charlie your Precious Plastic Community Manager')
      expect(to).toBe('test@test.com')
    })
  })

  // Remove this test once released to all users.
  it('Does not creates email for people who are not beta testers', async () => {
    const mapPinApproved = {
      _id: 'map_pin_1',
      _createdBy: 'user_2',
      moderation: 'accepted',
    }
    const mapPinAwaitingModeration = {
      _id: 'map_pin_1',
      _createdBy: 'user_2',
      moderation: 'awaiting-moderation',
    }
    const change = FirebaseEmulatedTest.mockFirestoreChangeObject(
      mapPinAwaitingModeration,
      mapPinApproved,
      'mappins',
      mapPinApproved._id,
    )

    await handleModerationUpdate(change, createMapPinModerationEmail)

    // No new emails should have been created
    const countSnapshot = await db.collection(DB_ENDPOINTS.emails).count().get()
    expect(countSnapshot.data().count).toEqual(1)
  })

  it('Does not creates email for non-approved map pins', async () => {
    const mapPinDraft = {
      _id: 'map_pin_1',
      _createdBy: 'user_1',
      moderation: 'draft',
    }
    const mapPinAwaitingModeration = {
      _id: 'map_pin_1',
      _createdBy: 'user_1',
      moderation: 'awaiting-moderation',
    }
    const change = FirebaseEmulatedTest.mockFirestoreChangeObject(
      mapPinAwaitingModeration,
      mapPinDraft,
      'mappins',
      mapPinDraft._id,
    )

    await handleModerationUpdate(change, createMapPinModerationEmail)

    // No new emails should have been created
    const countSnapshot = await db.collection(DB_ENDPOINTS.emails).count().get()
    expect(countSnapshot.data().count).toEqual(1)
  })
})
