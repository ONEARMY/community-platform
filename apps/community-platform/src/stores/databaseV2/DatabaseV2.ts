import { SITE } from '../../config/config'
import { isTestEnvironment } from '../../utils/isTestEnvironment'
import { DexieClient } from './clients/DexieClient'
import { FirestoreClient } from './clients/FirestoreClient'
import { RealtimeDatabaseClient } from './clients/RealtimeDatabaseClient'
import { CollectionReference } from './CollectionReference'
import { DB_ENDPOINTS } from './endpoints'

import type { DBEndpoint } from './endpoints'
import type { DBClients } from './types'

/**
 * Main Database class
 */
export class DatabaseV2 {
  private _clients: DBClients

  constructor() {
    const useBrowserCacheDb =
      !window.location.search.includes('no-cache') || !isTestEnvironment

    this._clients = this._getDefaultClients(useBrowserCacheDb)
  }

  public get clients() {
    return this._clients
  }

  /**
   * Provide a reference to a collection which can then be retrieved or used to
   * access specific documents.
   * @param endpoint - the name of the collection as found in the database
   */
  collection<T>(endpoint: DBEndpoint) {
    // use mapped endpoint to allow custom db endpoint prefixes
    const mappedEndpoint = DB_ENDPOINTS[endpoint]
    return new CollectionReference<T>(mappedEndpoint, this.clients)
  }

  /**
   * By default 3 databases are provided (cache, server, server-cache)
   * Additionally, a 'no-cache' search param can be provided to disable
   * cache-db entirely (triggered from dexie if not supported)
   * @param useBrowserCacheDb - whether to use Dexie (indexdb)
   */
  private _getDefaultClients(useBrowserCacheDb: boolean): DBClients {
    const serverDB = new FirestoreClient()
    const cacheDB = useBrowserCacheDb ? new DexieClient() : serverDB
    const serverCacheDB =
      SITE === 'emulated_site' ? serverDB : new RealtimeDatabaseClient()
    return { cacheDB, serverDB, serverCacheDB }
  }
}
