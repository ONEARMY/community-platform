import { useEffect, useState } from 'react'

import { useCommonStores } from '../../../common/hooks/useCommonStores'

import type { FetchState } from '../../../models'

type Props<T> = {
  getDraftCount: (userId: string) => Promise<number>
  getDrafts: (userId: string) => Promise<T[]>
}

const useDrafts = <T,>({ getDraftCount, getDrafts }: Props<T>) => {
  const { userStore } = useCommonStores().stores

  const [draftCount, setDraftCount] = useState<number>(0)
  const [drafts, setDrafts] = useState<T[]>([])
  const [showDrafts, setShowDrafts] = useState<boolean>(false)
  const [fetchingDrafts, setFetchingDrafts] = useState<FetchState>('idle')

  useEffect(() => {
    const fetchDraftCount = async () => {
      if (userStore.user?._id) {
        const count = await getDraftCount(userStore.user!._id)

        setDraftCount(count)
      }
    }
    fetchDraftCount()
  }, [userStore.user?._id])

  const handleShowDrafts = async () => {
    setShowDrafts((showDrafts) => !showDrafts)

    if (fetchingDrafts !== 'idle') {
      return
    }

    setFetchingDrafts('fetching')

    const items = await getDrafts(userStore.user!._id)
    setDrafts(items)

    setFetchingDrafts('completed')
  }

  return {
    handleShowDrafts,
    isFetchingDrafts: fetchingDrafts === 'fetching',
    showDrafts,
    drafts,
    draftCount,
  }
}

export default useDrafts
