import { IDBEndpoint, DBDoc } from 'src/models/common.models'
import { firestore } from 'src/utils/firebase'
import { DBQueryOptions, AbstractDBClient } from '../types'
import { Observable, Observer } from 'rxjs'
import { DB_QUERY_DEFAULTS } from '../utils/db.utils'

const db = firestore

export class FirestoreClient implements AbstractDBClient {
  /************************************************************************
   *  Main Methods - taken from abstract class
   ***********************************************************************/
  async getDoc<T>(endpoint: IDBEndpoint, docId: string) {
    const doc = await db
      .collection(endpoint)
      .doc(docId)
      .get()
    return doc.exists ? (doc.data() as T & DBDoc) : undefined
  }

  async setDoc(endpoint: IDBEndpoint, doc: DBDoc) {
    return db.doc(`${endpoint}/${doc._id}`).set(doc)
  }

  async setBulkDocs(endpoint: IDBEndpoint, docs: DBDoc[]) {
    const batch = db.batch()
    docs.forEach(d => {
      const ref = db.collection(endpoint).doc(d._id)
      batch.set(ref, d)
    })
  }

  // get a collection with optional value to query _modified field
  async getCollection<T>(endpoint: IDBEndpoint) {
    const snapshot = await db.collection(endpoint).get()
    return snapshot.empty ? [] : snapshot.docs.map(d => d.data() as T & DBDoc)
  }

  async queryCollection<T>(endpoint: IDBEndpoint, queryOpts: DBQueryOptions) {
    const ref = this._generateQueryRef(endpoint, queryOpts)
    const data = await ref.get()
    return data.empty ? [] : data.docs.map(doc => doc.data() as T)
  }
  deleteDoc(endpoint: IDBEndpoint, docId: string) {
    return db
      .collection(endpoint)
      .doc(docId)
      .delete()
  }

  /************************************************************************
   *  Additional Methods - specific only to firestore
   ***********************************************************************/

  streamCollection<T>(endpoint: IDBEndpoint, queryOpts: DBQueryOptions) {
    const ref = this._generateQueryRef(endpoint, queryOpts)
    const observer: Observable<T[]> = Observable.create(
      async (obs: Observer<T[]>) => {
        ref.onSnapshot(snap => {
          const docs = snap.docs.map(d => d.data() as T)
          obs.next(docs)
        })
      },
    )
    return observer
  }
  streamDoc<T>(endpoint: IDBEndpoint) {
    const ref = db.doc(endpoint)
    const observer: Observable<T> = Observable.create(
      async (obs: Observer<T>) => {
        ref.onSnapshot(snap => {
          obs.next(snap.data() as T)
        })
      },
    )
    return observer
  }

  // create a blank doc to generate an id
  generateFirestoreDocID(endpoint: IDBEndpoint) {
    return db.collection(endpoint).doc().id
  }

  // mapping to generate firebase query from standard db queryOpts
  private _generateQueryRef(endpoint: IDBEndpoint, queryOpts: DBQueryOptions) {
    const query = { ...DB_QUERY_DEFAULTS, ...queryOpts }
    const { limit, orderBy, order, where } = query
    const baseRef = db.collection(endpoint)
    const limitRef = limit ? baseRef.limit(limit) : baseRef
    // if using where query ignore orderBy parameters to avoid need for composite indexes
    if (where) {
      const { field, operator, value } = where
      return limitRef.where(field, operator, value)
    } else {
      return limitRef.orderBy(orderBy!, order!)
    }
  }
}
