// tslint:disable max-classes-per-file
// tslint:disable variable-name
import { DexieClient } from './clients/dexie'
import { FirestoreClient } from './clients/firestore'
import { RealtimeDBClient } from './clients/rtdb'
import {
  AbstractDatabase,
  DBClients,
  DBEndpoint,
  DBDoc,
  DBQueryWhereOperator,
  DBQueryWhereValue,
} from './types'
import { Observable, Observer } from 'rxjs'

export class DatabaseV2 implements AbstractDatabase {
  private _clients: DBClients
  constructor(clients?: DBClients) {
    this._clients = clients ? clients : this._getDefaultClients()
  }

  /**
   * Provide a reference to a collection which can then be retrieved or used to
   * access specific documents.
   * @param endpoint - the name of the collection as found in the database
   */
  collection<T>(endpoint: DBEndpoint) {
    return new CollectionReference<T>(endpoint, this._clients)
  }

  private _getDefaultClients = (): DBClients => {
    return {
      cacheDB: new DexieClient(),
      serverDB: new FirestoreClient(),
      serverCacheDB: new RealtimeDBClient(),
    }
  }
}

class CollectionReference<T> {
  constructor(private endpoint: DBEndpoint, private clients: DBClients) {}

  /**
   * Provide a reference to a document to perform operations, such as getting or setting data
   * @param docID - provide an id for a specific doc, or leave blank to generate a new one
   */
  doc(docID?: string) {
    return new DocReference<T>(this.endpoint, docID, this.clients)
  }

  // TODO - allow partial observer instead of onUpdate and add unsubscribe
  /**
   * Streaming a collection retrieves provides a stream where a collection is
   * continually emitted, first with documents already cached, and then in realtime
   * as data is updated on the server.
   * @param onUpdate - callback function triggered when data is received.
   * This is triggered with the full set of documents (existing + update)
   */
  stream(onUpdate: (value: (T & DBDoc)[]) => void) {
    const { cacheDB, serverDB, serverCacheDB } = this.clients
    const endpoint = this.endpoint
    const observer: Observable<(T & DBDoc)[]> = Observable.create(
      async (obs: Observer<(T & DBDoc)[]>) => {
        // 1. Emit cached collection
        const cached = await cacheDB.getCollection<T>(endpoint)
        console.log('cached', cached)
        obs.next(cached)
        if (cached.length === 0) {
          // 2. If no cache, populate using large query db
          console.log('getting server cache')
          const serverCache = await serverCacheDB.getCollection<T>(endpoint)
          console.log('serverCache', serverCache)
          await cacheDB.setBulkDocs(endpoint, serverCache)
          obs.next(serverCache)
        }
        // 3. get any newer docs from regular server db, merge with cache and emit
        const latest = await this._getCacheLastModified()
        console.log('subcribing to updates', latest)
        serverDB.streamCollection!(endpoint, {
          orderBy: '_modified',
          order: 'asc',
          where: {
            field: '_modified',
            operator: '>',
            value: latest,
          },
        }).subscribe(async updates => {
          await cacheDB.setBulkDocs(endpoint, updates)
          const allDocs = await cacheDB.getCollection<T>(endpoint)
          obs.next(allDocs)
        })
      },
    )
    const subscription = observer.subscribe(value => onUpdate(value))
    return subscription
  }

  /**
   * Set multiple docs in a collection in batch.
   * NOTE - to set an individual doc a reference to that doc should be generated instead
   * i.e. `db.collection('v2_users').doc('myUsername').set(data)`
   * @param docs - The collection of docs to set
   */
  async set(docs: any[]) {
    const { cacheDB, serverDB } = this.clients
    const dbDocs: DBDoc[] = docs.map(d =>
      new DocReference(this.endpoint, d._id, this.clients).batchDoc(d),
    )
    await serverDB.setBulkDocs(this.endpoint, dbDocs)
    await cacheDB.setBulkDocs(this.endpoint, dbDocs)
  }

  /**
   * Query a collection to retrieve all documents where a certain criteria is met,
   * such as the value of a slug field.
   * If no documents are found then an empty array is returned
   * @param field - The document key to run queries against, e.g. 'slug'
   * @param operator - query operator, '==', '>', '<'
   * @param value - The corresponding value to search for (only string or number supported)
   */
  async getWhere(
    field: string,
    operator: DBQueryWhereOperator,
    value: DBQueryWhereValue,
  ) {
    const { serverDB } = this.clients
    const docs = await serverDB.queryCollection<T>(this.endpoint, {
      where: { field, operator, value },
    })
    return docs
  }

  private async _getCacheLastModified() {
    const { cacheDB } = this.clients
    const latest = await cacheDB.queryCollection(this.endpoint, {
      orderBy: '_modified',
      order: 'desc',
      limit: 1,
    })
    return latest.length > 0 ? latest[0]._modified : ''
  }
}

class DocReference<T> {
  public id: string
  constructor(
    private endpoint: DBEndpoint,
    docID: string = '_generate',
    private clients: DBClients,
  ) {
    this.id = docID === '_generate' ? this._generateDocID() : docID
  }

  /**
   * Get the target document data. Returns `undefined` if doc does not exist
   * @param source - Specify whether to fectch from cache or server.
   * By default will first check cache, and if doesn't exist will fetch from server
   * This is usually sufficient as the cache is updated when full collection sync'd
   */
  async get(
    source: 'server' | 'cache' = 'cache',
  ): Promise<(T & DBDoc) | undefined> {
    const { cacheDB, serverDB } = this.clients
    if (source === 'cache') {
      // 1. check cache, return if exists or skip to 2 if does not
      const cachedDoc = await cacheDB.getDoc<T>(this.endpoint, this.id)
      return cachedDoc ? cachedDoc : this.get('server')
    } else {
      // 2. get server docs, add to cache and return
      const serverDoc = await serverDB.getDoc<T>(this.endpoint, this.id)
      if (serverDoc) {
        await cacheDB.setDoc(this.endpoint, serverDoc)
      }
      return serverDoc
    }
  }

  /**
   * NOT CURRENTLY IN USE
   */
  async stream() {
    // TODO - if deemed useful by the platform
    throw new Error('stream method does not currently exist for docs')
    return
  }

  /**
   * Save data to the document. Will automatically populate with metadata including
   * `_created`, `_id`, `_modified` and `_deleted` fields
   * @param data - specified data in any format.
   * If contains metadata fields (e.g. `_id`)
   * then this will be used instead of generated id
   */
  async set(data: any) {
    const { serverDB, cacheDB } = this.clients
    const dbDoc: DBDoc = this._setDocMeta(data)
    await serverDB.setDoc(this.endpoint, dbDoc)
    await cacheDB.setDoc(this.endpoint, dbDoc)
  }

  /**
   * Documents are artificially deleted by replacing all contents with basic metadata and
   * `_deleted:true` property. This is so that other users can also sync the doc with their cache
   * TODO - schedule server permanent delete and find more elegant solution to notify users
   * to delete docs from their cache.
   */
  async delete() {
    return this.set({ _deleted: true })
  }

  batchDoc(data: any) {
    return this._setDocMeta(data)
  }

  private _setDocMeta(data: any = {}): DBDoc {
    const d = data
    return {
      ...d,
      _created: d._created ? d._created : new Date().toISOString(),
      _deleted: d._deleted ? d._deleted : false,
      _id: this.id,
      _modified: new Date().toISOString(),
    }
  }

  private _generateDocID() {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let autoId = ''
    for (let i = 0; i < 20; i++) {
      autoId += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return autoId
  }
}
