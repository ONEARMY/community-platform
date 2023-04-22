import { useState, useEffect } from 'react'
import { useCommonStores } from '../index'
import type { IUserPP } from 'src/models/userPreciousPlastic.models'
import type { AggregationsStore } from 'src/stores/Aggregations/aggregations.store'

export const useUserUsefulCount = (user: IUserPP) => {
  const { aggregationsStore } = useCommonStores().stores
  const [totalUsefulVotes, setTotalUsefulVotes] = useState<number>(0)

  useEffect(() => {
    const getUsefulCount = async () => {
      const count = await getUserUsefulCount(user, aggregationsStore)
      setTotalUsefulVotes(count)
    }
    getUsefulCount()
    return () => {}
  }, [user])

  return totalUsefulVotes
}

const getUserUsefulCount = async (
  user: IUserPP,
  aggregationsStore: AggregationsStore,
): Promise<number> => {
  const contentTypes = ['Howtos', 'Research']

  const usefulCounts: number[] = contentTypes.map((type) => {
    const userContent = user?.stats?.[`userCreated${type}`]
    const usefulVotes =
      aggregationsStore.aggregations[`users_votedUseful${type}`]

    if (userContent && usefulVotes) {
      return Object.keys(usefulVotes)
        .filter((key) => Object.keys(userContent).includes(key))
        .map((key) => usefulVotes[key])
        .reduce((acc, cur) => acc + cur, 0)
    } else {
      return 0
    }
  })
  return usefulCounts.reduce((acc, cur) => acc + cur, 0)
}
