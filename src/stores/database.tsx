/*
  This provides a go-between for stores and the database. The reason for this is
  a) to make it easier to change database provider/model in the future
  b) to enforce specific patterns when interacting with the database, such as setting metadata
*/

import { Subject } from 'rxjs'
import { afs } from 'src/utils/firebase'
import { firestore, auth } from 'firebase/app'
import { IDbDoc } from 'src/models/common.models'
export class Database {
  /****************************************************************************** *
        Available Functions
  /****************************************************************************** */

  // get a group of docs. returns an observable, first pulling from local cache and then searching for updates
  public static getCollection(path: string) {
    const collection$ = new Subject<any[]>()
    this._emitCollectionUpdates(path, collection$)
    return collection$
  }

  // get a single doc. returns an observable, first pulling from local cache and then searching for updates
  public static getDoc(path: string) {
    const doc$ = new Subject()
    afs
      .doc(path)
      .get({ source: 'cache' })
      .then(cachedSnapshot => {
        // emit cached values and look for live, emitting if newer
        const cached = cachedSnapshot.data() as IDbDoc
        doc$.next(cached)
        afs.doc(path).onSnapshot(updateSnapshot => {
          const update = updateSnapshot.data() as IDbDoc
          if (update._modified.seconds > cached._modified.seconds) {
            doc$.next(update)
          }
        })
      })
    return doc$
  }

  // when setting a doc automatically populate the modified field and mark _deleted: false (for future query)
  public static setDoc(path: string, docValues: any) {
    return afs
      .doc(path)
      .set({ ...docValues, _modified: new Date(), _deleted: false })
  }
  // to allow caching to work docs are not completed deleted from the database, but instead emptied and marked as deleted
  // we could consider changing this to a full delete if it can be verified that users' cache won't repeatedly show the deleted doc
  public static deleteDoc(path: string) {
    return afs.doc(path).set({
      _modified: new Date(),
      _deleted: true,
    })
  }

  public static async queryCollection(
    collectionPath: string,
    field: string,
    operation: firestore.WhereFilterOp,
    value: string,
  ) {
    const data = await afs
      .collection(collectionPath)
      .where(field, operation, value)
      .get()
    return data.docs.map(doc => doc.data())
  }

  /****************************************************************************** *
        Generators
  /****************************************************************************** */

  // instantiate a blank document to generate an id
  public static generateId(collectionPath: string) {
    return afs.collection(collectionPath).doc().id
  }
  public static generateTimestamp(date?: Date) {
    return firestore.Timestamp.fromDate(date ? date : new Date())
  }

  public static async checkSlugUnique(collectionPath: string, slug: string) {
    const matches = await this.queryCollection(
      collectionPath,
      'slug',
      '==',
      slug,
    )
    if (matches.length > 0) {
      throw new Error('A document with that name already exists')
    } else {
      return
    }
  }
  // creates standard set of meta fields applied to all docs
  public static generateDocMeta(collectionPath: string) {
    const user = auth().currentUser
    const meta: IDbDoc = {
      _created: this.generateTimestamp(),
      _deleted: false,
      _id: this.generateId(collectionPath),
      _modified: this.generateTimestamp(),
      _createdBy: user ? (user.email as string) : 'anonymous',
    }
    return meta
  }

  /****************************************************************************** *
        Helper Methods
  /****************************************************************************** */

  // get cached value, emit, and then subscribe and emit any updates
  private static async _emitCollectionUpdates(
    path: string,
    subject: Subject<any[]>,
  ) {
    // get cached and emit
    const cachedSnapshot = await this._getCachedCollection(path)
    let cached = this._preProcessData(cachedSnapshot)
    subject.next([...cached].reverse())
    // subscribe to any updates, emit when received
    const updatesRef = this._getCollectionUpdatesRef(
      path,
      cached[cached.length - 1],
    )
    updatesRef.onSnapshot(updateSnapshot => {
      if (updateSnapshot.size > 0) {
        const update = this._preProcessData(updateSnapshot)
        cached = this._mergeData(cached, update)
        subject.next([...cached].reverse())
      }
    })
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
  private static _getCollectionUpdatesRef(path: string, latestDoc?: any) {
    return afs
      .collection(path)
      .orderBy('_modified', 'asc')
      .startAfter(latestDoc ? latestDoc._modified : -1)
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
