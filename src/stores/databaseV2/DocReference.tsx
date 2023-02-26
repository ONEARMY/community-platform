import type { DBClients, DBDoc } from './types'
import { Observable } from 'rxjs'

export class DocReference<T> {
  public id: string
  constructor(
    private endpoint: string,
    private docID: string = '_generate',
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
      // 2. get server docs and return
      // Note - do not cache after retrieval as could interfere with collection get
      // in case where doc retrieved before rest of collection get called
      const serverDoc = await serverDB.getDoc<T>(this.endpoint, this.id)
      return serverDoc
    }
  }

  /**
   *  Stream live updates from a server (where supported)
   *  Just returns the doc when not supported
   */
  stream(): Observable<T & DBDoc> {
    const { serverDB } = this.clients
    if (serverDB.streamDoc) {
      return serverDB.streamDoc<T>(`${this.endpoint}/${this.id}`)
    } else {
      return new Observable<T & DBDoc>((subscriber) => {
        this.get('server').then((res) => {
          subscriber.next(res)
          subscriber.complete()
        })
      })
    }
  }

  /**
   * Save data to the document. Will automatically populate with metadata including
   * `_created`, `_id`, `_modified` and `_deleted` fields
   * @param data - specified data in any format.
   * If contains metadata fields (e.g. `_id`)
   * then this will be used instead of generated id
   */
  async set(data: T, options?: { keep_modified_timestamp: boolean }) {
    const { serverDB, cacheDB } = this.clients
    const dbDoc: DBDoc = this._setDocMeta(data, options)
    await serverDB.setDoc(this.endpoint, dbDoc)
    await cacheDB.setDoc(this.endpoint, dbDoc)
  }

  /**
   * Documents are artificially deleted by moving to an `_archived` collection, with separate entries
   * for a metadata summary and the raw doc. This is required so that other users can sync deleted docs
   * and delete from their own caches accordingly.
   * TODO - add rules to restrict access to archive full docs, and schedule for permanent deletion
   * TODO - let a user restore their own archived docs
   */
  async delete() {
    const { serverDB, serverCacheDB } = this.clients
    const doc = (await this.get()) as any
    await serverDB.setDoc(`_archived/${this.endpoint}/summary`, {
      _archived: new Date().toISOString(),
      _id: this.id,
      _createdBy: doc._createdBy || null,
    })
    await serverDB.setDoc(`_archived/${this.endpoint}/docs`, doc)
    await serverDB.deleteDoc(this.endpoint, this.id)
    await serverCacheDB.deleteDoc(this.endpoint, this.id)
  }

  batchDoc(data: any) {
    return this._setDocMeta(data)
  }

  private _setDocMeta(data: any = {}, options: any = {}): DBDoc {
    const d = data
    const o = options
    const modifiedTimestamp = o.keep_modified_timestamp
      ? d._modified
      : new Date().toISOString()

    return {
      ...d,
      _created: d._created ? d._created : new Date().toISOString(),
      _deleted: d._deleted ? d._deleted : false,
      _id: this.id,
      _modified: modifiedTimestamp,
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
