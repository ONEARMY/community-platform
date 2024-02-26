import { rtdb } from 'src/utils/firebase'

import type { DBDoc, IDBEndpoint } from 'src/models/common.models'
import type { AbstractDatabaseClient } from '../types'

const db = rtdb

export class RealtimeDatabaseClient implements AbstractDatabaseClient {
  /************************************************************************
   *  Main Methods - taken from abstract class
   ***********************************************************************/
  async getDoc<T>(endpoint: IDBEndpoint, docId: string) {
    const snap = await db.ref(`${endpoint}/${docId}`).once('value')
    return snap.exists() ? (snap.val() as T) : undefined
  }

  async setDoc(endpoint: IDBEndpoint, doc: DBDoc) {
    return db.ref(`${endpoint}/${doc._id}`).set(doc)
  }

  async updateDoc(endpoint: IDBEndpoint, doc: DBDoc) {
    const { _id, ...updateValues } = doc
    return db.ref(`${endpoint}/${_id}`).update(updateValues)
  }

  async setBulkDocs(endpoint: IDBEndpoint, docs: DBDoc[]) {
    const updates = {}
    docs.forEach((d) => (updates[d._id] = d))
    return db.ref(`/${endpoint}`).update(updates)
  }

  async getCollection<T>(endpoint: IDBEndpoint) {
    try {
      const snap = await db.ref(endpoint).once('value')
      return snap.exists() && snap.val()
        ? Object.values<T & DBDoc>(snap.val())
        : []
    } catch (error) {
      // if endpoint doesn't exist return empty
      return []
    }
  }

  async queryCollection() {
    throw new Error('queries not available on this database')
    // eslint-disable-next-line
    return []
  }

  deleteDoc(endpoint: IDBEndpoint, docId: string) {
    return db.ref(`${endpoint}/${docId}`).remove()
  }

  /************************************************************************
   *  Additional Methods - specific only to firebase realtime DB
   ***********************************************************************/
}
