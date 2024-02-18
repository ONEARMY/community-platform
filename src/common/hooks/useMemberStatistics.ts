import { useEffect, useState } from 'react'

import { useCommonStores } from './useCommonStores'

import type { AggregationsStore } from 'src/stores/Aggregations/aggregations.store'

export const useMemberStatistics = (userId: string) => {
  const { aggregationsStore } = useCommonStores().stores
  const [totalUseful, setTotalUseful] = useState<number>(0)
  const [verified, setVerified] = useState<boolean>(false)

  useEffect(() => {
    const getUseful = async () => {
      const useful = await getUserTotalUseful(userId, aggregationsStore)
      setTotalUseful(useful)
    }
    const getVerified = async () => {
      const verified = await isVerified(userId, aggregationsStore)
      setVerified(verified)
    }
    getUseful()
    getVerified()
    return () => {
      // cleanup
    }
  }, [userId])

  return { verified: verified, totalUseful: totalUseful }
}

const isVerified = async (
  id: string,
  aggregationsStore: AggregationsStore,
): Promise<boolean> => {
  return (await aggregationsStore.aggregations.users_verified?.[id]) ?? false
}

const getUserTotalUseful = async (
  id: string,
  aggregationsStore: AggregationsStore,
): Promise<number> => {
  await aggregationsStore.updateAggregation('users_totalUseful')
  const totalUseful = await aggregationsStore.getAggregationValue(
    'users_totalUseful',
    id,
  )
  return totalUseful || 0
}
