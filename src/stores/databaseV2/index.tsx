import { DexieClient } from './clients/dexie'
import { FirestoreClient } from './clients/firestore'
import { RealtimeDBClient } from './clients/rtdb'
import type { DBClients } from './types'

import type { DBEndpoint } from './endpoints'
import { DB_ENDPOINTS } from './endpoints'
import { CollectionReference } from './CollectionReference'
import { AbstractDatabase } from './AbstractDatabase'
import { SITE } from '../../config/config'

/**
 * Main Database class
 */
export class DatabaseV2 extends AbstractDatabase {
  constructor(clients?: DBClients) {
    super(clients)

    if (!clients) this.clients = this._getDefaultClients()
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
