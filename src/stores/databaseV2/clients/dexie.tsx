import Dexie from 'dexie'
import type { DBDoc, IDBEndpoint } from 'src/models/common.models'
import { logger } from '../../../logger'
import { DB_ENDPOINTS } from '../endpoints'
import type {
  AbstractDatabaseClient,
  DBAggregationQuery,
  DBQueryOptions,
  DBQueryWhereOptions,
} from '../types'
import { DB_QUERY_DEFAULTS } from '../utils/db.utils'
import type { IHowtoDB, IResearchDB } from 'src/models'

/**
 * Update the cache number either when making changes to db architecture
 * or busting cache on db. This is used as the Dexie version number, see:
 * https://dexie.org/docs/Tutorial/Design#database-versioning
 */
const DB_CACHE_NUMBER = 20230105
const CACHE_DB_NAME = 'OneArmyCache'
const db = new Dexie(CACHE_DB_NAME)

export class DexieClient implements AbstractDatabaseClient {
  constructor() {
    this._init()
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
  updateDoc(endpoint: IDBEndpoint, doc: DBDoc) {
    const { _id, ...updateValues } = doc
    logger.debug('updateValues', updateValues)
    return db.table(endpoint).update(_id, updateValues)
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

  calculateAggregation(id: string, aggregation: DBAggregationQuery) {
    return this._processCalculateAggregation(id, aggregation)
  }

  deleteDoc(endpoint: IDBEndpoint, docId: string) {
    return db.table(endpoint).delete(docId)
  }

  /************************************************************************
   *  Additional Methods - specific only to dexie
   ***********************************************************************/
  getLatestDoc<T>(endpoint: IDBEndpoint) {
    return db.table<T & DBDoc>(endpoint).orderBy('_modified').last()
  }

  // mapping to generate firebase query from standard db queryOpts
  private _processQuery<T>(
    endpoint: IDBEndpoint,
    queryOpts: DBQueryOptions,
  ): Promise<(T & DBDoc)[]> {
    return new Promise((resolve, reject) => {
      const query = { ...DB_QUERY_DEFAULTS, ...queryOpts }
      const { limit, orderBy, order, where } = query
      // all queries sent with a common list of conditions
      const table = db.table<T>(endpoint)
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

  private async _processCalculateAggregation(
    id: string,
    aggregation: DBAggregationQuery,
  ): Promise<number | undefined> {
    if (aggregation === 'useful_count') {
      let totalUseful = 0

      // Fetch total howto useful
      const howtoTable = db.table<IHowtoDB>('howtos')
      const howtoUseful = await howtoTable
        .where({ _createdBy: id })
        .toArray()
        .then((docs) => {
          let useful = 0
          for (let i = 0; i < docs.length; i++) {
            const doc = docs[i]
            useful += doc.votedUsefulCount ?? 0
          }
          return useful
        })
        .catch((err) => logger.error(err))

      if (howtoUseful) totalUseful += howtoUseful

      // Fetch total research useful

      const researchTable = db.table<IResearchDB>('research')
      const userResearch = {}

      await researchTable
        .where({ _createdBy: id })
        .toArray()
        .then((docs) => {
          for (let i = 0; i < docs.length; i++) {
            const doc = docs[i]
            if (doc.votedUsefulCount)
              userResearch[doc._id] = doc.votedUsefulCount
          }
        })
        .catch((err) => logger.error(err))

      await researchTable
        .where({ collaborators: id })
        .toArray()
        .then((docs) => {
          for (let i = 0; i < docs.length; i++) {
            const doc = docs[i]
            if (doc.votedUsefulCount)
              userResearch[doc._id] = doc.votedUsefulCount
          }
        })
        .catch((err) => logger.error(err))

      const useful: number[] = Object.values(userResearch)
      totalUseful += useful.reduce((a, b) => a + b)

      return totalUseful
    }

    return
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
    this._dbInit(DB_CACHE_NUMBER, DEXIE_SCHEMA)
    // test open db, catch errors for upgrade version not defined or
    // idb not supported
    db.open().catch(async (err) => {
      logger.error(err)
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
    db.version(version).stores(schema)
  }
}
/************************************************************************
 *  Interfaces and constants
 ***********************************************************************/
// Frontend code does not access all database endpoints, exclude here
type IFrontendEndpoints = Exclude<IDBEndpoint, 'user_notifications'>

// When dexie is initialised it requires explicit knowledge of the database structures and any keys to
// index on. The below interface and constant ensures this is done for the current db api version
type IDexieSchema = { [key in IFrontendEndpoints]: string }

// by default _id will serve as primary key and additional index created on _modified for faster querying
const DEFAULT_SCHEMA = '_id,_modified'

const SCHEMA_BASE: IDexieSchema = {
  events: `${DEFAULT_SCHEMA},slug`,
  howtos: `${DEFAULT_SCHEMA},slug,previousSlugs`,
  mappins: DEFAULT_SCHEMA,
  tags: DEFAULT_SCHEMA,
  categories: DEFAULT_SCHEMA,
  researchCategories: DEFAULT_SCHEMA,
  users: `${DEFAULT_SCHEMA},_authID`,
  research: `${DEFAULT_SCHEMA},slug,previousSlugs`,
  aggregations: `${DEFAULT_SCHEMA}`,
  emails: `${DEFAULT_SCHEMA}`,
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
 *
 *
 *
 *
 *
 *
 *
 *
 ****************************************************************************/
