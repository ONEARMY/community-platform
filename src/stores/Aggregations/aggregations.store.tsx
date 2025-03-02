import type { DatabaseV2 } from '../databaseV2/DatabaseV2'
import type { IRootStore } from '../RootStore'

type VerifiedUsers = { [userName: string]: boolean }

/**
 * The aggregation store provides access to various aggregation endpoints, created as a means to cheaply
 * retrieve data collated across entire collections as single documents
 */
export class AggregationsStore {
  private db: DatabaseV2
  private users_verified: VerifiedUsers = {}

  constructor(rootStore: IRootStore) {
    this.db = rootStore.dbV2

    // Update verified users on initial load. use timeout to ensure aggregation store initialised
    setTimeout(() => {
      this.updateVerifiedUsers()
    }, 50)
  }

  public isVerified(userName: string) {
    return this.users_verified?.[userName]
  }

  public async updateVerifiedUsers() {
    const subscription = this.db
      .collection<VerifiedUsers>('aggregations')
      .doc('users_verified')
      .stream()
      .subscribe((value) => {
        this.users_verified = value
        subscription.unsubscribe()
      })
  }
}
