/*
  This provides a go-between for stores and the database. The reason for this is
  a) to make it easier to change database provider/model in the future
  b) to enforce specific patterns when interacting with the database, such as setting metadata
*/

import { Subject } from 'rxjs'
import { afs } from 'src/utils/firebase'
import { firestore } from 'firebase'
export class Database {
  // get a group of docs. returns an observable, first pulling from local cache and then searching for updates
  static getCollection(path: string) {
    const collection$ = new Subject()
    this._getCachedCollection(path).then(data => {
      // emit cached values and look for fresh
      const cached = data.docs.map(doc => doc.data())
      collection$.next(cached)
      this._getLiveCollection(path, cached[0]).then(data2 => {
        const updates = data2.docs.map(doc => doc.data())
        collection$.next([...updates, ...cached])
      })
    })
    return collection$
  }

  // get a single doc. returns an observable, first pulling from local cache and then searching for updates
  getDoc(cacheFirst?: boolean) {}

  setDoc(path: string, docValues: any) {
    docValues._modified = new Date()
    return afs.doc(path).set(docValues)
  }

  // search the persisted cache for documents and return ordered by date modified
  private static _getCachedCollection(path: string) {
    return afs
      .collection(path)
      .orderBy('_modified', 'desc')
      .get({ source: 'cache' })
  }
  //
  private static _getLiveCollection(path: string, latestDoc: any) {
    return afs
      .collection(path)
      .orderBy('modified')
      .startAfter(latestDoc)
      .get({ source: 'cache' })
  }
}
