import { SITE } from '../../config/config'
import { DexieClient } from './clients/dexie'
import { FirestoreClient } from './clients/firestore'
import { RealtimeDBClient } from './clients/rtdb'
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
    this.clients = this._getDefaultClients()
  }

  public get clients() {
    return this._clients
  }
  public set clients(clients) {
    this._clients = clients
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
   * Additionally, a 'no-idb' search param can be provided to disable
   * cache-db entirely (triggered from dexie if not supported)
   */
  private _getDefaultClients(): DBClients {
    const serverDB = new FirestoreClient()
    const cacheDB = window.location.search.includes('no-cache')
      ? serverDB
      : new DexieClient()
    const serverCacheDB =
      SITE === 'emulated_site' ? serverDB : new RealtimeDBClient()
    return { cacheDB, serverDB, serverCacheDB }
  }
}
