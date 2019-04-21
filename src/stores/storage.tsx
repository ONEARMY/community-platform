/*
  This provides a go-between for stores and server storage objects. The reason for this is
  a) to make it easier to change storage provider/model in the future
  b) to enforce specific patterns when interacting with storage, such as setting metadata
*/

import { storage } from 'src/utils/firebase'

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
  /****************************************************************************** *
        Generators
  /****************************************************************************** */
  /****************************************************************************** *
        Helper Methods
  /****************************************************************************** */
}
