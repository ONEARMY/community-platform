import { firebaseAdmin } from './admin'

export const db = firebaseAdmin.database()

export const update = (path: string, values: any) => {
  const ref = db.ref(path)
  return new Promise((resolve, reject) => {
    ref
      .update(values, err => {
        if (err) {
          console.log('err', err)
          reject(err)
        } else {
          resolve()
        }
      })
      .then(() => resolve())
      .catch(err => {
        console.log('err', err)
        reject(err)
      })
  })
}
