import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTheme } from '@emotion/react'
import { observer } from 'mobx-react'
import { Button, Loader } from 'oa-components'
import { AuthWrapper } from 'src/common/AuthWrapper'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { isPreciousPlastic } from 'src/config/config'
import { logger } from 'src/logger'
import DraftButton from 'src/pages/common/Drafts/DraftButton'
import useDrafts from 'src/pages/common/Drafts/useDrafts'
import { Box, Flex, Heading } from 'theme-ui'

import { ITEMS_PER_PAGE, RESEARCH_EDITOR_ROLES } from '../constants'
import { listing } from '../labels'
import { researchService } from '../research.service'
import { ResearchFilterHeader } from './ResearchFilterHeader'
import ResearchListItem from './ResearchListItem'
import { ResearchSearchParams } from './ResearchSearchParams'

import type { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore'
import type { ResearchStatus } from 'oa-shared'
import type { IResearch } from 'src/models'
import type { ResearchSortOption } from '../ResearchSortOptions'

const ResearchList = observer(() => {
  const theme = useTheme()
  const { userStore } = useCommonStores().stores
  const [isFetching, setIsFetching] = useState<boolean>(true)
  const [researchItems, setResearchItems] = useState<IResearch.Item[]>([])
  const { draftCount, isFetchingDrafts, drafts, showDrafts, handleShowDrafts } =
    useDrafts<IResearch.Item>({
      getDraftCount: researchService.getDraftCount,
      getDrafts: researchService.getDrafts,
    })
  const [total, setTotal] = useState<number>(0)
  const [lastVisible, setLastVisible] = useState<
    QueryDocumentSnapshot<DocumentData, DocumentData> | undefined
  >(undefined)

  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get(ResearchSearchParams.q) || ''
  const category = searchParams.get(ResearchSearchParams.category) || ''
  const status = searchParams.get(
    ResearchSearchParams.status,
  ) as ResearchStatus | null
  const sort = searchParams.get(ResearchSearchParams.sort) as ResearchSortOption
  const showResearchItems =
    !showDrafts && researchItems && researchItems.length !== 0

  useEffect(() => {
    if (!sort) {
      // ensure sort is set
      const params = new URLSearchParams(searchParams.toString())

      if (q) {
        params.set(ResearchSearchParams.sort, 'MostRelevant')
      } else {
        params.set(ResearchSearchParams.sort, 'LatestUpdated')
      }
      setSearchParams(params)
    } else {
      // search only when sort is set (avoids duplicate requests)
      fetchResearchItems()
    }
  }, [q, category, status, sort])

  const fetchResearchItems = async (
    skipFrom?: QueryDocumentSnapshot<DocumentData, DocumentData>,
  ) => {
    setIsFetching(true)

    try {
      const searchWords = q ? q.toLocaleLowerCase().split(' ') : []

      const result = await researchService.search(
        searchWords,
        category,
        sort,
        status,
        skipFrom,
        ITEMS_PER_PAGE,
      )

      if (skipFrom) {
        // if skipFrom is set, means we are requesting another page that should be appended
        setResearchItems((items) => [...items, ...result.items])
      } else {
        setResearchItems(result.items)
      }

      setLastVisible(result.lastVisible)

      setTotal(result.total)
    } catch (error) {
      logger.error('error fetching research items', error)
    }

    setIsFetching(false)
  }

  return (
    <>
      <Flex my={[18, 26]}>
        <Heading
          as="h1"
          sx={{
            width: '100%',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: theme.fontSizes[5],
          }}
        >
          {listing.heading}
        </Heading>
      </Flex>

      <Flex
        sx={{
          flexWrap: 'nowrap',
          justifyContent: 'space-between',
          flexDirection: ['column', 'column', 'row'],
          mb: 3,
        }}
      >
        {!showDrafts ? <ResearchFilterHeader /> : <div></div>}

        <Flex sx={{ gap: 2 }} mb={[3, 3, 0]}>
          {isPreciousPlastic() ? (
            <>
              {userStore.activeUser && (
                <DraftButton
                  showDrafts={showDrafts}
                  draftCount={draftCount}
                  handleShowDrafts={handleShowDrafts}
                />
              )}
              <Link to={userStore.activeUser ? '/research/create' : '/sign-up'}>
                <Button type="button" variant="primary" data-cy="create">
                  {listing.create}
                </Button>
              </Link>
            </>
          ) : (
            <AuthWrapper roleRequired={RESEARCH_EDITOR_ROLES}>
              <DraftButton
                showDrafts={showDrafts}
                draftCount={draftCount}
                handleShowDrafts={handleShowDrafts}
              />
              <Link to="/research/create">
                <Button type="button" variant="primary" data-cy="create">
                  {listing.create}
                </Button>
              </Link>
            </AuthWrapper>
          )}
        </Flex>
      </Flex>

      <Flex
        as="ul"
        sx={{
          flexDirection: 'column',
          margin: 0,
          padding: 0,
          paddingBottom: 3,
          listStyle: 'none',
          gap: 3,
        }}
      >
        {showDrafts &&
          drafts.map((item) => <ResearchListItem key={item._id} item={item} />)}

        {showResearchItems &&
          researchItems.map((item) => (
            <ResearchListItem key={item._id} item={item} />
          ))}

        {!isFetching && researchItems?.length === 0 && (
          <Box sx={{ marginBottom: 5 }}>{listing.noItems}</Box>
        )}
      </Flex>

      {!isFetching &&
        researchItems &&
        researchItems.length > 0 &&
        researchItems.length < total && (
          <Flex
            sx={{
              justifyContent: 'center',
            }}
          >
            <Button
              type="button"
              onClick={() => fetchResearchItems(lastVisible)}
            >
              {listing.loadMore}
            </Button>
          </Flex>
        )}

      {(isFetching || isFetchingDrafts) && <Loader />}
    </>
  )
})
export default ResearchList
