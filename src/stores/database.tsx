/*
  This provides a go-between for stores and the database. The reason for this is
  a) to make it easier to change database provider/model in the future
  b) to enforce specific patterns when interacting with the database, such as setting metadata
*/

import { Subject } from 'rxjs'
import { afs } from 'src/utils/firebase'
import { rdb } from 'src/utils/firebase'
import { IDbDoc } from 'src/models/common.models'
// additional imports for typings
import { firestore, auth } from 'firebase/app'
import Dexie from 'dexie'
const indexedDB = new Dexie('onearmyIDB')
export class Database {
  /****************************************************************************** *
        Available Functions
  /****************************************************************************** */

  // get a group of docs. returns an observable, first pulling from local cache and then searching for updates
  public static getCollection(path: IDBEndpoints) {
    const collection$ = new Subject<any[]>()
    this._emitCollectionUpdates(path, collection$)
    return collection$
  }

  // an issue with firestore is high cost if large number of docs returned. Use below
  // method to use alternate approach if using firebase as db provider
  // NOTE - requires endpoint to be sync'd with realtimeDB via cloud-function
  public static getLargeCollection<T>(path: IDBEndpoints) {
    const collection$ = new Subject<T[]>()
    this._emitLargeCollectionUpdates(path, collection$)
    return collection$
  }

  // get a single doc. returns either stream of cached->live->updates
  // or a single doc pulled cache-first with live fallback
  public static getDoc<T extends IDbDoc>(
    path: string,
    returnFormat: 'stream' | 'once' = 'stream',
  ): Subject<T> | Promise<T> {
    switch (returnFormat) {
      case 'once':
        return this.getDocOnce<T>(path)
      default:
        return this.getDocStream<T>(path)
    }
  }
  private static getDocStream<T extends IDbDoc>(path: string): Subject<T> {
    const doc$ = new Subject<T>()
    afs
      .doc(path)
      .get({ source: 'cache' })
      .then(cachedSnapshot => {
        // emit cached values and look for live, emitting if newer
        const cached = cachedSnapshot.data() as T
        doc$.next(cached)
        afs.doc(path).onSnapshot(updateSnapshot => {
          const update = updateSnapshot.data() as T
          if (update._modified.seconds > cached._modified.seconds) {
            doc$.next(update)
          }
        })
      })
    return doc$
  }
  private static getDocOnce<T extends IDbDoc>(path: string): Promise<T> {
    return new Promise<T>(resolve => {
      afs
        .doc(path)
        .get({ source: 'cache' })
        .then(cached => {
          resolve(cached.data() as T)
        })
        // if no doc found in cache firebase throws error
        .catch(err => {
          afs
            .doc(path)
            .get({ source: 'server' })
            .then(snap => {
              resolve(snap.data() as T)
            })
        })
    })
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
    collectionPath: IDBEndpoints,
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
  public static generateDocId(collectionPath: IDBEndpoints) {
    return afs.collection(collectionPath).doc().id
  }
  public static generateTimestamp(date?: Date) {
    return firestore.Timestamp.fromDate(date ? date : new Date())
  }

  public static async checkSlugUnique(
    collectionPath: IDBEndpoints,
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
  public static generateDocMeta(collectionPath: IDBEndpoints, docID?: string) {
    const user = auth().currentUser
    const meta: IDbDoc = {
      _created: this.generateTimestamp(),
      _deleted: false,
      _id: docID ? docID : this.generateDocId(collectionPath),
      _modified: this.generateTimestamp(),
      _createdBy: user ? (user.displayName as string) : 'anonymous',
    }
    return meta
  }

  /****************************************************************************** *
        Helper Methods
  /****************************************************************************** */

  // get cached data, emit, and then subscribe to live updates and emit full collection on change
  private static async _emitCollectionUpdates(
    path: string,
    subject: Subject<any[]>,
  ) {
    // get cached and emit
    const cached = await this._emitCachedCollection(path, subject)
    // subscribe to any updates, emit when received
    const updatesRef = this._getCollectionUpdatesRef(path, cached.pop())
    updatesRef.onSnapshot(async updateSnapshot => {
      // whenever updates are found they will automatically be added to the cache,
      // so we can just emit all values from the cache once more (and avoid manually merging changes in)
      if (updateSnapshot.size > 0) {
        await this._emitCachedCollection(path, subject, true)
      }
    })
  }

  // get cached data from local storage, emit, then subscribe to live update
  // if no cached data exists pull large data from firebase-realtime instead of firestore
  // TODO - split indexedDB, firebase realtime and firestore into better-marked sections
  private static async _emitLargeCollectionUpdates(
    path: IDBEndpoints,
    subject: Subject<any[]>,
  ) {
    // fetch from indexeddb and emit. First close existing open as auto-opens
    // pass basic schema for a table with same name as endpoint
    // and allow indexing on _id, and _modified (TODO - allow more indexes for specific tables)
    const stores = { [path]: '_id,_modified' }
    if (indexedDB.isOpen()) {
      await indexedDB.close()
    }
    // setting version requires closed db and will reopen
    indexedDB.version(1).stores(stores)
    const table = indexedDB.table(path)
    let cached = await table.toCollection().toArray()
    subject.next([...cached])
    // fetch from realtime-db, cache and emit
    if (cached.length === 0) {
      const fetchSnapshot = await rdb.ref(path).once('value')
      if (fetchSnapshot.exists()) {
        await table.bulkPut(fetchSnapshot.val())
        cached = await table.toCollection().toArray()
        subject.next([...cached])
      }
    }
    // fetch updates from firestore, cache and emit
    const updatesRef = this._getCollectionUpdatesRef(path, cached.pop())
    updatesRef.onSnapshot(async updateSnapshot => {
      if (updateSnapshot.size > 0) {
        const docs = updateSnapshot.docs.map(d => d.data())
        await table.bulkPut(docs)
        cached = await table.toCollection().toArray()
        subject.next([...cached])
      }
    })
  }

  // get data from the cache, process and emit to subject
  private static async _emitCachedCollection(
    path: string,
    subject: Subject<any[]>,
    isNew?: boolean,
  ) {
    const cachedSnapshot = await this._getCachedCollection(path)
    const cached = this._preProcessData(cachedSnapshot, isNew)
    subject.next([...cached].reverse())
    return cached
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

/****************************************************************************** *
        Interfaces
  /****************************************************************************** */

export type IDBEndpoints =
  | 'howtosV1'
  | 'users'
  | 'discussions'
  | 'tagsV1'
  | 'eventsV1'
  | 'mapPinsV1'
  | '_mocks'
