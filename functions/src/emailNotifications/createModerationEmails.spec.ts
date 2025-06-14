import { IModerationStatus } from 'oa-shared'

import { DB_ENDPOINTS } from '../models'
import { FirebaseEmulatedTest } from '../test/Firebase/emulator'
import { PP_SIGNOFF } from './constants'
import {
  createMapPinModerationEmail,
  handleModerationUpdate,
} from './createModerationEmails'
import {
  MAP_PIN_APPROVAL_SUBJECT,
  MAP_PIN_NEEDS_IMPROVEMENTS_SUBJECT,
  MAP_PIN_REJECTED_SUBJECT,
  MAP_PIN_SUBMISSION_SUBJECT,
} from './templateHelpers'

import type { IUserDB } from 'oa-shared/models/user'

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

describe('Create map pin moderation emails', () => {
  const db = FirebaseEmulatedTest.admin.firestore()

  beforeEach(async () => {
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

  it('Creates an email for an accepted map pin', async () => {
    const mapPinApproved = {
      _id: 'user_1',
      moderation: IModerationStatus.ACCEPTED,
    }
    const mapPinAwaitingModeration = {
      _id: 'user_1',
      moderation: IModerationStatus.AWAITING_MODERATION,
    }
    const change = FirebaseEmulatedTest.mockFirestoreChangeObject(
      mapPinAwaitingModeration,
      mapPinApproved,
      'mappins',
      mapPinApproved._id,
    )

    await handleModerationUpdate(change, createMapPinModerationEmail)

    // Only one approved map pin email should have been created
    const countSnapshot = await db.collection(DB_ENDPOINTS.emails).count().get()
    expect(countSnapshot.data().count).toEqual(1)

    const querySnapshot = await db.collection(DB_ENDPOINTS.emails).get()
    querySnapshot.forEach((doc) => {
      const {
        message: { html, subject },
        to,
      } = doc.data()
      expect(subject).toBe(MAP_PIN_APPROVAL_SUBJECT)
      // Check that the email contains the correct user name
      expect(html).toContain('Hey User 1')
      // Check that the email contains the correct map pin link
      expect(html).toContain(
        `https://community.preciousplastic.com/map#${mapPinApproved._id}`,
      )
      // Check that the email contains the correct PP signoff
      expect(html).toContain(PP_SIGNOFF)
      expect(to).toBe('test@test.com')
    })
  })

  it('Creates an email for a map pin awaiting moderation', async () => {
    const mapPinRejected = {
      _id: 'user_1',
      moderation: IModerationStatus.REJECTED,
    }
    const mapPinAwaitingModeration = {
      _id: 'user_1',
      moderation: IModerationStatus.AWAITING_MODERATION,
    }
    const change = FirebaseEmulatedTest.mockFirestoreChangeObject(
      mapPinRejected,
      mapPinAwaitingModeration,
      'mappins',
      mapPinAwaitingModeration._id,
    )

    await handleModerationUpdate(change, createMapPinModerationEmail)

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

  it('Creates an email for a rejected map pin', async () => {
    const mapPinAwaitingModeration = {
      _id: 'user_1',
      moderation: IModerationStatus.AWAITING_MODERATION,
    }
    const mapPinRejected = {
      _id: 'user_1',
      moderation: IModerationStatus.REJECTED,
    }
    const change = FirebaseEmulatedTest.mockFirestoreChangeObject(
      mapPinAwaitingModeration,
      mapPinRejected,
      'mappins',
      mapPinRejected._id,
    )

    await handleModerationUpdate(change, createMapPinModerationEmail)

    // Only one rejected map pin email should have been created
    const countSnapshot = await db.collection(DB_ENDPOINTS.emails).count().get()
    expect(countSnapshot.data().count).toEqual(1)

    const querySnapshot = await db.collection(DB_ENDPOINTS.emails).get()
    querySnapshot.forEach((doc) => {
      const {
        message: { html, subject },
        to,
      } = doc.data()
      expect(subject).toBe(MAP_PIN_REJECTED_SUBJECT)
      // Check that the email contains the correct user name
      expect(html).toContain('Hey User 1')
      expect(html).toContain(
        'Thank you for applying to be on the Precious Plastic Map.',
      )
      // Check that the email contains the correct guidelines link
      expect(html).toContain(
        `https://community.preciousplastic.com/academy/guides/platform`,
      )
      // Check that the email contains the correct PP signoff
      expect(html).toContain(PP_SIGNOFF)
      expect(to).toBe('test@test.com')
    })
  })

  it('Creates an email for a needs improvements map pin', async () => {
    const mapPinAwaitingModeration = {
      _id: 'user_1',
      moderation: IModerationStatus.AWAITING_MODERATION,
    }
    const MOCK_MAP_PIN_MODERATION_COMMENT = 'Mock map pin moderation comment'
    const mapPinNeedsImprovements = {
      _id: 'user_1',
      moderation: IModerationStatus.IMPROVEMENTS_NEEDED,
      comments: MOCK_MAP_PIN_MODERATION_COMMENT,
    }
    const change = FirebaseEmulatedTest.mockFirestoreChangeObject(
      mapPinAwaitingModeration,
      mapPinNeedsImprovements,
      'mappins',
      mapPinNeedsImprovements._id,
    )

    await handleModerationUpdate(change, createMapPinModerationEmail)

    // Only one needs improvements map pin email should have been created
    const countSnapshot = await db.collection(DB_ENDPOINTS.emails).count().get()
    expect(countSnapshot.data().count).toEqual(1)

    const querySnapshot = await db.collection(DB_ENDPOINTS.emails).get()
    querySnapshot.forEach((doc) => {
      const {
        message: { html, subject },
        to,
      } = doc.data()
      expect(subject).toBe(MAP_PIN_NEEDS_IMPROVEMENTS_SUBJECT)
      // Check that the email contains the correct user name
      expect(html).toContain('Hey User 1')
      expect(html).toContain(
        "We're really happy to see you on the Precious Plastic Map",
      )
      // Check that the email contains the correct guidelines link
      expect(html).toContain(
        `https://community.preciousplastic.com/academy/guides/platform`,
      )
      expect(html).toContain(MOCK_MAP_PIN_MODERATION_COMMENT)
      // Check that the email contains the correct PP signoff
      expect(html).toContain(PP_SIGNOFF)
      expect(to).toBe('test@test.com')
    })
  })

  it('Does not create an email for non-approved map pins', async () => {
    const mapPinDraft = {
      _id: 'user_1',
      moderation: IModerationStatus.DRAFT,
    }
    const mapPinAwaitingModeration = {
      _id: 'user_1',
      moderation: IModerationStatus.AWAITING_MODERATION,
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
    expect(countSnapshot.data().count).toEqual(0)
  })
})
