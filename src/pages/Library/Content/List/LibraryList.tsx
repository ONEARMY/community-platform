import { useEffect, useState } from 'react'
import { useSearchParams } from '@remix-run/react'
import { observer } from 'mobx-react'
import { Button, Loader, MoreContainer } from 'oa-components'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { logger } from 'src/logger'
import useDrafts from 'src/pages/common/Drafts/useDrafts'
import { Flex, Grid, Heading } from 'theme-ui'

import { ITEMS_PER_PAGE } from '../../constants'
import { listing } from '../../labels'
import { LibrarySearchParams, libraryService } from '../../library.service'
import { LibraryCard } from './LibraryCard'
import { LibraryListHeader } from './LibraryListHeader'

import type { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore'
import type { ILibrary } from 'oa-shared'
import type { LibrarySortOption } from './LibrarySortOptions'

export const LibraryList = observer(() => {
  const siteName = import.meta.env.VITE_SITE_NAME

  const { userStore } = useCommonStores().stores
  const [isFetching, setIsFetching] = useState<boolean>(true)
  const [library, setLibrary] = useState<ILibrary.Item[]>([])
  const [total, setTotal] = useState<number>(0)
  const [lastVisible, setLastVisible] = useState<
    QueryDocumentSnapshot<DocumentData, DocumentData> | undefined
  >(undefined)
  const { draftCount, isFetchingDrafts, drafts, showDrafts, handleShowDrafts } =
    useDrafts<ILibrary.Item>({
      getDraftCount: libraryService.getDraftCount,
      getDrafts: libraryService.getDrafts,
    })

  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get(LibrarySearchParams.q) || ''
  const category = searchParams.get(LibrarySearchParams.category) || ''
  const sort = searchParams.get(LibrarySearchParams.sort) as LibrarySortOption

  useEffect(() => {
    if (!sort) {
      // ensure sort is set
      const params = new URLSearchParams(searchParams.toString())

      if (q) {
        params.set(LibrarySearchParams.sort, 'MostRelevant')
      } else {
        params.set(LibrarySearchParams.sort, 'Newest')
      }
      setSearchParams(params)
    } else {
      // search only when sort is set (avoids duplicate requests)
      fetchLibrary()
    }
  }, [q, category, sort])

  const fetchLibrary = async (
    skipFrom?: QueryDocumentSnapshot<DocumentData, DocumentData>,
  ) => {
    setIsFetching(true)

    try {
      const searchWords = q ? q.toLocaleLowerCase().split(' ') : []

      const result = await libraryService.search(
        searchWords,
        category,
        sort,
        userStore.activeUser || undefined,
        skipFrom,
        ITEMS_PER_PAGE,
      )

      if (skipFrom) {
        // if skipFrom is set, means we are requesting another page that should be appended
        setLibrary((library) => [...library, ...result.items])
      } else {
        setLibrary(result.items)
      }

      setLastVisible(result.lastVisible)

      setTotal(result.total)
    } catch (error) {
      logger.error('error fetching library', error)
    }

    setIsFetching(false)
  }

  const showLoadMore =
    !isFetching &&
    !showDrafts &&
    library &&
    library.length > 0 &&
    library.length < total

  return (
    <Flex sx={{ flexDirection: 'column', gap: [2, 3] }}>
      <LibraryListHeader
        draftCount={draftCount}
        handleShowDrafts={handleShowDrafts}
        showDrafts={showDrafts}
      />

      <Grid
        columns={[1, 2, 2, 3]}
        data-cy="howtolist-flex-container"
        gap={[2, 3, 4]}
        sx={{ paddingTop: 1, marginBottom: 3 }}
      >
        {showDrafts ? (
          drafts.map((item) => {
            return <LibraryCard key={item._id} item={item} />
          })
        ) : (
          <>
            {library &&
              library.length > 0 &&
              library.map((item, index) => (
                <LibraryCard key={index} item={item} />
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
          <Button type="button" onClick={() => fetchLibrary(lastVisible)}>
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
            Contribute to the {siteName} library,
            <br />
            share your project.
          </Heading>
        </Flex>
      </MoreContainer>
    </Flex>
  )
})
