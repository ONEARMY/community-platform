import { useEffect, useState } from 'react'

import { getUserCountry } from '../../utils/getUserCountry'
import { useCommonStores } from './useCommonStores'

import type { Collaborator } from '../../models/common.models'

export const useContributorsData = (collaborators: string[]) => {
  const { userStore } = useCommonStores().stores

  const [contributors, setContributors] = useState<Collaborator[]>([])

  useEffect(() => {
    const fetchContributorsData = async () => {
      if (collaborators?.length > 0) {
        const contributorsData = await Promise.all(
          collaborators.map(async (c) => {
            const user = await userStore.getUserByUsername(c)

            return {
              userName: c,
              isVerified: false,
              countryCode: user ? getUserCountry(user) : '',
            }
          }),
        )
        setContributors(contributorsData)
      }
    }
    fetchContributorsData()
  }, [collaborators])

  return contributors
}
