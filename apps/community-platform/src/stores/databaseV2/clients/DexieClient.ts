import Dexie from 'dexie'

import { logger } from '../../../logger'
import { DB_ENDPOINTS } from '../endpoints'
import { getQueryOptions } from '../utils/getQueryOptions'

import type { IndexableType } from 'dexie'
import type { DBDoc, IDBEndpoint } from 'src/models/common.models'
import type {
  AbstractDatabaseClient,
  DBQueryOptions,
  DBQueryWhereOptions,
} from '../types'

/**
 * Update the cache number either when making changes to db architecture
 * or busting cache on this._db. This is used as the Dexie version number, see:
 * https://dexie.org/docs/Tutorial/Design#database-versioning
 */
const DB_CACHE_NUMBER = 20231224
const CACHE_DB_NAME = 'OneArmyCache'

export class DexieClient implements AbstractDatabaseClient {
  private _db: Dexie
  constructor() {
    this._db = new Dexie(CACHE_DB_NAME)
    this._dbInit(DB_CACHE_NUMBER, DEXIE_SCHEMA)
    this._init()
  }

  /************************************************************************
   *  Main Methods - taken from abstract class
   ***********************************************************************/
  getDoc<T>(endpoint: IDBEndpoint, docId: string) {
    logger.debug('dexie.getDoc', { endpoint, docId })
    return this._db.table<T & DBDoc>(endpoint).get(docId)
  }
  setDoc(endpoint: IDBEndpoint, doc: DBDoc) {
    logger.debug('dexie.setDoc', { endpoint, doc })
    return this._db.table(endpoint).put(doc)
  }
  updateDoc(endpoint: IDBEndpoint, doc: DBDoc) {
    const { _id, ...updateValues } = doc
    logger.debug('dexie.updateValues', updateValues)
    return this._db.table(endpoint).update(_id, updateValues)
  }
  setBulkDocs(endpoint: IDBEndpoint, docs: DBDoc[]) {
    logger.debug('dexie.setBulkDocs', { endpoint, docs })
    return this._db.table(endpoint).bulkPut(docs)
  }
  getCollection<T>(endpoint: IDBEndpoint) {
    logger.debug('dexie.getCollection', { endpoint })
    return this._db.table<T & DBDoc>(endpoint).toArray()
  }
  queryCollection<T>(endpoint: IDBEndpoint, queryOpts: DBQueryOptions) {
    logger.debug('dexie.queryCollection', { endpoint, queryOpts })
    return this._processQuery<T>(endpoint, queryOpts)
  }

  deleteDoc(endpoint: IDBEndpoint, docId: string) {
    logger.debug('dexie.deleteDoc', { endpoint, docId })
    return this._db.table(endpoint).delete(docId)
  }

  /************************************************************************
   *  Additional Methods - specific only to dexie
   ***********************************************************************/
  getLatestDoc<T>(endpoint: IDBEndpoint) {
    return this._db.table<T & DBDoc>(endpoint).orderBy('_modified').last()
  }

  // mapping to generate firebase query from standard db queryOpts
  private _processQuery<T>(
    endpoint: IDBEndpoint,
    queryOpts: DBQueryOptions,
  ): Promise<(T & DBDoc)[]> {
    return new Promise((resolve, reject) => {
      const query = getQueryOptions(queryOpts)
      const { limit, orderBy, order, where } = query
      // all queries sent with a common list of conditions
      const table = this._db.table<T>(endpoint)
      const filtered = where
        ? this._generateQueryWhereRef(table, where)
        : table.toCollection()
      const directed = order === 'desc' ? filtered.reverse() : filtered
      // as sortBy is a manual operation specify all other criteria first
      directed
        .sortBy(orderBy!)
        .then((sorted) => {
          resolve(limit ? (sorted.slice(0, limit) as any) : sorted)
        })
        // error will be thrown if index doesn't exist, simply pass up the chain
        .catch((err) => {
          reject(err)
        })
    })
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
        return ref.where(field).equals(value as IndexableType)
      case '!=':
        return ref.where(field).notEqual(value as IndexableType)
      case '>':
        return ref.where(field).below(value)
      case 'array-contains':
        return ref.where(field).equals(value as IndexableType)
      default:
        logger.error('no dexie query mapping for ' + operator)
        throw new Error(
          'mapping has not been created for dexie query: ' + operator,
        )
    }
  }

  /************************************************************************
   *  Initialisation and error handling - specific only to dexie
   ***********************************************************************/

  private _init() {
    const { location } = window
    // test open db, catch errors for upgrade version not defined or
    // idb not supported
    this._db.open().catch(async (err) => {
      // logger.error('Failed to open DB', err.inner)
      // NOTE - invalid state error suggests dexie not supported, so
      // try reloading with cachedb disabled (see db index for implementation)
      if (err.name === Dexie.errnames.InvalidState) {
        if (err.inner.name === Dexie.errnames.InvalidState) {
          location.replace(location.href + '?no-cache')
        }
      }
      // NOTE - upgrade error can be avoided by defining legacy db caches
      // with corresponding upgrade functions (see below method TODO)
      if (err.name === Dexie.errnames.Upgrade) {
        await Dexie.delete(CACHE_DB_NAME).catch(() => location.reload())
        return location.reload()
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
    try {
      this._db.version(version).stores(schema)
    } catch (err) {
      logger.error('Failed to initialise DB', err)
    }
  }
}
/************************************************************************
 *  Interfaces and constants
 ***********************************************************************/
// Frontend code does not access all database endpoints, exclude here
type IFrontendEndpoints = Exclude<
  IDBEndpoint,
  'user_notifications' | 'user_integrations'
>

// When dexie is initialised it requires explicit knowledge of the database structures and any keys to
// index on. The below interface and constant ensures this is done for the current db api version
type IDexieSchema = { [key in IFrontendEndpoints]: string }

// by default _id will serve as primary key and additional index created on _modified for faster querying
const DEFAULT_SCHEMA = '_id,_modified'

const SCHEMA_BASE: IDexieSchema = {
  howtos: `${DEFAULT_SCHEMA},_createdBy,slug,previousSlugs`,
  mappins: DEFAULT_SCHEMA,
  messages: `${DEFAULT_SCHEMA}`,
  tags: DEFAULT_SCHEMA,
  categories: DEFAULT_SCHEMA,
  researchCategories: DEFAULT_SCHEMA,
  users: `${DEFAULT_SCHEMA},_authID`,
  research: `${DEFAULT_SCHEMA},_createdBy,slug,previousSlugs,*collaborators`,
  aggregations: `${DEFAULT_SCHEMA}`,
  emails: `${DEFAULT_SCHEMA}`,
  questions: `${DEFAULT_SCHEMA}`,
  questionCategories: `${DEFAULT_SCHEMA}`,
  discussions: `${DEFAULT_SCHEMA},sourceId`,
}

// Ensure dexie also handles any prefixed database schema
const MAPPED_SCHEMA = {} as IDexieSchema
Object.keys(SCHEMA_BASE).forEach(
  (endpoint) =>
    (MAPPED_SCHEMA[DB_ENDPOINTS[endpoint] as IDBEndpoint] =
      SCHEMA_BASE[endpoint]),
)
const DEXIE_SCHEMA = MAPPED_SCHEMA

/*****************************************************************************
 * Schema Changelog
 *
 * 2020-10-13
 * Add _authID to user indexes
 *
 * 2023-04-02
 * Add emails schema
 *
 * 2023-06-18
 * Add collaborators key to research schema + _createdBy to events, howtos & research
 *
 * 2023-06-29
 * Drop events collection
 *
 * 2023-09-24
 * Add question schema
 *
 * 2023-10-22
 * Add message schema
 *
 * 2023-11-01
 * Add question categories
 *
 *
 ****************************************************************************/
