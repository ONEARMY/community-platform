import { FirebaseEmulatedTest } from '../test/Firebase/emulator'
import { DB_ENDPOINTS } from 'oa-shared'
const fbTest = require('firebase-functions-test')()
const fun = require('./supporterBadgeEmails')

jest.mock('../Firebase/auth', () => ({
  firebaseAuth: {
    getUser: () => ({
      email: 'test@test.com',
    }),
  },
}))

describe('supporterBadgeEmails', () => {
  beforeEach(FirebaseEmulatedTest.clearFirestoreDB)

  afterAll(FirebaseEmulatedTest.clearFirestoreDB)

  it('should not send an email if supporter badge status unchanged', async () => {
    const db = FirebaseEmulatedTest.admin.firestore()
    const wrapped = fbTest.wrap(fun.handleUserSupporterBadgeUpdate)

    await wrapped(
      fbTest.makeChange(
        fbTest.firestore.makeDocumentSnapshot(
          {
            displayName: 'fake-username',
            badges: {
              supporter: true,
            },
          },
          'v3_users/123',
        ),
        fbTest.firestore.makeDocumentSnapshot(
          {
            displayName: 'fake-username',
            badges: {
              supporter: true,
            },
          },
          'v3_users/123',
        ),
      ),
    )

    const countSnapshot = await db.collection(DB_ENDPOINTS.emails).count().get()
    expect(countSnapshot.data().count).toEqual(0)
  })

  it('should send an email to the user if a badge has been added', async () => {
    const db = FirebaseEmulatedTest.admin.firestore()
    const wrapped = fbTest.wrap(fun.handleUserSupporterBadgeUpdate)

    await wrapped(
      fbTest.makeChange(
        fbTest.firestore.makeDocumentSnapshot(
          {
            displayName: 'fake-username',
            badges: {
              supporter: false,
            },
          },
          'v3_users/123',
        ),
        fbTest.firestore.makeDocumentSnapshot(
          {
            displayName: 'fake-username',
            badges: {
              supporter: true,
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
        `fake-username - Your Precious Plastic Supporter Badge!`,
      )
      expect(to).toBe('test@test.com')
      expect(html).toContain(`Hey fake-username`)
      expect(html).toContain(
        `Thank you for becoming a Precious Plastic Patreon`,
      )

      expect(html).toContain('<!DOCTYPE html')
    })
  })

  it('should send an email to the user if a badge has been removed', async () => {
    const db = FirebaseEmulatedTest.admin.firestore()
    const wrapped = fbTest.wrap(fun.handleUserSupporterBadgeUpdate)

    await wrapped(
      fbTest.makeChange(
        fbTest.firestore.makeDocumentSnapshot(
          {
            displayName: 'fake-username',
            badges: {
              supporter: true,
            },
          },
          'v3_users/123',
        ),
        fbTest.firestore.makeDocumentSnapshot(
          {
            displayName: 'fake-username',
            badges: {
              supporter: false,
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
        `Precious Plastic Supporter - We are sad to see you go.`,
      )
      expect(to).toBe('test@test.com')
      expect(html).toContain(`Hey fake-username`)
      expect(html).toContain('We are sad to see you go!')

      expect(html).toContain('<!DOCTYPE html')
    })
  })
})
