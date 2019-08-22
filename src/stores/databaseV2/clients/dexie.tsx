import { IDBEndpoint, IDbDoc } from 'src/models/common.models'
import Dexie from 'dexie'
import { DBQueryOptions, DBQueryWhereOptions, AbstractDBClient } from '../types'
import { DB_API_VERSION, DB_QUERY_DEFAULTS } from '../utils/db.utils'

const db = new Dexie('OneArmyCache')

export class DexieClient implements AbstractDBClient {
  constructor() {
    // initialise the database with versioning and schema
    db.version(DB_API_VERSION).stores(DEXIE_SCHEMA)
  }
  /************************************************************************
   *  Main Methods - taken from abstract class
   ***********************************************************************/
  getDoc<T>(endpoint: IDBEndpoint, docId: string) {
    return db.table<T & IDbDoc>(endpoint).get(docId)
  }
  setDoc(endpoint: IDBEndpoint, doc: IDbDoc) {
    return db.table(endpoint).put(doc)
  }
  setBulkDocs(endpoint: IDBEndpoint, docs: IDbDoc[]) {
    return db.table(endpoint).bulkPut(docs)
  }
  getCollection<T>(endpoint: IDBEndpoint) {
    return db.table<T & IDbDoc>(endpoint).toArray()
  }
  queryCollection<T>(endpoint: IDBEndpoint, queryOpts: DBQueryOptions) {
    return this._processQuery<T>(endpoint, queryOpts)
  }

  /************************************************************************
   *  Additional Methods - specific only to dexie
   ***********************************************************************/
  getLatestDoc<T>(endpoint: IDBEndpoint) {
    return db
      .table<T & IDbDoc>(endpoint)
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
  v2_discussions: DEFAULT_SCHEMA,
  v2_events: `${DEFAULT_SCHEMA},slug`,
  v2_howtos: `${DEFAULT_SCHEMA},slug`,
  v2_mappins: DEFAULT_SCHEMA,
  v2_tags: DEFAULT_SCHEMA,
  v2_users: DEFAULT_SCHEMA,
}
