import { makeAutoObservable, observable } from 'mobx'
import { createContext, useContext } from 'react'
import { useCommonStores } from 'src/index'
import type { IDBEndpoint } from 'src/models'
import type { DatabaseV2 } from 'src/stores/databaseV2'

export class AdminStoreV2 {
  @observable
  public admins: any[] = []

  private db: DatabaseV2
  constructor() {
    const { dbV2 } = useCommonStores()
    this.db = dbV2
    makeAutoObservable(this)
  }

  /*********************************************************************************
   *
   *********************************************************************************/
  /** Query database for documents pending moderation */
  public async getPendingApprovals(endpoint: IDBEndpoint) {
    return this.db
      .collection(endpoint)
      .getWhere('moderation', '==', 'awaiting-moderation')
  }

  /**
   * Alt syntax via raw firestore TODO
   * Future proposed implementation that could include pagination and/or multiple queries
   **/
  //  private async queryDBRaw() {
  // const db = (dbClient.clients.serverDB as FirestoreClient)._raw // <-- will need to be exposed
  // const mappedEndpoint = DB_ENDPOINTS[endpoint]
  // const res = await db
  //   .collection(mappedEndpoint)
  //   .where('moderation', '==', 'awaiting-moderation')
  //   // .limit(10)
  //   .get()
  // return res.docs.map(d => d.data())
  // }
}

/**
 * Export an empty context object to be shared with components
 * The context will be populated with the admin store in the module index
 * (avoids cyclic deps and ensure shared module ready)
 */
export const AdminStoreV2Context = createContext<AdminStoreV2>(null as any)
export const useAdminStoreV2 = () => useContext(AdminStoreV2Context)
