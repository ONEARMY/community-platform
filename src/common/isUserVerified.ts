import type { AggregationsStore } from 'src/stores/Aggregations/aggregations.store'
import { useCommonStores } from '../'

export const isUserVerified = function (userId: string) {
  const { aggregationsStore } = useCommonStores().stores
  return isUserVerifiedWithStore(userId, aggregationsStore)
}

/**
 * For use within class based components which
 * are not compatible with hooks.
 * https://reactjs.org/docs/hooks-intro.html
 */
export const isUserVerifiedWithStore = function (
  userId: string,
  store: AggregationsStore,
) {
  return store.aggregations.users_verified?.[userId]
}
