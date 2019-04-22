import { firebaseAdmin } from './admin'

export const db = firebaseAdmin.database()

export const get = async (path: string) => {
  const snap = await db.ref(path).once('value')
  return snap.val()
}
export const update = (path: string, values: any) => db.ref(path).update(values)
