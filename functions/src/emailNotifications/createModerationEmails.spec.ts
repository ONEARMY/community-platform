import { FirebaseEmulatedTest } from '../test/Firebase/emulator'
import { DB_ENDPOINTS } from '../models'
import {
  HOW_TO_APPROVAL_SUBJECT,
  HOW_TO_NEEDS_IMPROVEMENTS_SUBJECT,
  HOW_TO_REJECTED_SUBJECT,
  HOW_TO_SUBMISSION_SUBJECT,
  MAP_PIN_APPROVAL_SUBJECT,
  MAP_PIN_NEEDS_IMPROVEMENTS_SUBJECT,
  MAP_PIN_REJECTED_SUBJECT,
  MAP_PIN_SUBMISSION_SUBJECT,
} from './templateHelpers'
import { getMockHowto } from '../emulator/seed/content-generate'
import {
  createHowtoModerationEmail,
  createMapPinModerationEmail,
  handleModerationUpdate,
} from './createModerationEmails'
import { PP_SIGNOFF } from './constants'
import { IUserDB } from 'oa-shared/models/user'
import { IModerationStatus } from 'oa-shared'

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

describe('Create howto moderation emails', () => {
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

  it('Creates an email for an accepted howto', async () => {
    const howtoApproved = getMockHowto('user_1')
    const howtoAwaitingModeration = {
      ...howtoApproved,
      moderation: IModerationStatus.AWAITING_MODERATION,
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
      expect(subject).toBe(HOW_TO_APPROVAL_SUBJECT)
      // Check that the email contains the correct user name
      expect(html).toContain('Hey User 1')
      // Check that the email contains the correct howto title
      expect(html).toContain('Mock Howto')
      // Check that the email contains the correct howto link
      expect(html).toContain(
        'https://community.preciousplastic.com/how-to/00_user_1_howto',
      )
      // Check that the email contains the correct PP signoff
      expect(html).toContain(PP_SIGNOFF)
      expect(to).toBe('test@test.com')
    })
  })

  it('Creates an email for a howto awaiting moderation', async () => {
    const howtoRejected = getMockHowto('user_1', IModerationStatus.REJECTED)
    const howtoAwaitingModeration = {
      ...howtoRejected,
      moderation: IModerationStatus.AWAITING_MODERATION,
    }
    const change = FirebaseEmulatedTest.mockFirestoreChangeObject(
      howtoRejected,
      howtoAwaitingModeration,
      'howtos',
      howtoAwaitingModeration._id,
    )

    await handleModerationUpdate(change, createHowtoModerationEmail)

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
      // Check that the email contains the correct howto link
      expect(html).toContain(
        'https://community.preciousplastic.com/how-to/00_user_1_howto',
      )
      // Check that the email contains the correct PP signoff
      expect(html).toContain(PP_SIGNOFF)
      expect(to).toBe('test@test.com')
    })
  })

  it('Creates an email for a rejected howto', async () => {
    const howtoAwaitingModeration = getMockHowto(
      'user_1',
      IModerationStatus.AWAITING_MODERATION,
    )
    const howtoRejected = {
      ...howtoAwaitingModeration,
      moderation: IModerationStatus.REJECTED,
    }
    const change = FirebaseEmulatedTest.mockFirestoreChangeObject(
      howtoAwaitingModeration,
      howtoRejected,
      'howtos',
      howtoAwaitingModeration._id,
    )

    await handleModerationUpdate(change, createHowtoModerationEmail)

    // Only one rejected howto email should have been created
    const countSnapshot = await db.collection(DB_ENDPOINTS.emails).count().get()
    expect(countSnapshot.data().count).toEqual(1)

    const querySnapshot = await db.collection(DB_ENDPOINTS.emails).get()
    querySnapshot.forEach((doc) => {
      const {
        message: { html, subject },
        to,
      } = doc.data()
      expect(subject).toBe(HOW_TO_REJECTED_SUBJECT)
      // Check that the email contains the correct user name
      expect(html).toContain('Hey User 1')
      // Check that the email contains the correct howto title
      expect(html).toContain(`Mock Howto`)
      expect(html).toContain(
        'However, after reviewing your submission, we feel that',
      )
      // Check that the email contains the correct howto link
      expect(html).toContain(
        'https://community.preciousplastic.com/how-to/00_user_1_howto',
      )
      // Check that the email contains the correct PP signoff
      expect(html).toContain(PP_SIGNOFF)
      expect(to).toBe('test@test.com')
    })
  })

  it('Creates an email for a howto that needs improvements', async () => {
    const howtoAwaitingModeration = getMockHowto(
      'user_1',
      IModerationStatus.AWAITING_MODERATION,
    )
    const MOCK_HOW_TO_MODERATION_COMMENT = 'Mock how to moderation comment'
    const howtoNeedsImprovements = {
      ...howtoAwaitingModeration,
      moderation: IModerationStatus.IMPROVEMENTS_NEEDED,
      moderatorFeedback: MOCK_HOW_TO_MODERATION_COMMENT,
    }
    const change = FirebaseEmulatedTest.mockFirestoreChangeObject(
      howtoAwaitingModeration,
      howtoNeedsImprovements,
      'howtos',
      howtoAwaitingModeration._id,
    )

    await handleModerationUpdate(change, createHowtoModerationEmail)

    // Only one needs improvements howto email should have been created
    const countSnapshot = await db.collection(DB_ENDPOINTS.emails).count().get()
    expect(countSnapshot.data().count).toEqual(1)

    const querySnapshot = await db.collection(DB_ENDPOINTS.emails).get()
    querySnapshot.forEach((doc) => {
      const {
        message: { html, subject },
        to,
      } = doc.data()
      expect(subject).toBe(HOW_TO_NEEDS_IMPROVEMENTS_SUBJECT)
      // Check that the email contains the correct user name
      expect(html).toContain('Hey User 1')
      // Check that the email contains the correct howto title
      expect(html).toContain('Mock Howto')
      // Check that the email contains the correct howto link
      expect(html).toContain(
        'https://community.preciousplastic.com/how-to/00_user_1_howto',
      )
      // Check that the email contains the correct howto guidelines link
      expect(html).toContain(
        'https://community.preciousplastic.com/academy/create/howto',
      )
      expect(html).toContain(MOCK_HOW_TO_MODERATION_COMMENT)
      // Check that the email contains the correct PP signoff
      expect(html).toContain(PP_SIGNOFF)
      expect(to).toBe('test@test.com')
    })
  })

  it('Does not create an email for non-approved howtos', async () => {
    const howtoApproved = getMockHowto('user_1')
    const howtoDraft = {
      ...howtoApproved,
      moderation: IModerationStatus.DRAFT,
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
    expect(countSnapshot.data().count).toEqual(0)
  })
})

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
        `https://drive.google.com/file/d/1fXTtBbzgCO0EL6G9__aixwqc-Euqgqnd/view`,
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
      moderatorFeedback: MOCK_MAP_PIN_MODERATION_COMMENT,
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
        `https://drive.google.com/file/d/1fXTtBbzgCO0EL6G9__aixwqc-Euqgqnd/view`,
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
