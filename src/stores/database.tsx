/*
  This provides a go-between for stores and the database. The reason for this is
  a) to make it easier to change database provider/model in the future
  b) to enforce specific patterns when interacting with the database, such as setting metadata
*/

import { Subject } from 'rxjs'
import { afs } from 'src/utils/firebase'
import { firestore } from 'firebase/app'
export class Database {
  // get a group of docs. returns an observable, first pulling from local cache and then searching for updates
  public static getCollection(path: string) {
    const collection$ = new Subject()
    this._getCachedCollection(path).then(data => {
      // emit cached values and look for fresh
      const cached = this._preProcessData(data)
      collection$.next([...cached].reverse())
      this._getLiveCollection(path, cached[cached.length - 1]).then(data2 => {
        const updates = this._preProcessData(data2)
        // emit combination of cached and updates
        const merged = this._mergeData(cached, updates)
        collection$.next([...merged].reverse())
      })
    })
    return collection$
  }

  // get a single doc. returns an observable, first pulling from local cache and then searching for updates
  public static getDoc(path) {
    const doc$ = new Subject()
    this._getCachedDoc(path).then(cached => {
      // emit cached values and look for fresh
      doc$.next(cached.data())
      this._getLiveDoc(path).then(update => {
        doc$.next(update.data())
      })
    })
    return doc$
  }

  public static setDoc(path: string, docValues: any) {
    docValues._modified = new Date()
    return afs.doc(path).set(docValues)
  }
  // search the persisted cache for documents, return oldest to newest
  private static _getCachedDoc(path: string) {
    return afs.doc(path).get({ source: 'cache' })
  }
  // get any documents that have been updated since last document in cache
  // if no documents in cache fetch everything
  private static _getLiveDoc(path: string) {
    return afs.doc(path).get({ source: 'server' })
  }

  // search the persisted cache for documents, return oldest to newest
  private static _getCachedCollection(path: string) {
    return afs
      .collection(path)
      .orderBy('_modified', 'asc')
      .get({ source: 'cache' })
  }
  // get any documents that have been updated since last document in cache
  // if no documents in cache fetch everything
  private static _getLiveCollection(path: string, latestDoc?: any) {
    return afs
      .collection(path)
      .orderBy('_modified', 'asc')
      .startAfter(latestDoc ? latestDoc._modified : -1)
      .get({ source: 'server' })
  }
  // when data comes in from firebase we want to preprocess, to extract the document data from firestore
  // documents, populate a _id field (if not present) and remove deleted items
  private static _preProcessData(data: firestore.QuerySnapshot) {
    const docs = data.docs.map(doc => {
      return { ...doc.data(), _id: doc.id }
    }) as any[]
    const filtered = docs.filter(doc => !doc._deleted)
    return filtered
  }

  // when we have both cached and updated data retrieved, we want to merge so that any documents
  // that have been updated don't appear in both lists
  private static _mergeData(cached: any[], updates: any[]) {
    const json = {}
    cached.forEach(d => {
      json[d._id] = d
    })
    updates.forEach(d => {
      json[d._id] = d
    })
    return Object.values(json)
  }
}
