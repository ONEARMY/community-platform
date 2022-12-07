import { useCommonStores } from '../'

export const isUserVerified = function (userId: string) {
  const { aggregationsStore } = useCommonStores().stores
  return aggregationsStore.aggregations.users_verified?.[userId]
}
