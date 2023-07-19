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
