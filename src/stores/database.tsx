/*
  This provides a go-between for stores and the database. The reason for this is
  a) to make it easier to change database provider/model in the future
  b) to enforce specific patterns when interacting with the database, such as setting metadata
*/

import { Subject } from 'rxjs'
import { afs } from 'src/utils/firebase'
import { IDbDoc, IDBEndpoint } from 'src/models/common.models'
// additional imports for typings
import { firestore, auth } from 'firebase/app'
export class Database {
  /****************************************************************************** *
        Available Functions
  /****************************************************************************** */

  // get a group of docs. returns an observable, first pulling from local cache and then searching for updates
  public static getCollection(path: IDBEndpoint) {
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
          if (update._modified > cached._modified) {
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

  // find all docs in collection matching criteria
  // if no docs are found returns an empty array
  public static async queryCollection<T>(
    collectionPath: IDBEndpoint,
    field: string,
    operation: firestore.WhereFilterOp,
    value: string,
  ) {
    const data = await afs
      .collection(collectionPath)
      .where(field, operation, value)
      .get()
    console.log('data', data)
    return data.empty ? [] : data.docs.map(doc => doc.data() as T)
  }

  /****************************************************************************** *
        Generators
  /****************************************************************************** */

  // instantiate a blank document to generate an id
  public static generateDocId(collectionPath: IDBEndpoint) {
    return afs.collection(collectionPath).doc().id
  }

  public static async checkSlugUnique(
    collectionPath: IDBEndpoint,
    slug: string,
  ) {
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
  public static generateDocMeta(collectionPath: IDBEndpoint, docID?: string) {
    const user = auth().currentUser
    const meta: IDbDoc = {
      _created: new Date().toISOString(),
      _deleted: false,
      _id: docID ? docID : this.generateDocId(collectionPath),
      _modified: new Date().toISOString(),
      _createdBy: user ? (user.displayName as string) : 'anonymous',
    }
    return meta
  }

  /****************************************************************************** *
        Helper Methods
  /****************************************************************************** */

  // get cached data, emit, and then subscribe to live updates and emit full collection on change
  private static async _emitCollectionUpdates(
    path: IDBEndpoint,
    subject: Subject<any[]>,
  ) {
    // get cached and emit
    const cached = await this._emitCachedCollection(path, subject)
    // subscribe to any updates, emit when received
    const updatesRef = this._getCollectionUpdatesRef(
      path,
      cached[cached.length - 1],
    )
    updatesRef.onSnapshot(async updateSnapshot => {
      // whenever updates are found they will automatically be added to the cache,
      // so we can just emit all values from the cache once more (and avoid manually merging changes in)
      if (updateSnapshot.size > 0) {
        await this._emitCachedCollection(path, subject, true)
      }
    })
  }

  // get data from the cache, process and emit to subject
  private static async _emitCachedCollection(
    path: IDBEndpoint,
    subject: Subject<any[]>,
    isNew?: boolean,
  ) {
    const cachedSnapshot = await this._getCachedCollection(path)
    const cached = this._preProcessData(cachedSnapshot, isNew)
    subject.next([...cached].reverse())
    return cached
  }

  // search the persisted cache for documents, return oldest to newest
  private static _getCachedCollection(path: IDBEndpoint) {
    return afs
      .collection(path)
      .orderBy('_modified', 'asc')
      .get({ source: 'cache' })
  }
  // get any documents that have been updated since last document in cache
  // if no documents in cache fetch everything
  private static _getCollectionUpdatesRef(path: IDBEndpoint, latestDoc?: any) {
    return afs
      .collection(path)
      .orderBy('_modified', 'asc')
      .startAfter(latestDoc ? latestDoc._modified : -1)
  }

  // when data comes in from firebase we want to preprocess, to extract the document data from firestore
  // documents, populate a _id field (if not present) and remove deleted items
  // additionally add a _isNew field to indicate whether this is the first time the data has been retrieved by the user
  private static _preProcessData(
    data: firestore.QuerySnapshot,
    isNew?: boolean,
  ) {
    const docs = data.docs.map(doc => {
      return { ...doc.data(), _id: doc.id, _isNew: isNew }
    }) as any[]
    const filtered = docs.filter(doc => !doc._deleted)
    return filtered
  }
}
