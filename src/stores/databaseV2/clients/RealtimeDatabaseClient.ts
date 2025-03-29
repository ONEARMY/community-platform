import { realTimeDatabase } from 'src/utils/firebase'

import type { DBDoc, DBEndpoint } from 'oa-shared'
import type { AbstractDatabaseClient } from '../types'

const db = realTimeDatabase

export class RealtimeDatabaseClient implements AbstractDatabaseClient {
  /************************************************************************
   *  Main Methods - taken from abstract class
   ***********************************************************************/
  async getDoc<T>(endpoint: DBEndpoint, docId: string) {
    const snap = await db.ref(`${endpoint}/${docId}`).once('value')
    return snap.exists() ? (snap.val() as T) : undefined
  }

  async setDoc(endpoint: DBEndpoint, doc: DBDoc) {
    return db.ref(`${endpoint}/${doc._id}`).set(doc)
  }

  async updateDoc(endpoint: DBEndpoint, doc: DBDoc) {
    const { _id, ...updateValues } = doc
    return db.ref(`${endpoint}/${_id}`).update(updateValues)
  }

  async setBulkDocs(endpoint: DBEndpoint, docs: DBDoc[]) {
    const updates = {}
    docs.forEach((d) => (updates[d._id] = d))
    return db.ref(`/${endpoint}`).update(updates)
  }

  async getCollection<T>(endpoint: DBEndpoint) {
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
  }
}
