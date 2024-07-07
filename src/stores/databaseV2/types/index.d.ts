/**
 * The summary section should be brief. On a documentation web site,
 * it will be shown on a page that lists summaries for many different
 * API items.  On a detail page for a single item, the summary will be
 * shown followed by the remarks section (if any).
 */
export type {
  AbstractDatabaseClient,
  AbstractDatabaseClientStreamable,
} from './DBClient'

/**
 * The `DBClients` consists of separate databases for use online and offline.
 * Specifically
 * @param cache - An offline-first database, such as Dexie
 * @param server - An online-first database, such as firestore
 * @param serverCacheDB - An additional online-first database used for carrying
 * out more expensive operations which are subsequently cached. This platform
 * uses firebase RTDB to persist specific firestore collection queries and return
 * large collections in a more economical way than firestore
 */
export interface DBClients {
  cacheDB: AbstractDatabaseClient
  serverDB: AbstractDatabaseClientStreamable
  serverCacheDB: AbstractDatabaseClient
}
