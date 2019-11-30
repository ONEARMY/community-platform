import { IDBEndpoint, DBDoc } from 'src/models/common.models'
import Dexie from 'dexie'
import { DBQueryOptions, DBQueryWhereOptions, AbstractDBClient } from '../types'
import { DB_QUERY_DEFAULTS } from '../utils/db.utils'

/**
 * Update the cache number either when making changes to db architecture
 * or busting cache on db. This is used as the Dexie version number, see:
 * https://dexie.org/docs/Tutorial/Design#database-versioning
 */
const DB_CACHE_NUMBER = 20191130
const CACHE_DB_NAME = 'OneArmyCache'
const db = new Dexie(CACHE_DB_NAME)

export class DexieClient implements AbstractDBClient {
  constructor() {
    this._addErrorHandler()
    this._dbInit(DB_CACHE_NUMBER, DEXIE_SCHEMA)
  }

  /************************************************************************
   *  Main Methods - taken from abstract class
   ***********************************************************************/
  getDoc<T>(endpoint: IDBEndpoint, docId: string) {
    return db.table<T & DBDoc>(endpoint).get(docId)
  }
  setDoc(endpoint: IDBEndpoint, doc: DBDoc) {
    return db.table(endpoint).put(doc)
  }
  setBulkDocs(endpoint: IDBEndpoint, docs: DBDoc[]) {
    return db.table(endpoint).bulkPut(docs)
  }
  getCollection<T>(endpoint: IDBEndpoint) {
    return db.table<T & DBDoc>(endpoint).toArray()
  }
  queryCollection<T>(endpoint: IDBEndpoint, queryOpts: DBQueryOptions) {
    return this._processQuery<T>(endpoint, queryOpts)
  }

  /************************************************************************
   *  Additional Methods - specific only to dexie
   ***********************************************************************/
  getLatestDoc<T>(endpoint: IDBEndpoint) {
    return db
      .table<T & DBDoc>(endpoint)
      .orderBy('_modified')
      .last()
  }

  // mapping to generate firebase query from standard db queryOpts
  private async _processQuery<T>(
    endpoint: IDBEndpoint,
    queryOpts: DBQueryOptions,
  ) {
    const query = { ...DB_QUERY_DEFAULTS, queryOpts }
    const { limit, orderBy, order, where } = query
    // all queries sent with a common list of conditions
    const table = db.table<T>(endpoint)
    const filtered = where
      ? this._generateQueryWhereRef(table, where)
      : table.toCollection()
    const directed = order === 'desc' ? filtered.reverse() : filtered
    // as sortBy is a manual operation specify all other criteria first
    const sorted = await directed.sortBy(orderBy!)
    return limit ? sorted.slice(0, limit) : sorted
  }

  private _generateQueryWhereRef<T>(
    ref: Dexie.Table<T, any>,
    whereOpts: DBQueryWhereOptions,
  ) {
    const { field, operator, value } = whereOpts
    switch (operator) {
      case '<':
        return ref.where(field).above(value)
      case '==':
        return ref.where(field).equals(value)
      case '>':
        return ref.where(field).below(value)
      default:
        throw new Error('mapping has not been created for dexie query')
    }
  }

  /************************************************************************
   *  Initialisation and error handling - specific only to dexie
   ***********************************************************************/

  /**
   * By default errors from Dexie during initialisation are thrown globally
   * Catch case where new DB defined and old definition removed, delete old
   * db and just start with new clean version
   *
   * NOTE - to avoid these errors legacy db caches need to be defined
   * with corresponding upgrade functions (see below method TODO)
   */
  private _addErrorHandler() {
    window.addEventListener('unhandledrejection', async err => {
      if (err.reason && err.reason.name) {
        switch (err.reason.name) {
          case Dexie.errnames.OpenFailed:
            await Dexie.delete(CACHE_DB_NAME).catch(() => location.reload())
            return location.reload()
          default:
            throw err
        }
      }
    })
  }
  /**
   * initialise the database with versioning and schema
   * @param version - Version number used to handle changes
   * to db architecture or cache-busting.
   * See https://dexie.org/docs/Tutorial/Design#database-versioning
   * @param schema - Database schema for corresponding version
   *
   * NOTE - default behaviour is to clear old db on update to allow cache busting
   * TODO - allow specification of upgrade functions for incremental upgrades instead
   * of cache-busting
   */
  private _dbInit(version: number, schema: { [key: string]: string | null }) {
    db.version(version).stores(schema)
  }
}
/************************************************************************
 *  Interfaces and constants
 ***********************************************************************/
// When dexie is initialised it requires explicit knowledge of the database structures and any keys to
// index on. The below interface and constant ensures this is done for the current db api version
type IDexieSchema = { [key in IDBEndpoint]: string }

// by default _id will serve as primary key and additional index created on _modified for faster querying
const DEFAULT_SCHEMA = '_id,_modified'

const DEXIE_SCHEMA: IDexieSchema = {
  v2_events: `${DEFAULT_SCHEMA},slug`,
  v2_howtos: `${DEFAULT_SCHEMA},slug`,
  v2_mappins: DEFAULT_SCHEMA,
  v2_tags: DEFAULT_SCHEMA,
  v2_users: DEFAULT_SCHEMA,
}
