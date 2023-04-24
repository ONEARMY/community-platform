import { useState, useEffect } from 'react'
import { useCommonStores } from '../index'
import type { IUserPP } from 'src/models/userPreciousPlastic.models'
import type { AggregationsStore } from 'src/stores/Aggregations/aggregations.store'
import { SITE, DEV_SITE_ROLE } from 'src/config/config'

const isBetaTesterDevEnv = () => {
  // if running dev or preview site allow user-overridden permissions (ignoring db user role)
  if (
    process.env.NODE_ENV !== 'test' &&
    (SITE === 'dev_site' || SITE === 'preview')
  ) {
    if (DEV_SITE_ROLE) {
      return DEV_SITE_ROLE === 'beta-tester'
    }
  }
}

export const useUserUsefulCount = (user: IUserPP) => {
  const { userStore } = useCommonStores().stores
  const isBetaTester = userStore.user?.userRoles?.includes('beta-tester')

  // TODO: This is only temporary while aggregations gets fixed,
  // remove all code related after
  if (!(isBetaTesterDevEnv() || isBetaTester)) return 0

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
