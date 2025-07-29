import { IModerationStatus } from 'oa-shared'

import { DB_ENDPOINTS } from '../models'
import { FirebaseEmulatedTest } from '../test/Firebase/emulator'
import { PP_SIGNOFF } from './constants'
import { createMapPinSubmissionEmail } from './createSubmissionEmails'
import { MAP_PIN_SUBMISSION_SUBJECT } from './templateHelpers'

import type { IMapPin } from 'oa-shared/models/maps'
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
