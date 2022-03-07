import { action, makeAutoObservable, observable } from 'mobx'
import { Subscription } from 'rxjs'
import { RootStore } from '..'
import { DatabaseV2 } from '../databaseV2'

/**
 * List of existing aggregation docs
 * TODO - refactor to shared list (search targetDocId)
 */
const AGGREGATION_DOC_IDS = [
  'users_votedUsefulHowtos',
  'users_verified',
] as const

// Utility types generated from list of aggregation docs ids
type IAggregationId = typeof AGGREGATION_DOC_IDS[number]
type IAggregations = { [aggregationId in IAggregationId]: any }

/** Aggregation subscriptions default close after 5 minutes */
const DEFAULT_TIMEOUT = 1000 * 60 * 5

/**
 * The aggregation store provides access to various aggregation endpoints, created as a means to cheaply
 * retrieve data collated across entire collections as single documents
 */
export class AggregationsStore {
  /** Observable list of all aggregations by id */
  @observable aggregations: IAggregations

  private db: DatabaseV2
  private subscriptions$: { [aggregationId: string]: Subscription } = {}
  private timeouts$: {
    [aggregationId: string]: NodeJS.Timeout
  } = {}

  constructor(rootStore: RootStore) {
    this.db = rootStore.dbV2
    // initialisise all aggregations as empty documents by default
    const aggregations: any = {}
    for (const targetDocId of AGGREGATION_DOC_IDS) {
      aggregations[targetDocId] = {}
    }
    this.aggregations = aggregations
    makeAutoObservable(this, { aggregations: observable })
  }

  @action
  private updateAggregationValue(aggregationId: IAggregationId, value: any) {
    this.aggregations[aggregationId] = value
  }

  /**
   * Subscribe to updates to a particularly aggregation. Includes a default timeout so that subscriptions are not
   * left hanging too much longer than required, but at the same time are not repeatedly created to re-fetch same data
   */
  public updateAggregation(
    aggregationId: IAggregationId,
    timeoutDuration = DEFAULT_TIMEOUT,
  ) {
    if (!this.subscriptions$.hasOwnProperty(aggregationId)) {
      const subscription = this.db
        .collection('aggregations')
        .doc(aggregationId)
        .stream()
        .subscribe(value => {
          if (value) {
            this.updateAggregationValue(aggregationId, value)
          }
        })
      this.subscriptions$[aggregationId] = subscription
    }
    this.setSubscriptionTimeout(aggregationId, timeoutDuration)
  }

  /**
   * Use window timeout methods to handle termination of subscriptions. Setting a new timeout on an
   * existing subscription will simply extend the time it is maintained for
   */
  private setSubscriptionTimeout(
    aggregationId: IAggregationId,
    timeoutDuration: number,
  ) {
    // remove any existing timeout
    if (this.timeouts$.hasOwnProperty(aggregationId)) {
      clearTimeout(this.timeouts$[aggregationId])
    }
    // add timeout to unsubscribe
    this.timeouts$[aggregationId] = setTimeout(() => {
      return this.clearSubscription(aggregationId)
    }, timeoutDuration)
  }

  private clearSubscription(aggregationId: IAggregationId) {
    if (this.subscriptions$.hasOwnProperty(aggregationId)) {
      this.subscriptions$[aggregationId].unsubscribe()
      delete this.subscriptions$[aggregationId]
    }
  }
}
