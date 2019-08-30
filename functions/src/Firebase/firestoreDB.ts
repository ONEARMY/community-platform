import { firebaseAdmin } from './admin'
import { IDbDoc, IDBEndpoint } from '../models'

export const db = firebaseAdmin.firestore()

export const update = (path: string, data: any) => db.doc(path).update(data)

export const set = (path: string, data: any) => db.doc(path).set(data)

export const get = (path: string) => db.doc(path)

export const getLatestDoc = async (collection: string, orderBy: string) => {
  const col = await db
    .collection(collection)
    .orderBy(orderBy)
    .limit(1)
    .get()
  return col.docs[0]
}

export const getDoc = (path: string) => db.doc(path)

export const getCollection = (endpoint: IDBEndpoint) =>
  db
    .collection(endpoint)
    .get()
    .then(snapshot => {
      return snapshot.empty ? [] : snapshot.docs.map(d => d.data() as IDbDoc)
    })
