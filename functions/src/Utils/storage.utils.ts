import * as path from 'path'
import * as os from 'os'
import { Bucket, UploadOptions } from '@google-cloud/storage'

export const saveStorageFileToTmpDir = async (bucket: Bucket, name: string) => {
  const tmpFileName = name.replace(/\//g, '_')
  const tmpFile = path.join(os.tmpdir(), tmpFileName)

  await bucket.file(name).download({ destination: tmpFile })
  return tmpFile
}

// upload to firebase storage bucket
export const uploadLocalFileToStorage = async (
  bucket: Bucket,
  filePath: string,
  destinationPath: string,
  metadata: UploadOptions['metadata'],
) => {
  const options = {
    destination: destinationPath,
    metadata: { metadata },
  }
  console.log('uploading to storage')
  await bucket.upload(filePath, options)
  return
}
