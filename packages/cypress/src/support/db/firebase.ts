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

  addDocument = (collectionName: string, data: any): Cypress.Chainable => {
    const endpoint = DB_ENDPOINTS[collectionName]
    return cy.wrap(`adding to: ${collectionName} WITH ${data}`).then(() => {
      return new Cypress.Promise((resolve, reject) => {
        db.collection(`${endpoint}`)
          .add(data)
          .then((response) => {
            resolve(response)
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
