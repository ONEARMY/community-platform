import { IDBEndpoint, IDbDoc } from 'src/models/common.models'
import { rtdb } from '../utils/firebase.utils'
import { AbstractDBClient } from '../types'

const db = rtdb

export class RealtimeDBClient implements AbstractDBClient {
  /************************************************************************
   *  Main Methods - taken from abstract class
   ***********************************************************************/
  async getDoc<T>(endpoint: IDBEndpoint, docId: string) {
    const snap = await db.ref(`${endpoint}/${docId}`).once('value')
    return snap.exists ? (snap.val() as T) : undefined
  }

  async setDoc(endpoint: IDBEndpoint, doc: IDbDoc) {
    return db.ref(`${endpoint}/${doc._id}`).set(doc)
  }

  async setBulkDocs(endpoint: IDBEndpoint, docs: IDbDoc[]) {
    const updates = {}
    docs.forEach(d => (updates[d._id] = d))
    return db.ref(`/${endpoint}`).update(updates)
  }

  async getCollection<T>(endpoint: IDBEndpoint) {
    const snap = await db.ref(endpoint).once('value')
    return snap.exists ? Object.values<T & IDbDoc>(snap.val()) : []
  }

  async queryCollection() {
    throw new Error('queries not available on this database')
    return []
  }

  /************************************************************************
   *  Additional Methods - specific only to firebase realtime DB
   ***********************************************************************/
}
