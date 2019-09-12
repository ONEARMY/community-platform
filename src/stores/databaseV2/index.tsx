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

  collection(endpoint: DBEndpoint) {
    return new CollectionReference(endpoint, this._clients)
  }

  private _getDefaultClients = (): DBClients => {
    return {
      cacheDB: new DexieClient(),
      serverDB: new FirestoreClient(),
      serverCacheDB: new RealtimeDBClient(),
    }
  }
}

class CollectionReference {
  constructor(private endpoint: DBEndpoint, private clients: DBClients) {}

  doc(docID?: string) {
    return new DocReference(this.endpoint, docID, this.clients)
  }

  // TODO - allow partial observer instead of onUpdate and add unsubscribe
  stream<T>(onUpdate: (value: T[]) => void) {
    const { cacheDB, serverDB, serverCacheDB } = this.clients
    const endpoint = this.endpoint
    const observer: Observable<T[]> = Observable.create(
      async (obs: Observer<T[]>) => {
        // 1. Emit cached collection
        const cached = await cacheDB.getCollection<T>(endpoint)
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

  async set(docs: any[]) {
    const { cacheDB, serverDB } = this.clients
    const dbDocs: DBDoc[] = docs.map(d =>
      new DocReference(this.endpoint, d._id, this.clients).batchDoc(d),
    )
    await serverDB.setBulkDocs(this.endpoint, dbDocs)
    await cacheDB.setBulkDocs(this.endpoint, dbDocs)
  }

  async getWhere(
    field: string,
    operator: DBQueryWhereOperator,
    value: DBQueryWhereValue,
  ) {
    const { serverDB } = this.clients
    const docs = await serverDB.queryCollection(this.endpoint, {
      where: { field, operator, value },
    })
    return docs.length > 0 ? true : false
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

class DocReference {
  public id: string
  constructor(
    private endpoint: DBEndpoint,
    docID: string = '_generate',
    private clients: DBClients,
  ) {
    this.id = docID === '_generate' ? this._generateDocID() : docID
  }

  async get<T>(source: 'server' | 'cache' = 'cache') {
    const { cacheDB, serverDB } = this.clients
    if (source === 'cache') {
      // 1. check cache, return if exists or skip to 2 if does not
      const cachedDoc = await cacheDB.getDoc<T>(this.endpoint, this.id)
      return cachedDoc ? cachedDoc : this.get<T>('server')
    } else {
      // 2. get server docs, add to cache and return
      const serverDoc = await serverDB.getDoc<T>(this.endpoint, this.id)
      if (serverDoc) {
        await cacheDB.setDoc(this.endpoint, serverDoc)
      }
      return serverDoc
    }
  }

  async stream() {
    // TODO - if deemed useful by the platform
    throw new Error('stream method does not currently exist for docs')
    return
  }

  async set(data: any) {
    const { serverDB, cacheDB } = this.clients
    const dbDoc: DBDoc = this._setDocMeta(data)
    await serverDB.setDoc(this.endpoint, dbDoc)
    await cacheDB.setDoc(this.endpoint, dbDoc)
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
