import { useEffect, useState } from 'react'
import { useSearchParams } from '@remix-run/react'
import { Button, Loader } from 'oa-components'
import { logger } from 'src/logger'
import useDrafts from 'src/pages/common/Drafts/useDraftsSupabase'
import { Box, Flex } from 'theme-ui'

import { listing } from '../labels'
import { researchService } from '../research.service'
import { ResearchFilterHeader } from './ResearchListHeader'
import ResearchListItem from './ResearchListItem'
import { ResearchSearchParams } from './ResearchSearchParams'

import type { ResearchStatus } from 'oa-shared'
import type { ResearchItem } from 'src/models/research.model'
import type { ResearchSortOption } from '../ResearchSortOptions'

const ResearchList = () => {
  const [isFetching, setIsFetching] = useState<boolean>(true)
  const [researchItems, setResearchItems] = useState<ResearchItem[]>([])
  const { draftCount, isFetchingDrafts, drafts, showDrafts, handleShowDrafts } =
    useDrafts<ResearchItem>({
      getDraftCount: researchService.getDraftCount,
      getDrafts: researchService.getDrafts,
    })
  const [total, setTotal] = useState<number>(0)

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
        params.set(ResearchSearchParams.sort, 'LatestUpdated')
      }
      setSearchParams(params)
    } else {
      // search only when sort is set (avoids duplicate requests)
      fetchResearchItems()
    }
  }, [q, category, status, sort])

  const fetchResearchItems = async (skip: number = 0) => {
    setIsFetching(true)

    try {
      const result = await researchService.search(
        q?.toLocaleLowerCase(),
        category,
        sort,
        status,
        skip,
      )

      if (result) {
        if (skip) {
          // if skipFrom is set, means we are requesting another page that should be appended
          setResearchItems((questions) => [...questions, ...result.items])
        } else {
          setResearchItems(result.items)
        }

        setTotal(result.total)
      }
    } catch (error) {
      logger.error('error fetching research items', error)
    }

    setIsFetching(false)
  }

  return (
    <Flex sx={{ flexDirection: 'column', gap: [2, 3] }}>
      <ResearchFilterHeader
        draftCount={draftCount}
        handleShowDrafts={handleShowDrafts}
        showDrafts={showDrafts}
      />

      {showDrafts ? (
        <ul
          style={{ listStyle: 'none', padding: 0, margin: 0 }}
          data-cy="ResearchList"
        >
          {drafts.map((item) => {
            return <ResearchListItem key={item.id} item={item} />
          })}
        </ul>
      ) : (
        <>
          {researchItems && researchItems.length !== 0 && (
            <ul
              style={{ listStyle: 'none', padding: 0, margin: 0 }}
              data-cy="ResearchList"
            >
              {researchItems.map((item) => (
                <ResearchListItem key={item.id} item={item} />
              ))}
            </ul>
          )}

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
                <Button
                  type="button"
                  data-cy="loadMoreButton"
                  onClick={() => fetchResearchItems(researchItems.length)}
                >
                  {listing.loadMore}
                </Button>
              </Flex>
            )}
        </>
      )}

      {(isFetching || isFetchingDrafts) && <Loader />}
    </Flex>
  )
}

export default ResearchList
