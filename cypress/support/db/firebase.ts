import firebase from 'firebase/app'
export { default as firebase } from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/functions'
import 'firebase/database'
import { SEED_DATA } from '../../fixtures/seed'
import { DB_ENDPOINTS } from './endpoints'
const fbConfig = {
  apiKey: 'AIzaSyDAxS_7M780mI3_tlwnAvpbaqRsQPlmp64',
  authDomain: 'onearmy-test-ci.firebaseapp.com',
  databaseURL: 'https://onearmy-test-ci.firebaseio.com',
  projectId: 'onearmy-test-ci',
  storageBucket: 'onearmy-test-ci.appspot.com',
}

// ensure the cypress env db prefix is also used with the mapped endpoints

firebase.initializeApp(fbConfig)
const db = firebase.firestore()

class FirestoreTestDB {
  seedDB = () => {
    const dbWrites = Object.keys(SEED_DATA).map(key => {
      const endpoint = DB_ENDPOINTS[key]
      return this.addDocuments(`${endpoint}`, SEED_DATA[key])
    })
    return Promise.all(dbWrites)
  }

  clearDB = () => {
    const dbDeletes = Object.keys(SEED_DATA).map(key => {
      const endpoint = DB_ENDPOINTS[key]
      return this.deleteAll(`${endpoint}`)
    })
    return Promise.all(dbDeletes)
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
            .then(snapshot => {
              resolve(snapshot.docs.map(d => d.data()))
            })
            .catch(err => reject(err))
        })
      })
  }

  private addDocuments = (collectionName: string, docs: any[]) => {
    const batch = db.batch()
    const col = db.collection(collectionName)
    docs.forEach(doc => {
      const ref = col.doc(doc._id)
      batch.set(ref, doc)
    })
    return batch.commit()
  }
  private deleteAll = async (collectionName: string) => {
    const batch = db.batch()
    const col = db.collection(collectionName)
    const docs = (await col.get({ source: 'server' })) || []
    docs.forEach(d => {
      batch.delete(col.doc(d.id))
    })
    return batch.commit()
  }
}
export const Auth = firebase.auth()
export const TestDB = new FirestoreTestDB()
