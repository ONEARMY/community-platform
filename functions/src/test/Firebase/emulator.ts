import 'jest'
import firebaseFunctionsTest from 'firebase-functions-test'
import http from 'http'
import { firebaseAdmin, firebaseApp } from '../../Firebase/admin'
import type { CallableContextOptions } from 'firebase-functions-test/lib/v1'
import type { FeaturesList } from 'firebase-functions-test/lib/features'
import { DB_ENDPOINTS, IDBEndpoint } from '../../models'

/**
 * Utility class for executing a firebase function with a user-provided context.
 * Any calls to firebase services will be executed against a running emulator suite
 *
 * References
 * https://firebase.google.com/docs/functions/unit-testing
 * https://github.com/firebase/firebase-functions-test
 * https://github.com/firebase/functions-samples/tree/main/2nd-gen/test-functions-jest-ts
 */
class FirebaseEmulatedTestClass {
  /** Access to mocking features, such as firestore document snapshot mocks */
  public feature: FeaturesList

  /** Access to firebase to configured admin methods, such as firestore or auth */
  public admin = firebaseAdmin

  constructor() {
    if (process.env.FUNCTIONS_EMULATOR !== 'true') {
      throw new Error('Firebase emulators not detected')
    }
    // Assign the test functions the same project id as emulator
    const { projectId } = firebaseApp.options
    this.feature = firebaseFunctionsTest({ projectId })
  }
  /**
   * Execute a firebase function directly, providing context for any triggered function
   * data or other event context
   *
   * @param firebaseFunction Underlying firebase function to execute
   * @param data Test data to pass to function. This corresponds to first parameter sent to the function
   * @param eventContextOptions Fields of the event context that you'd like to specify. This corresponds
   * to the second parameter sent to the function. As defaults are supplied, only include desired overrides
   *
   * @example
   * ```
   * const myFunction = require('./function-code.ts')
   * await FirebaseEmulatedTest.run(myFunction,{})
   * ```
   */
  public async run(
    firebaseFunction: any,
    data: any,
    eventContextOptions: CallableContextOptions = {},
  ) {
    // Extracting `wrap` out of the lazy-loaded features
    // Passing the firebaseApp will populate variables for emulator (if detected from env)
    const wrappedFirebaseFunction = this.feature.wrap(firebaseFunction)
    // Invoke the firebase function
    return wrappedFirebaseFunction(data, eventContextOptions)
  }

  /** Generate a change snapshot object for use in firestore change-triggered function testing */
  public mockFirestoreChangeObject(
    beforeData: Record<string, any>,
    afterData: Record<string, any>,
    collection: IDBEndpoint,
    docId = 'doc_1',
  ) {
    const docPath = `${DB_ENDPOINTS[collection] || collection}/${docId}`
    const beforeSnap = this.feature.firestore.makeDocumentSnapshot(
      beforeData,
      docPath,
    )
    const afterSnap = this.feature.firestore.makeDocumentSnapshot(
      afterData,
      docPath,
    )
    return this.feature.makeChange(beforeSnap, afterSnap)
  }

  /**
   *
   * @param endpoint reference endpoint for collection. If exists in endpoint mapping will return
   * fully qualified name (e.g. 'users' -> 'v3_users'). If not will populate to raw endpoint
   * @param docs array of documents to populate. If empty will seed endpoint without documents
   * required for emulators to not throw `toQualifiedResourcePath` error for uninitialised endpoint
   */
  public async seedFirestoreDB<T extends { _id: string }>(
    endpoint: IDBEndpoint,
    docs: T[] = [],
  ) {
    const db = this.admin.firestore()

    const collection = db.collection(DB_ENDPOINTS[endpoint] || endpoint)

    // If not docs set still initialise endpoint by seeding a fake doc and then deleting
    if (docs.length === 0) {
      const ref = collection.doc('seed')
      await ref.set({ seed: true })
      await ref.delete()
    }

    const batch = db.batch()
    for (const doc of docs) {
      const ref = collection.doc(doc._id)
      batch.set(ref, doc)
    }

    return batch.commit()
  }

  /**
   * Adaptation of firebase-functions-test method to wipe emulator (appears to pass wrong hostname)
   * https://github.dev/firebase/firebase-functions-test/blob/master/src/providers/firestore.ts#L261
   */
  public clearFirestoreDB() {
    const port = process.env.FIRESTORE_PORT || '4003'
    const { projectId } = firebaseApp.options
    return new Promise((resolve, reject) => {
      const config = {
        method: 'DELETE',
        hostname: '127.0.0.1', // changed from 'localhost'
        port,
        path: `/emulator/v1/projects/${projectId}/databases/(default)/documents`,
      }
      const req = http.request(config, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`statusCode: ${res.statusCode}`))
        }
        res.on('data', () => {})
        res.on('end', resolve)
      })
      req.on('error', (error) => {
        reject(error)
      })
      const postData = JSON.stringify({
        database: `projects/${projectId}/databases/(default)`,
      })
      req.setHeader('Content-Length', postData.length)
      req.write(postData)
      req.end()
    })
  }
}
export const FirebaseEmulatedTest = new FirebaseEmulatedTestClass()
