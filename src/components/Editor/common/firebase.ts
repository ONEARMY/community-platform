import { afs, storage } from 'src/utils/firebase'

// @TODO : this is copied from other code, please extract

export const storagePath = () => {
  const databaseRef = afs.collection('documentation').doc()
  const docID = databaseRef.id
  return `uploads/documentation/${docID}`
}

export const deleteUpload = (path: string) => {
  const ref = storage.ref(path)
  // return callback before confirmation of deletion to provide immediate feedback to user
  ref.delete().catch(error => {
    throw new Error(JSON.stringify(error))
  })
}
