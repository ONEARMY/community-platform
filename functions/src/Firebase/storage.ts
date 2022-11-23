import { join } from 'path'
import { tmpdir } from 'os'
import { getImageDimensions } from '../Utils/image.utils'
import { firebaseApp, IFirebaseConfig } from './admin'
import { getStorage } from 'firebase-admin/storage'

/*************************************************************************
 *    Exports
 ************************************************************************/
const FIREBASE_CONFIG = JSON.parse(
  process.env.FIREBASE_CONFIG,
) as IFirebaseConfig
const storage = getStorage(firebaseApp)
export const bucket = storage.bucket(FIREBASE_CONFIG.storageBucket)
// get firebase storage file meta and return subset (+download link) for reference
// pass originalUrl if wanting to retain previous migraiton data
export const getStorageFileMeta = async (
  filePath: string,
  originalUrl?: string,
) => {
  const check = await bucket.file(filePath).getMetadata()
  const m = check[0]
  //download url needs to be generated
  const downloadUrl = await getDownloadUrl(filePath)
  const meta: IStorageFileMeta = {
    selfLink: m.selfLink,
    name: m.name,
    bucket: m.bucket,
    contentType: m.contentType,
    downloadUrl: downloadUrl as string,
    size: m.size,
    md5Hash: m.md5Hash,
    mediaLink: m.mediaLink,
    localPath: filePath,
    _originalUrl: originalUrl,
  }
  return meta
}

// take a file in storage bucket and copy to temp to get image dimensions. returns width and height
export async function getStorageImageDimensions(filePath: string) {
  const filename = filePath.split('/').pop()
  const tmpFilePath = join(tmpdir(), filename)
  await downloadFromStorageBucket(filePath, tmpFilePath)
  return getImageDimensions(tmpFilePath)
}

// upload to firebase storage bucket
export const uploadLocalFileToStorage = (
  filePath: string,
  destinationPath: string,
  metadata?: any,
) => {
  const options = {
    destination: destinationPath,
    metadata: { metadata },
  }
  return bucket.upload(filePath, options)
}

/*************************************************************************
 *    Helper Methods
 ************************************************************************/

//  copy a file from location on storage bucket to local destination
function downloadFromStorageBucket(
  storageFilePath: string,
  destinationFilePath: string,
) {
  return bucket.file(storageFilePath).download({
    destination: destinationFilePath,
  })
}

// generate a public download url for a file on storage
// (note - differs from firebase storage web methods)
function getDownloadUrl(filePath: string) {
  const file = bucket.file(filePath)
  return new Promise((resolve, reject) => {
    file.getSignedUrl(
      {
        action: 'read',
        expires: '03-17-2045',
      },
      function (err, url) {
        if (err) {
          console.error(err)
          reject(err)
        }
        resolve(url)
      },
    )
  })
}
function checkFileExists(filePath: string) {
  return bucket.file(filePath).exists()
}

const saveStorageFileToTempDir = async (name: string) => {
  const tmpFileName = name.replace(/\//g, '_')
  const tmpFile = join(tmpdir(), tmpFileName)
  await bucket.file(name).download({ destination: tmpFile })
  return tmpFile
}

/*************************************************************************
 *    Interfaces
 ************************************************************************/

// subset of storage meta fields
export interface IStorageFileMeta {
  selfLink: string
  name: string //name = filepath;
  bucket: string
  contentType: string
  downloadUrl: string
  size: string
  md5Hash: string
  mediaLink: string
  localPath: string
  _originalUrl?: string
}

/*************************************************************************
 *    Deprecated (will remove in future)
 ************************************************************************/
// take an image on storage and resize (if original greater than specified max), optionally creating backup
// export async function resizeStorageImage(
//   filePath: string,
//   size: keyof typeof STANDARD_WIDTHS,
//   keepOriginal: boolean,
// ) {
//   const filename = filePath.split('/').pop()
//   const tmpFilePath = join(tmpdir(), filename)
//   await downloadFromStorageBucket(filePath, tmpFilePath)
//   const dimensions = await getImageDimensions(tmpFilePath)
//   if (dimensions.width > STANDARD_WIDTHS[size]) {
//     console.log(
//       'resizing',
//       filename,
//       `${dimensions.width}->${STANDARD_WIDTHS[size]}`,
//     )
//     const extension = filename.split('.').pop()
//     if (keepOriginal) {
//       // make a copy
//       const destinationPath = filePath.replace(
//         '.' + extension,
//         '.original.' + extension,
//       )
//       await uploadLocalFileToStorage(tmpFilePath, destinationPath)
//     }
//     const resizedPath = await resizeLocalImage(tmpFilePath, size)
//     await uploadLocalFileToStorage(resizedPath, filePath)
//   }
//   await fs.remove(tmpFilePath)
// }
