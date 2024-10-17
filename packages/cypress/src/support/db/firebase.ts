import firebase from 'firebase/compat/app'

export { default as firebase } from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'
import 'firebase/compat/functions'
import 'firebase/compat/database'

import { indexedDBLocalPersistence, initializeAuth } from 'firebase/auth'
import { DB_ENDPOINTS } from 'oa-shared/models'

// import { MOCK_DATA } from '../../data'

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
  // seedDB = async () => {
  //   const dbWrites = Object.keys(MOCK_DATA).map(async (key) => {
  //     const endpoint = DB_ENDPOINTS[key]
  //     await this.deleteAll(endpoint)
  //     await this.addDocuments(endpoint, Object.values(MOCK_DATA[key]))
  //     return [endpoint, MOCK_DATA[key]]
  //   })
  //   return Promise.all(dbWrites)
  // }

  private deleteAll = async (collectionName: string) => {
    cy.log(`DB Delete: ${collectionName}`)
    const batch = db.batch()
    const col = db.collection(collectionName)
    const docs = (await col.get()) || []
    docs.forEach((d) => {
      batch.delete(col.doc(d.id))
    })
    return batch.commit()
  }

  private addDocuments = async (collectionName: string, docs: any[]) => {
    cy.log(`DB Seed: ${collectionName}`)
    const batch = db.batch()
    const col = db.collection(collectionName)
    docs.forEach((doc) => {
      const ref = col.doc(doc._id)
      batch.set(ref, doc)
    })
    return batch.commit()
  }

  queryDocuments = (
    collectionName: string,
    fieldPath: string,
    opStr: any,
    value: string,
  ): Cypress.Chainable => {
    const endpoint = DB_ENDPOINTS[collectionName]
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
}
export const Auth = initializeAuth(firebase.app(), {
  persistence: indexedDBLocalPersistence,
})
export const TestDB = new FirestoreTestDB()
