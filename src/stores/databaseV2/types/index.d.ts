/**
 * The summary section should be brief. On a documentation web site,
 * it will be shown on a page that lists summaries for many different
 * API items.  On a detail page for a single item, the summary will be
 * shown followed by the remarks section (if any).
 */
import { Observable } from 'rxjs'
export abstract class AbstractDatabase {
  /**
   * Gets a `CollectionReference` instance that refers to the collection at
   * the specified path.
   *
   * @param clients pass a `DBClients` object to specify what to use as
   * server and cache dbs. Uses a default configuration if not specified
   */
  constructor(clients?: DBClients)
  /**
   * Gets a `CollectionReference` instance that refers to the collection at
   * the specified path.
   *
   * @param endpoint The collection/table path name
   * @return The `CollectionReference` instance.
   */
  collection(endpoint: DBEndpoint): CollectionReference
}

export class CollectionReference {
  /**
   * The `clients` is passed to collection references so that the collection
   * has full access to required db client methods (e.g. server and cache)
   */
  private constructor(endpoint: DBEndpoint, clients: DBClients)

  /**
   *
   * @param docID pass a `docID` to provide a reference to a specific database document
   * Leaving blank will generate a new id
   */
  doc(docID?: string): DocReference
}

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
  cacheDB: AbstractDBClient
  serverDB: AbstractDBClient
  serverCacheDB: AbstractDBClient
}

export abstract class AbstractDBClient {
  getDoc<T>(endpoint: string, docId: string): Promise<(T & DBDoc) | undefined>

  setDoc(endpoint: string, doc: any): Promise<void>

  setBulkDocs(endpoint: string, docs: any): Promise<void>

  getCollection<T>(endpoint: string): Promise<(T & DBDoc)[]>

  queryCollection<T>(
    endpoint: string,
    queryOpts: DBQueryOptions,
  ): Promise<(T & DBDoc)[]>

  streamCollection?<T>(
    endpoint: string,
    queryOpts?: DBQueryOptions,
  ): Observable<(T & DBDoc)[]>

  streamDoc?<T>(endpoint: string): Observable<T & DBDoc>

  deleteDoc(endpoint: string, docId: string): Promise<void>
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
