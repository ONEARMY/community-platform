import { firebaseApp } from './admin'

import { DBDoc, IDBEndpoint, DB_ENDPOINTS } from '../models'
import { getFirestore } from 'firebase-admin/firestore'

// TODO - ideally should remove default export to force using functions which have mapping
export const db = getFirestore(firebaseApp)

/************************************************************
 * Additional exports to support common naming conventions
 ************************************************************/

export const update = (path: string, data: any) => db.doc(path).update(data)
export const set = (path: string, data: any) => db.doc(path).set(data)
export const get = (path: string) => db.doc(path)

/************************************************************
 * Specific firestore helpers for common ops
 ************************************************************/
export const getLatestDoc = async (endpoint: IDBEndpoint, orderBy: string) => {
  const mappedEndpoint = DB_ENDPOINTS[endpoint]
  const col = await db
    .collection(mappedEndpoint)
    .orderBy(orderBy)
    .limit(1)
    .get()
  return col.docs[0]
}
export const getDoc = async <T = any>(
  endpoint: IDBEndpoint,
  docId: string,
): Promise<T> => {
  const mapping = DB_ENDPOINTS[endpoint] || endpoint
  console.log(`mapping [${endpoint}] -> [${mapping}]`)
  return db
    .collection(mapping)
    .doc(docId)
    .get()
    .then((res) => {
      return res.data() as T
    })
}
export const getCollection = async <T>(endpoint: IDBEndpoint) => {
  const mapping = DB_ENDPOINTS[endpoint] || endpoint
  console.log(`mapping [${endpoint}] -> [${mapping}]`)
  return db
    .collection(mapping)
    .get()
    .then((snapshot) => {
      return snapshot.empty
        ? []
        : snapshot.docs.map((d) => d.data() as T & DBDoc)
    })
}
export const setDoc = async (
  endpoint: IDBEndpoint,
  docId: string,
  data: any,
) => {
  const mapping = DB_ENDPOINTS[endpoint] || endpoint
  return db.collection(mapping).doc(docId).set(data)
}

export const updateDoc = async (
  endpoint: IDBEndpoint,
  docId: string,
  data: any,
) => {
  const mapping = DB_ENDPOINTS[endpoint] || endpoint
  return db.collection(mapping).doc(docId).update(data)
}
