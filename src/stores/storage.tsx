/*
  This provides a go-between for stores and server storage objects. The reason for this is
  a) to make it easier to change storage provider/model in the future
  b) to enforce specific patterns when interacting with storage, such as setting metadata
*/

import { storage } from '../utils/firebase'

export class Storage {
  /****************************************************************************** *
        Available Functions
  /****************************************************************************** */
  // method to generate a download url for storage file without making request
  // NOTE, requires public auth permissions on the given storage path (use storage rules)
  public static getPublicDownloadUrl(filePath: string) {
    const bucket = storage.ref().bucket
    const encodedPath = encodeURIComponent(filePath)
    return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodedPath}?alt=media`
  }

  // take a storage path, filename and blob and upload to storage, returning file metadata
  public static async uploadFile(
    storageFolder: string,
    filename: string,
    data: Blob | File,
    filetype: string,
  ) {
    const storageRef = storage.ref(storageFolder)
    const fileRef = storageRef.child(filename)
    const snapshot = await fileRef.put(data)
    const url = await fileRef.getDownloadURL()
    const meta = generateUploadedFileMeta(snapshot.metadata, url, filetype)
    return meta
  }
}

/****************************************************************************** *
        Helper Methods
/****************************************************************************** */

const generateUploadedFileMeta = (
  snapshotMeta,
  url: string,
  filetype: string,
) => {
  const fileInfo: IUploadedFileMeta = {
    downloadUrl: url,
    contentType: snapshotMeta.contentType,
    fullPath: snapshotMeta.fullPath,
    name: snapshotMeta.name,
    size: snapshotMeta.size,
    type: filetype,
    timeCreated: snapshotMeta.timeCreated,
    updated: snapshotMeta.updated,
  }
  return fileInfo
}

/****************************************************************************** *
        Interfaces
/****************************************************************************** */
export interface IUploadedFileMeta {
  downloadUrl: string
  contentType?: string | null
  fullPath: string
  name: string
  type: string
  size: number
  timeCreated: string
  updated: string
}

// interface batchUploadFileMeta{
//   storageFolder:string,
//   // filenam
// }
