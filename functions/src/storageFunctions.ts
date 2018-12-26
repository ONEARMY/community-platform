import * as admin from 'firebase-admin'

// full api here: https://cloud.google.com/nodejs/docs/reference/storage/2.3.x/Bucket.html
// *** NOTE - WiP - functions not fully support to remove folders (but possible workaround with extra query)
export const deleteStorageItems = (path: string) => {
  //   return admin
  //     .storage()
  //     .bucket()
  //     .deleteFiles({
  //       prefix: path,
  //     })
}

// const getStorageItems = async () => {
//   return admin
//     .storage()
//     .bucket()
//     .getFiles()
// }
