import { useEffect, useState } from 'react'
import { getUserCountry } from 'src/utils/getUserCountry'
import { isUserVerifiedWithStore } from 'src/common/isUserVerified'
import { useCommonStores } from 'src'
import { useResearchStore } from 'src/stores/Research/research.store'
import { runInAction, observable } from 'mobx'
import type { IResearchDB } from 'src/models'

export type IResearchListItem = IResearchDB & {
  author: {
    userName: string
    countryCode?: string
    isVerified?: boolean
  }
}

export const useResearchList = () => {
  const store = useResearchStore()
  const { aggregationsStore, userStore } = useCommonStores().stores
  const [fullResearchListItems, setFullResearchListItems] = useState<
    IResearchListItem[]
  >([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      const items: IResearchListItem[] = observable.array(
        ((await store.getResearchItems()) || [])
          .sort((a, b) => (a._modified < b._modified ? 1 : -1))
          .map((item) => {
            return {
              ...item,
              author: {
                userName: item._createdBy,
              },
            }
          }),
      )
      items.forEach(async (item, idx) => {
        const author = await userStore.getUserByUsername(item._createdBy)
        if (author) {
          runInAction(() => {
            items[idx].author = {
              userName: author.userName,
              countryCode: getUserCountry(author),
              isVerified: isUserVerifiedWithStore(author, aggregationsStore),
            }
          })
        }
      })
      setFullResearchListItems(items)
      setIsLoading(false)
    })()
  }, [store])

  return {
    isLoading,
    fullResearchListItems,
    activeUser: store.activeUser,
  }
}
