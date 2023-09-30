import { FirebaseEmulatedTest } from '../test/Firebase/emulator'
import { DB_ENDPOINTS } from 'oa-shared'
const fbTest = require('firebase-functions-test')()
const fun = require('./verifiedBadgeEmails')

jest.mock('../Firebase/auth', () => ({
  firebaseAuth: {
    getUser: () => ({
      email: 'test@test.com',
    }),
  },
}))

describe('verifiedBadgeEmails', () => {
  beforeEach(FirebaseEmulatedTest.clearFirestoreDB)

  afterAll(FirebaseEmulatedTest.clearFirestoreDB)

  it('should not send an email if verified badge status unchanged', async () => {
    const db = FirebaseEmulatedTest.admin.firestore()
    const wrapped = fbTest.wrap(fun.handleUserVerifiedBadgeUpdate)

    await wrapped(
      fbTest.makeChange(
        fbTest.firestore.makeDocumentSnapshot(
          {
            displayName: 'fake-username',
            badges: {
              verified: true,
            },
          },
          'v3_users/123',
        ),
        fbTest.firestore.makeDocumentSnapshot(
          {
            displayName: 'fake-username',
            badges: {
              verified: true,
            },
          },
          'v3_users/123',
        ),
      ),
    )

    const countSnapshot = await db.collection(DB_ENDPOINTS.emails).count().get()
    expect(countSnapshot.data().count).toEqual(0)
  })

  it('should send an email to the user if a badge has been changed from false to true', async () => {
    const db = FirebaseEmulatedTest.admin.firestore()
    const wrapped = fbTest.wrap(fun.handleUserVerifiedBadgeUpdate)

    await wrapped(
      fbTest.makeChange(
        fbTest.firestore.makeDocumentSnapshot(
          {
            displayName: 'fake-username',
            badges: {
              verified: false,
            },
          },
          'v3_users/123',
        ),
        fbTest.firestore.makeDocumentSnapshot(
          {
            displayName: 'fake-username',
            badges: {
              verified: true,
            },
          },
          'v3_users/123',
        ),
      ),
    )

    const countSnapshot = await db.collection(DB_ENDPOINTS.emails).count().get()
    expect(countSnapshot.data().count).toEqual(1)

    const querySnapshot = await db.collection(DB_ENDPOINTS.emails).get()
    querySnapshot.forEach((doc) => {
      const {
        message: { html, subject },
        to,
      } = doc.data()

      expect(subject).toBe(
        `fake-username - You are now part of the Verified Workspaces :)`,
      )
      expect(to).toBe('test@test.com')
      expect(html).toContain(`Hey fake-username`)
      expect(html).toContain(`We are glad to have you in our Verified program`)

      expect(html).toContain('<!DOCTYPE html')
    })
  })

  it('should send an email to the user if a badge has been added', async () => {
    const db = FirebaseEmulatedTest.admin.firestore()
    const wrapped = fbTest.wrap(fun.handleUserVerifiedBadgeUpdate)

    await wrapped(
      fbTest.makeChange(
        fbTest.firestore.makeDocumentSnapshot(
          {
            displayName: 'fake-username',
            badges: {},
          },
          'v3_users/123',
        ),
        fbTest.firestore.makeDocumentSnapshot(
          {
            displayName: 'fake-username',
            badges: {
              verified: true,
            },
          },
          'v3_users/123',
        ),
      ),
    )

    const countSnapshot = await db.collection(DB_ENDPOINTS.emails).count().get()
    expect(countSnapshot.data().count).toEqual(1)

    const querySnapshot = await db.collection(DB_ENDPOINTS.emails).get()
    querySnapshot.forEach((doc) => {
      const {
        message: { html, subject },
        to,
      } = doc.data()

      expect(subject).toBe(
        `fake-username - You are now part of the Verified Workspaces :)`,
      )
      expect(to).toBe('test@test.com')
      expect(html).toContain(`Hey fake-username`)
      expect(html).toContain(`We are glad to have you in our Verified program`)

      expect(html).toContain('<!DOCTYPE html')
    })
  })
})
