import type { AggregationsStore } from 'src/stores/Aggregations/aggregations.store'
import { useCommonStores } from '../'

export const isUserVerified = (userId: string) => {
  const { aggregationsStore } = useCommonStores().stores
  return isUserVerifiedWithStore(userId, aggregationsStore)
}

/**
 * For use within class based components which
 * are not compatible with hooks.
 * https://reactjs.org/docs/hooks-intro.html
 */
export const isUserVerifiedWithStore = (
  userId: string,
  store: AggregationsStore,
) => store.aggregations.users_verified?.[userId]
