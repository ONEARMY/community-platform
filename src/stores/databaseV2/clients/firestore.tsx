import type { IDBEndpoint, DBDoc } from 'src/models/common.models'
import { firestore } from 'src/utils/firebase'
import type { DBQueryOptions, AbstractDatabaseClient } from '../types'
import type { Observer } from 'rxjs'
import { Observable } from 'rxjs'
import { DB_QUERY_DEFAULTS } from '../utils/db.utils'
import type { IAggregationId } from 'src/stores/Aggregations/aggregations.store'

const db = firestore

export class FirestoreClient implements AbstractDatabaseClient {
  /************************************************************************
   *  Main Methods - taken from abstract class
   ***********************************************************************/
  async getDoc<T>(endpoint: IDBEndpoint, docId: string) {
    const doc = await db.collection(endpoint).doc(docId).get()
    return doc.exists ? (doc.data() as T & DBDoc) : undefined
  }

  async setDoc(endpoint: IDBEndpoint, doc: DBDoc) {
    return db.doc(`${endpoint}/${doc._id}`).set(doc)
  }

  async updateDoc(endpoint: IDBEndpoint, doc: DBDoc) {
    const { _id, ...updateValues } = doc
    return db.doc(`${endpoint}/${_id}`).update(updateValues)
  }

  async setBulkDocs(endpoint: IDBEndpoint, docs: DBDoc[]) {
    const batch = db.batch()
    docs.forEach((d) => {
      const ref = db.collection(endpoint).doc(d._id)
      batch.set(ref, d)
    })
  }

  // get a collection with optional value to query _modified field
  async getCollection<T>(endpoint: IDBEndpoint) {
    const snapshot = await db.collection(endpoint).get()
    return snapshot.empty ? [] : snapshot.docs.map((d) => d.data() as T & DBDoc)
  }

  async queryCollection<T>(endpoint: IDBEndpoint, queryOpts: DBQueryOptions) {
    const ref = this._generateQueryRef(endpoint, queryOpts)
    const data = await ref.get()
    return data.empty ? [] : data.docs.map((doc) => doc.data() as T)
  }

  async calculateAggregation(id: string, aggregation: IAggregationId) {
    if (aggregation === 'users_totalUseful') {
      // Get how to created by useful

      const howtos = await db
        .collection('howtos')
        .where('_createdBy', '==', id)
        .where('votedUsefulCount', '>', 0)
        .get()

      let totalUseful = 0

      if (!howtos.empty) {
        for (let i = 0; i < howtos.docs.length; i++) {
          const data = howtos.docs[i].data()
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          totalUseful += data.votedUsefulCount
        }
      }

      const userResearch = {}

      // get research created by useful
      const createdResearch = await db
        .collection('research')
        .where('_createdBy', '==', id)
        .where('votedUsefulCount', '>', 0)
        .get()

      if (!createdResearch.empty) {
        for (let i = 0; i < createdResearch.docs.length; i++) {
          const data = createdResearch.docs[i].data()

          userResearch[data._id] = data.votedUsefulCount
        }
      }

      // get research collaborator useful

      const collaboratedResearch = await db
        .collection('research')
        .where('collaborators', 'array-contains', id)
        .where('votedUsefulCount', '>', 0)
        .get()

      if (!collaboratedResearch.empty) {
        for (let i = 0; i < collaboratedResearch.docs.length; i++) {
          const data = collaboratedResearch.docs[i].data()
          userResearch[data._id] = data.votedUsefulCount
        }
      }

      const useful: number[] = Object.values(userResearch)
      totalUseful += useful.reduce((a, b) => a + b)
      return totalUseful
    }

    return undefined
  }

  deleteDoc(endpoint: IDBEndpoint, docId: string) {
    return db.collection(endpoint).doc(docId).delete()
  }

  /************************************************************************
   *  Additional Methods - specific only to firestore
   ***********************************************************************/

  streamCollection<T>(endpoint: IDBEndpoint, queryOpts: DBQueryOptions) {
    const ref = this._generateQueryRef(endpoint, queryOpts)
    const observer: Observable<T[]> = Observable.create(
      async (obs: Observer<T[]>) => {
        ref.onSnapshot((snap) => {
          const docs = snap.docs.map((d) => d.data() as T)
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
        ref.onSnapshot((snap) => {
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
