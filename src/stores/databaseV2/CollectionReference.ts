import { Observable } from 'rxjs'

import { logger } from '../../logger'
import { DocReference } from './DocReference'

import type { Observer } from 'rxjs'
import type {
  DBClients,
  DBDoc,
  DBQueryWhereOperator,
  DBQueryWhereValue,
} from './types'
import type { AbstractDatabaseClientStreamable } from './types/AbstractDatabaseClient'

export class CollectionReference<T> {
  constructor(private endpoint: string, private clients: DBClients) {}

  /**
   * Provide a reference to a document to perform operations, such as getting or setting data
   * @param docID - provide an id for a specific doc, or leave blank to generate a new one
   */
  doc(docID?: string) {
    return new DocReference<T>(this.endpoint, docID, this.clients)
  }

  /**
   * Sync all documents in a collection to local indexeddb cache
   * This will attempt to be as efficient as possible, prioritising fetching data from:
   *
   * 1. Existing cached docs
   * 2. Server snapshots (if no cache exists)
   * 3. Server (querying only docs modified more recently than most recent cached doc)
   *
   * NOTE - to use this docs must have an `_modified` property
   *
   * @param onUpdate - callback function triggered when data is received.
   * This is triggered with the full set of documents (existing + update)
   * @param options.keepAlive - specify whether to keep sync open for live server
   * updates (default terminates after retrieval)
   */
  syncLocally(
    onUpdate: (value: (T & DBDoc)[]) => void,
    options: { keepAlive: boolean } = { keepAlive: false },
  ) {
    logger.debug('CollectionReference.syncStart', this.endpoint)
    const totals: any = {}
    const { cacheDB, serverCacheDB } = this.clients
    // HACK - typescript not correctly providing type from destructured
    const serverDB = this.clients.serverDB as AbstractDatabaseClientStreamable

    const endpoint = this.endpoint
    const observer: Observable<(T & DBDoc)[]> = Observable.create(
      async (obs: Observer<(T & DBDoc)[]>) => {
        // 1. Emit cached collection
        const cached = await cacheDB.getCollection<T>(endpoint)
        totals.cached = cached.length
        obs.next(cached)
        if (cached.length === 0) {
          // 2. If no cache, populate using large query db
          const serverCache = await serverCacheDB.getCollection<T>(endpoint)
          totals.serverCache = serverCache.length
          await cacheDB.setBulkDocs(endpoint, serverCache)
          obs.next(serverCache)
        }
        // 3. get any newer docs from regular server db, merge with cache and emit
        const latest = await this._getCacheLastModified(endpoint)
        const server$ = serverDB
          .streamCollection(endpoint, {
            orderBy: '_modified',
            order: 'asc',
            where: {
              field: '_modified',
              operator: '>',
              value: latest,
            },
          })
          .subscribe(async (updates) => {
            logger.debug(
              'CollectionReference.syncRes',
              this.endpoint,
              updates.length,
            )
            if (!options.keepAlive) {
              server$.unsubscribe()
              logger.debug('CollectionReference.syncEnd', this.endpoint)
            }
            totals.live = updates.length
            await cacheDB.setBulkDocs(endpoint, updates)
            const allDocs = await cacheDB.getCollection<T>(endpoint)
            obs.next(allDocs)
          })
      },
    )
    const subscription = observer.subscribe((value) => onUpdate(value))
    return subscription
  }

  /**
   * Set multiple docs in a collection in batch.
   * NOTE - to set an individual doc a reference to that doc should be generated instead
   * i.e. `db.collection('users').doc('myUsername').set(data)`
   * @param docs - The collection of docs to set
   */
  async set(docs: any[]) {
    const { cacheDB, serverDB } = this.clients
    const dbDocs: DBDoc[] = docs.map((d) =>
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
    limit?: number,
  ) {
    const { serverDB, cacheDB } = this.clients
    logger.debug('CollectionReference.getWhere', { field, operator, value })
    let docs = await serverDB.queryCollection<T>(this.endpoint, {
      where: { field, operator, value },
      limit,
    })

    // if not found on live try find on cached (might be offline)
    // use catch as not all endpoints are cached or some might not be indexed
    if (docs.length === 0) {
      try {
        docs = await cacheDB.queryCollection<T>(this.endpoint, {
          where: { field, operator, value },
          limit,
        })
      } catch (error) {
        logger.error(
          error.message ||
            'CollectionReference.error querying cached collection',
        )
        // at least we can say we tried...
      }
    }
    return docs
  }

  private async _getCacheLastModified(endpoint: string) {
    const { cacheDB } = this.clients
    const latest = await cacheDB.queryCollection(endpoint, {
      orderBy: '_modified',
      order: 'desc',
      limit: 1,
    })
    return latest && latest.length > 0 ? latest[0]._modified : ''
  }
}
