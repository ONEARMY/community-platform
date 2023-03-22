import type {
  DBClients,
  DBDoc,
  DBQueryWhereOperator,
  DBQueryWhereValue,
} from './types'
import type { Observer } from 'rxjs'
import { Observable } from 'rxjs'
import { DocReference } from './DocReference'
import { logger } from '../../logger'

export class CollectionReference<T> {
  constructor(private endpoint: string, private clients: DBClients) {}

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
    const totals: any = {}
    const { cacheDB, serverDB, serverCacheDB } = this.clients
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
        serverDB.streamCollection!(endpoint, {
          orderBy: '_modified',
          order: 'asc',
          where: {
            field: '_modified',
            operator: '>',
            value: latest,
          },
        }).subscribe(async (updates) => {
          totals.live = updates.length
          await cacheDB.setBulkDocs(endpoint, updates)
          const allDocs = await cacheDB.getCollection<T>(endpoint)
          obs.next(allDocs)
        })
        // 4. Check for any document deletes, and remove as appropriate
        // Assume archive will have been checked after last updated record sync
        const lastArchive = latest
        serverDB.streamCollection!(`_archived/${endpoint}/summary`, {
          order: 'asc',
          where: { field: '_archived', operator: '>', value: lastArchive },
        }).subscribe(async (docs) => {
          const archiveIds = docs.map((d) => d._id)
          for (const docId of archiveIds) {
            try {
              cacheDB.deleteDoc(endpoint, docId)
            } catch (error) {
              // might already be deleted so ignore error
            }
          }
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
        logger.error(error)
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
