import { firebaseAdmin } from './admin'

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
