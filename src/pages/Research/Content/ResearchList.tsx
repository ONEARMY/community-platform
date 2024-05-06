import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTheme } from '@emotion/react'
import { observer } from 'mobx-react'
import { Button, Loader } from 'oa-components'
import { AuthWrapper } from 'src/common/AuthWrapper'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { logger } from 'src/logger'
import { Box, Flex, Heading } from 'theme-ui'

import { ITEMS_PER_PAGE, RESEARCH_EDITOR_ROLES } from '../constants'
import { listing } from '../labels'
import { ResearchSearchParams, researchService } from '../research.service'
import { ResearchFilterHeader } from './ResearchFilterHeader'
import ResearchListItem from './ResearchListItem'

import type { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore'
import type { ResearchStatus } from 'oa-shared'
import type { IResearch } from 'src/models'
import type { ResearchSortOption } from '../ResearchSortOptions'

const ResearchList = observer(() => {
  const theme = useTheme()
  const { userStore } = useCommonStores().stores
  const [isFetching, setIsFetching] = useState<boolean>(true)
  const [researchItems, setResearchItems] = useState<IResearch.Item[]>([])
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

  useEffect(() => {
    if (!sort) {
      // ensure sort is set
      const params = new URLSearchParams(searchParams.toString())

      if (q) {
        params.set(ResearchSearchParams.sort, 'MostRelevant')
      } else {
        params.set(ResearchSearchParams.sort, 'Newest')
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
        <ResearchFilterHeader />

        <Flex sx={{ justifyContent: ['flex-end', 'flex-end', 'auto'] }}>
          <Box sx={{ width: '100%', display: 'block' }} mb={[3, 3, 0]}>
            <AuthWrapper roleRequired={RESEARCH_EDITOR_ROLES}>
              <Link to={userStore.activeUser ? '/research/create' : '/sign-up'}>
                <Button variant={'primary'} data-cy="create">
                  {listing.create}
                </Button>
              </Link>
            </AuthWrapper>
          </Box>
        </Flex>
      </Flex>

      {researchItems &&
        researchItems.length !== 0 &&
        researchItems.map((item) => {
          return <ResearchListItem key={item._id} item={item} />
        })}

      {!isFetching && researchItems?.length === 0 && (
        <Box sx={{ marginBottom: 5 }}>{listing.noItems}</Box>
      )}

      {!isFetching &&
        researchItems &&
        researchItems.length > 0 &&
        researchItems.length < total && (
          <Flex
            sx={{
              justifyContent: 'center',
            }}
          >
            <Button onClick={() => fetchResearchItems(lastVisible)}>
              {listing.loadMore}
            </Button>
          </Flex>
        )}

      {isFetching && <Loader />}

      <AuthWrapper roleRequired={RESEARCH_EDITOR_ROLES}>
        <Box mb={[3, 3, 0]}>
          <Link to={userStore.activeUser ? '/research/create' : '/sign-up'}>
            <Button variant={'primary'}>{listing.create}</Button>
          </Link>
        </Box>
      </AuthWrapper>
    </>
  )
})
export default ResearchList
