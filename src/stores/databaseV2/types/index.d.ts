/**
 * The summary section should be brief. On a documentation web site,
 * it will be shown on a page that lists summaries for many different
 * API items.  On a detail page for a single item, the summary will be
 * shown followed by the remarks section (if any).
 */
export type { AbstractDatabaseClient } from './DBClient'

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
  serverDB: AbstractDatabaseClient
  serverCacheDB: AbstractDatabaseClient
}

/**
 * @remarks
 * The `DBDoc` metadata is automatically popuplated to every document that
 * goes into the database to allow for easier querying and management
 */
export interface DBDoc {
  _id: string
  _created: ISODateString
  _modified: ISODateString
  _deleted: boolean
}

export interface DBQueryOptions {
  order?: 'asc' | 'desc'
  orderBy?: string
  limit?: number
  where?: DBQueryWhereOptions
}
export interface DBQueryWhereOptions {
  field: string
  operator: DBQueryWhereOperator
  value: DBQueryWhereValue
}
export type DBQueryWhereOperator = '>' | '<' | '==' | 'array-contains'
export type DBQueryWhereValue = string | number

/**
 * @remarks
 * A reminder that dates should be saved in the ISOString format
 * i.e. new Date().toISOString() => 2011-10-05T14:48:00.000Z
 * This is more consistent than others and allows better querying
 */
export type ISODateString = string
