import firebase from 'firebase/app'
export { default as firebase } from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/functions'
import 'firebase/database'
import Query = firebase.firestore.Query
import { generatedId } from '../../utils/test-utils'
import { SEED_DATA } from '../../fixtures/seed'
const fbConfig = {
  apiKey: 'AIzaSyDAxS_7M780mI3_tlwnAvpbaqRsQPlmp64',
  authDomain: 'onearmy-test-ci.firebaseapp.com',
  databaseURL: 'https://onearmy-test-ci.firebaseio.com',
  projectId: 'onearmy-test-ci',
  storageBucket: 'onearmy-test-ci.appspot.com',
}
firebase.initializeApp(fbConfig)
const db = firebase.firestore()
type PromiseCallback = (val?: any) => void

const MAX_BATCH_SIZE = 500
// TODO - let custom prefix be generated and shared with
// platform to allow better parallel testing
// const prefix = generatedId(5)
const prefix = 'v3_'

class FirestoreDB {
  seedDB = () => {
    const dbWrites = Object.keys(SEED_DATA).map(key => {
      return this.addDocuments(key, SEED_DATA[key])
    })
    return Promise.all(dbWrites)
  }

  clearDB = () => {
    const dbDeletes = Object.keys(SEED_DATA).map(key => {
      return this.deleteAll(key)
    })
    return Promise.all(dbDeletes)
  }

  queryDocuments = (
    collectionName: string,
    fieldPath: string,
    opStr: any,
    value: string,
  ): Promise<any> | Promise<any[]> => {
    return db
      .collection(`${prefix}${collectionName}`)
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
  addDocuments = (collectionName: string, docs: any[]) => {
    const batch = db.batch()
    const col = db.collection(`${prefix}${collectionName}`)
    docs.forEach(doc => {
      const ref = col.doc(doc._id)
      batch.set(ref, doc)
    })
    return batch.commit()
  }
  deleteAll = async (collectionName: string) => {
    const batch = db.batch()
    const col = db.collection(`${prefix}${collectionName}`)
    const docs = await col.get()
    docs.forEach(d => {
      batch.delete(col.doc(d.id))
    })
    return batch.commit()
  }

  deleteDocuments = (
    collectionName: string,
    fieldPath: string,
    opStr: any,
    value: string,
  ) => {
    const query = db
      .collection(`${prefix}${collectionName}`)
      .where(fieldPath, opStr, value)
      .limit(MAX_BATCH_SIZE)
    return new Promise((resolve, reject) => {
      this.deleteQueryBatch(query, MAX_BATCH_SIZE, resolve, reject)
    })
  }
  deleteQueryBatch = (
    query: Query,
    batchSize: number,
    resolve: PromiseCallback,
    reject: PromiseCallback,
  ) => {
    query
      .get()
      .then(snapshot => {
        // When there are no documents left, we are done
        if (snapshot.size === 0) {
          return 0
        }

        // Delete documents in a batch
        const batch = db.batch()
        snapshot.docs.forEach(document => {
          batch.delete(document.ref)
        })

        return batch.commit().then(() => {
          return snapshot.size
        })
      })
      .then(numDeleted => {
        if (numDeleted === 0) {
          resolve()
          return
        }

        process.nextTick(() => {
          this.deleteQueryBatch(query, batchSize, resolve, reject)
        })
      })
      .catch(reject)
  }

  updateDocument = (collectionName: string, docId: string, docData: any) => {
    return db
      .collection(`${prefix}${collectionName}`)
      .doc(docId)
      .set(docData)
  }
}
export const Auth = firebase.auth()
export const Firestore = new FirestoreDB()
