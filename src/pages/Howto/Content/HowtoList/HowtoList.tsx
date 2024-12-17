import { useEffect, useState } from 'react'
import { useSearchParams } from '@remix-run/react'
import { observer } from 'mobx-react'
import { Button, Loader, MoreContainer } from 'oa-components'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { logger } from 'src/logger'
import useDrafts from 'src/pages/common/Drafts/useDrafts'
import { Flex, Grid, Heading } from 'theme-ui'

import { ITEMS_PER_PAGE } from '../../constants'
import { howtoService, HowtosSearchParams } from '../../howto.service'
import { listing } from '../../labels'
import HowToCard from './HowToCard'
import { HowtoFilterHeader } from './HowtoFilterHeader'

import type { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore'
import type { IHowto } from 'oa-shared'
import type { HowtoSortOption } from './HowtoSortOptions'

export const HowtoList = observer(() => {
  const siteName = import.meta.env.VITE_SITE_NAME

  const { userStore } = useCommonStores().stores
  const [isFetching, setIsFetching] = useState<boolean>(true)
  const [howtos, setHowtos] = useState<IHowto[]>([])
  const [total, setTotal] = useState<number>(0)
  const [lastVisible, setLastVisible] = useState<
    QueryDocumentSnapshot<DocumentData, DocumentData> | undefined
  >(undefined)
  const { draftCount, isFetchingDrafts, drafts, showDrafts, handleShowDrafts } =
    useDrafts<IHowto>({
      getDraftCount: howtoService.getDraftCount,
      getDrafts: howtoService.getDrafts,
    })

  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get(HowtosSearchParams.q) || ''
  const category = searchParams.get(HowtosSearchParams.category) || ''
  const sort = searchParams.get(HowtosSearchParams.sort) as HowtoSortOption

  useEffect(() => {
    if (!sort) {
      // ensure sort is set
      const params = new URLSearchParams(searchParams.toString())

      if (q) {
        params.set(HowtosSearchParams.sort, 'MostRelevant')
      } else {
        params.set(HowtosSearchParams.sort, 'Newest')
      }
      setSearchParams(params)
    } else {
      // search only when sort is set (avoids duplicate requests)
      fetchHowtos()
    }
  }, [q, category, sort])

  const fetchHowtos = async (
    skipFrom?: QueryDocumentSnapshot<DocumentData, DocumentData>,
  ) => {
    setIsFetching(true)

    try {
      const searchWords = q ? q.toLocaleLowerCase().split(' ') : []

      const result = await howtoService.search(
        searchWords,
        category,
        sort,
        userStore.activeUser || undefined,
        skipFrom,
        ITEMS_PER_PAGE,
      )

      if (skipFrom) {
        // if skipFrom is set, means we are requesting another page that should be appended
        setHowtos((howtos) => [...howtos, ...result.items])
      } else {
        setHowtos(result.items)
      }

      setLastVisible(result.lastVisible)

      setTotal(result.total)
    } catch (error) {
      logger.error('error fetching howtos', error)
    }

    setIsFetching(false)
  }

  const showLoadMore =
    !isFetching &&
    !showDrafts &&
    howtos &&
    howtos.length > 0 &&
    howtos.length < total

  return (
    <Flex sx={{ flexDirection: 'column', gap: [2, 3] }}>
      <HowtoFilterHeader
        draftCount={draftCount}
        handleShowDrafts={handleShowDrafts}
        showDrafts={showDrafts}
      />

      <Grid
        columns={[1, 2, 2, 3]}
        data-cy="howtolist-flex-container"
        gap={4}
        sx={{ paddingTop: 1, marginBottom: 3 }}
      >
        {showDrafts ? (
          drafts.map((item) => {
            return <HowToCard key={item._id} howto={item} />
          })
        ) : (
          <>
            {howtos &&
              howtos.length > 0 &&
              howtos.map((howto, index) => (
                <HowToCard key={index} howto={howto} />
              ))}
          </>
        )}
      </Grid>

      {showLoadMore && (
        <Flex
          sx={{
            justifyContent: 'center',
          }}
        >
          <Button type="button" onClick={() => fetchHowtos(lastVisible)}>
            {listing.loadMore}
          </Button>
        </Flex>
      )}

      {(isFetching || isFetchingDrafts) && <Loader />}

      <MoreContainer
        sx={{
          paddingTop: [20, 70],
          paddingBottom: [40, 90],
          paddingX: 80,
          alignSelf: 'center',
        }}
      >
        <Flex sx={{ alignItems: 'center', flexDirection: 'column' }}>
          <Heading as="p" sx={{ textAlign: 'center', maxWidth: '500px' }}>
            Inspire the {siteName} world. Share your how-to!
          </Heading>
        </Flex>
      </MoreContainer>
    </Flex>
  )
})
