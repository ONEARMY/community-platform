require('dotenv').config()
import * as testing from '@firebase/rules-unit-testing'
import { readFileSync } from 'fs'
import { setLogLevel, doc, getDoc, setDoc } from 'firebase/firestore'

const { initializeTestEnvironment, assertFails, assertSucceeds } = testing
const rules = readFileSync('../../firestore.rules', { encoding: 'utf-8' })

describe('community platform', () => {
  let testEnv
  beforeAll(async () => {
    // Silence expected rules rejections from Firestore SDK. Unexpected rejections
    // will still bubble up and will be thrown as an error (failing the tests).
    setLogLevel('error')

    testEnv = await initializeTestEnvironment({
      projectId: process.env.PROJECT_ID,
      firestore: { rules },
    })
  })

  afterAll(async () => {
    if (testEnv) await testEnv.cleanup()
  })

  beforeEach(async () => {
    await testEnv.clearFirestore()
  })

  describe('emails', () => {
    it('allows READ by all visitors', async () => {
      const unauthedDb = testEnv.unauthenticatedContext().firestore()

      await assertSucceeds(getDoc(doc(unauthedDb, 'emails/bar')))
    })

    it('does not allow WRITE', async () => {
      const unauthedDb = testEnv.unauthenticatedContext().firestore()

      await assertFails(
        setDoc(doc(unauthedDb, 'emails/bar'), {
          email: '',
        }),
      )
    })
  })
})
