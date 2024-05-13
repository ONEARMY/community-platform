import { initializeApp } from 'firebase/app'
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore'
import { Observable } from 'rxjs'
import { FIREBASE_CONFIG, SITE } from 'src/config/config'
import { logger } from 'src/logger'

import { getQueryOptions } from '../utils/getQueryOptions'

import type { Firestore } from 'firebase/firestore'
import type { Observer } from 'rxjs'
import type { DBDoc, IDBEndpoint } from 'src/models/common.models'
import type { AbstractDatabaseClient, DBQueryOptions } from '../types'

export class FirestoreClient implements AbstractDatabaseClient {
  private _db: Firestore
  constructor() {
    const firebaseApp = initializeApp(FIREBASE_CONFIG)
    this._db = getFirestore(firebaseApp)

    logger.debug(`FirestoreClient`, {
      FIREBASE_CONFIG,
      SITE,
      db: this._db,
    })

    if (SITE === 'emulated_site') {
      this._db.useEmulator('localhost', 4003)
    }
  }
  /************************************************************************
   *  Main Methods - taken from abstract class
   ***********************************************************************/
  async getDoc<T>(endpoint: IDBEndpoint, docId: string) {
    logger.debug('FirestoreClient.getDoc', docId)
    const document = await getDoc(doc(this._db, endpoint, docId))
    return document.exists() ? (document.data() as T & DBDoc) : undefined
  }

  async setDoc(endpoint: IDBEndpoint, documentObj: DBDoc) {
    return setDoc(doc(this._db, endpoint, documentObj._id), documentObj)
  }

  async updateDoc(endpoint: IDBEndpoint, documentObj: DBDoc) {
    const { _id, ...updateValues } = documentObj

    return updateDoc(doc(this._db, endpoint, _id), updateValues)
  }

  async setBulkDocs(endpoint: IDBEndpoint, docs: DBDoc[]) {
    const batch = writeBatch(this._db)
    docs.forEach((d) => {
      const ref = doc(this._db, endpoint, d._id)
      batch.set(ref, d)
    })
  }

  // get a collection with optional value to query _modified field
  async getCollection<T>(endpoint: IDBEndpoint) {
    logger.debug(`FirestoreClient.getCollection`, endpoint)
    const snapshot = await getDocs(collection(this._db, endpoint))
    return snapshot.empty ? [] : snapshot.docs.map((d) => d.data() as T & DBDoc)
  }

  async queryCollection<T>(endpoint: IDBEndpoint, queryOpts: DBQueryOptions) {
    logger.debug(`FirestoreClient.queryCollection`, endpoint, queryOpts)
    const queryRef = this._generateQueryRef(endpoint, queryOpts)
    const data = await getDocs(queryRef)
    logger.debug(`FirestoreClient.queryCollection.data`, endpoint, {
      data,
    })

    return data.empty ? [] : data.docs.map((doc) => doc.data() as T)
  }

  deleteDoc(endpoint: IDBEndpoint, docId: string) {
    return deleteDoc(doc(this._db, endpoint, docId))
  }

  /************************************************************************
   *  Additional Methods - specific only to firestore
   ***********************************************************************/

  streamCollection<T>(endpoint: IDBEndpoint, queryOpts: DBQueryOptions) {
    const queryRef = this._generateQueryRef(endpoint, queryOpts)
    logger.debug(`FirestoreClient.streamCollection`, endpoint, {
      queryOpts,
      queryRef,
    })
    const observer: Observable<T[]> = Observable.create(
      async (obs: Observer<T[]>) => {
        onSnapshot(queryRef, (snap) => {
          logger.debug(
            `FirestoreClient.streamCollection.onSnapshot`,
            endpoint,
            snap.docs,
          )
          const docs = snap.docs.map((d) => d.data() as T)
          obs.next(docs)
        })
      },
    )
    return observer
  }
  streamDoc<T>(endpoint: IDBEndpoint) {
    logger.debug(`FirestoreClient.streamDoc`, endpoint)
    const ref = doc(this._db, endpoint)
    const observer: Observable<T> = Observable.create(
      async (obs: Observer<T>) => {
        onSnapshot(ref, (snap) => {
          obs.next(snap.data() as T)
        })
      },
    )
    return observer
  }

  // mapping to generate firebase query from standard db queryOpts
  private _generateQueryRef(endpoint: IDBEndpoint, queryOpts: DBQueryOptions) {
    const queryOptions = getQueryOptions(queryOpts)
    const collectionRef = collection(this._db, endpoint)

    const limitConstraint = queryOptions.limit
      ? limit(queryOptions.limit)
      : limit(1000)

    // if using where query ignore orderBy parameters to avoid need for composite indexes
    if (queryOptions.where) {
      const { field, operator, value } = queryOptions.where
      return query(
        collectionRef,
        where(field, operator, value),
        limitConstraint,
      )
    }

    return query(
      collectionRef,
      orderBy(queryOptions.orderBy!, queryOptions.order!),
      limitConstraint,
    )
  }
}
