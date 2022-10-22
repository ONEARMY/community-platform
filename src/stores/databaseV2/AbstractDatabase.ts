import type { CollectionReference } from './CollectionReference'
import type { DBEndpoint } from './endpoints'
import type { DBClients } from './types'

export abstract class AbstractDatabase {
  private _clients: DBClients

  /**
   * Gets a `CollectionReference` instance that refers to the collection at
   * the specified path.
   *
   * @param clients pass a `DBClients` object to specify what to use as
   * server and cache dbs. Uses a default configuration if not specified
   */
  constructor(clients?: DBClients) {
    if (clients) this._clients = clients
  }

  public get clients() {
    return this._clients
  }
  public set clients(clients) {
    this._clients = clients
  }

  /**
   * Gets a `CollectionReference` instance that refers to the collection at
   * the specified path.
   *
   * @param endpoint The collection/table path name
   * @return The `CollectionReference` instance.
   */
  abstract collection<T>(endpoint: DBEndpoint): CollectionReference<T>
}
