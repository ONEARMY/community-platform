require('dotenv').config()

import * as testing from '@firebase/rules-unit-testing'
import { doc, getDoc, setDoc, setLogLevel } from 'firebase/firestore'
import { readFileSync } from 'fs'

const { initializeTestEnvironment, assertFails, assertSucceeds } = testing
const rules = readFileSync('../../firestore.rules', { encoding: 'utf-8' })

describe('community platform', () => {
  let testEnv
  let unauthedDb, authedFoo
  beforeAll(async () => {
    // Silence expected rules rejections from Firestore SDK. Unexpected rejections
    // will still bubble up and will be thrown as an error (failing the tests).
    setLogLevel('error')

    testEnv = await initializeTestEnvironment({
      projectId: process.env.PROJECT_ID,
      firestore: { rules },
    })

    unauthedDb = testEnv.unauthenticatedContext().firestore()
    authedFoo = testEnv.authenticatedContext('foo').firestore()
  })

  afterAll(async () => {
    if (testEnv) await testEnv.cleanup()
  })

  describe('emails', () => {
    it('allows READ by all visitors', async () => {
      await assertSucceeds(getDoc(doc(unauthedDb, 'emails/bar')))
    })

    it('does not allow WRITE', async () => {
      await assertFails(
        setDoc(doc(unauthedDb, 'emails/bar'), {
          email: '',
        }),
      )
    })
  })

  describe('user_integrations', () => {
    beforeAll(async () => {
      // Set a doc for the authed user.
      await authedFoo.collection('user_integrations').doc('foo').set({
        integration: 'integration',
      })
    })

    it('does not allow READ for unauthed visitors', async () => {
      await assertFails(getDoc(doc(unauthedDb, 'user_integrations/foo')))
    })

    it('does not allow WRITE for unauthed visitors', async () => {
      await assertFails(
        setDoc(doc(unauthedDb, 'user_integrations/foo'), {
          newIntegration: 'newIntegration',
        }),
      )
    })

    it('does not allow READ for resources not belonging to the visitors', async () => {
      await assertFails(getDoc(doc(authedFoo, 'user_integrations/bar')))
    })

    it('does not allow WRITE for resources not belonging to the visitors', async () => {
      await assertFails(
        setDoc(doc(authedFoo, 'user_integrations/bar'), {
          integration: 'integration',
        }),
      )
    })

    it('allows READ for resources belonging to the visitor', async () => {
      await assertSucceeds(getDoc(doc(authedFoo, 'user_integrations/foo')))
    })

    it('allows WRITE for resources belonging to the visitor', async () => {
      await assertSucceeds(
        setDoc(doc(authedFoo, 'user_integrations/foo'), {
          newIntegration: 'newIntegration',
        }),
      )
    })
  })
})
