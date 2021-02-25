import firebase from 'firebase/app'
export { default as firebase } from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/functions'
import 'firebase/database'
import Query = firebase.firestore.Query
import { SEED_DATA, DB_PREFIX } from '../../fixtures/seed'
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
  seedDB = (prefix = DB_PREFIX) => {
    const dbWrites = Object.keys(SEED_DATA).map(key => {
      const endpoint = DB_ENDPOINTS[key]
      return this.addDocuments(`${prefix}${endpoint}`, SEED_DATA[key])
    })
    return Promise.all(dbWrites)
  }

  clearDB = (prefix = DB_PREFIX) => {
    const dbDeletes = Object.keys(SEED_DATA).map(key => {
      const endpoint = DB_ENDPOINTS[key]
      return this.deleteAll(`${prefix}${endpoint}`)
    })
    return Promise.all(dbDeletes)
  }

  queryDocuments = (
    collectionName: string,
    fieldPath: string,
    opStr: any,
    value: string,
    prefix = DB_PREFIX,
  ): Promise<any> | Promise<any[]> => {
    const endpoint = DB_ENDPOINTS[collectionName]
    return db
      .collection(`${prefix}${endpoint}`)
      .where(fieldPath, opStr, value)
      .get()
      .then(snapshot => {
        const result: any[] = []
        if (snapshot.empty) {
          return result
        }
        snapshot.forEach(document => result.push(document.data()))
        if (result.length === 1) {
          return result[0]
        }
        return result
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
