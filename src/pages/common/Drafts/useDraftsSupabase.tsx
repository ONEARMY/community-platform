import { useContext, useEffect, useState } from 'react'

import { SessionContext } from '../SessionContext'

import type { FetchState } from 'oa-shared'

type Props<T> = {
  getDraftCount: () => Promise<number>
  getDrafts: () => Promise<T[]>
}

const useDrafts = <T,>({ getDraftCount, getDrafts }: Props<T>) => {
  const session = useContext(SessionContext)

  const [draftCount, setDraftCount] = useState<number>(0)
  const [drafts, setDrafts] = useState<T[]>([])
  const [showDrafts, setShowDrafts] = useState<boolean>(false)
  const [fetchingDrafts, setFetchingDrafts] = useState<FetchState>('idle')

  useEffect(() => {
    const fetchDraftCount = async () => {
      if (session?.id) {
        const count = await getDraftCount()

        setDraftCount(count)
      }
    }
    fetchDraftCount()
  }, [session?.id])

  const handleShowDrafts = async () => {
    setShowDrafts((showDrafts) => !showDrafts)

    if (fetchingDrafts !== 'idle') {
      return
    }

    setFetchingDrafts('fetching')

    const items = await getDrafts()
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
