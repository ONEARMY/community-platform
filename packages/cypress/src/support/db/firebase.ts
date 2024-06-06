import firebase from 'firebase/compat/app'

export { default as firebase } from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'
import 'firebase/compat/functions'
import 'firebase/compat/database'

import { DB_ENDPOINTS } from 'oa-shared/models'

import { MOCK_DATA } from '../../data/index'

const fbConfig = {
  apiKey: 'AIzaSyDAxS_7M780mI3_tlwnAvpbaqRsQPlmp64',
  authDomain: 'onearmy-test-ci.firebaseapp.com',
  databaseURL: 'https://onearmy-test-ci.firebaseio.com',
  projectId: 'onearmy-test-ci',
  storageBucket: 'onearmy-test-ci.appspot.com',
}

firebase.initializeApp(fbConfig)
const db = firebase.firestore()
// db.useEmulator('localhost', 8080)

class FirestoreTestDB {
  seedDB = async () => {
    const endpoints = ensureDBPrefixes(DB_ENDPOINTS, true)
    const dbWrites = Object.keys(MOCK_DATA).map(async (key) => {
      const endpoint = endpoints[key]
      await this.addDocuments(endpoint, Object.values(MOCK_DATA[key]))
      return [endpoint, MOCK_DATA[key]]
    })
    return Promise.all(dbWrites)
  }

  clearDB = async () => {
    const endpoints = ensureDBPrefixes(DB_ENDPOINTS, true)
    const dbDeletes = Object.values(endpoints).map((endpoint) => {
      return this.deleteAll(endpoint)
    })
    return Promise.all(dbDeletes)
  }

  queryDocuments = (
    collectionName: string,
    fieldPath: string,
    opStr: any,
    value: string,
  ): Cypress.Chainable => {
    const endpoints = ensureDBPrefixes(DB_ENDPOINTS, false)
    const endpoint = endpoints[collectionName]
    return cy
      .wrap(`query: ${endpoint} WHERE ${fieldPath}${opStr}${value}`)
      .then(() => {
        return new Cypress.Promise((resolve, reject) => {
          db.collection(`${endpoint}`)
            .where(fieldPath, opStr, value)
            .get()
            .then((snapshot) => {
              resolve(snapshot.docs.map((d) => d.data()))
            })
            .catch((err) => reject(err))
        })
      })
  }

  private addDocuments = async (collectionName: string, docs: any[]) => {
    const batch = db.batch()
    const col = db.collection(collectionName)
    docs.forEach((doc) => {
      const ref = col.doc(doc._id)
      batch.set(ref, doc)
    })
    return batch.commit()
  }
  private deleteAll = async (collectionName: string) => {
    const batch = db.batch()
    const col = db.collection(collectionName)
    const docs = (await col.get()) || []
    docs.forEach((d) => {
      batch.delete(col.doc(d.id))
    })
    return batch.commit()
  }
}
export const Auth = firebase.auth()
export const TestDB = new FirestoreTestDB()

/**
 * During initialisation the endpoints imported from endpoints.ts might be populated before the
 * prefix is stored in localstorage. This function ensures they start with the correct prefix
 */
function ensureDBPrefixes(endpoints: { [key: string]: string }, seed: boolean) {
  const prefix = seed ? process.env.DB_PREFIX : Cypress.env('DB_PREFIX')
  Object.entries(endpoints).forEach(([key, value]) => {
    if (!value.startsWith(prefix)) {
      // The regex here is intended to remove collectionPrefix
      endpoints[key] = `${prefix}${value.replace(/^[A-Za-z0-9]{5}_/, '')}`
    }
  })
  return endpoints
}
