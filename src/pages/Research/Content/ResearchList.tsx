import { useEffect, useState } from 'react'
import { Link, useSearchParams } from '@remix-run/react'
import { observer } from 'mobx-react'
import { Button, Loader } from 'oa-components'
import { AuthWrapper } from 'src/common/AuthWrapper'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { isPreciousPlastic } from 'src/config/config'
import { logger } from 'src/logger'
import DraftButton from 'src/pages/common/Drafts/DraftButton'
import useDrafts from 'src/pages/common/Drafts/useDrafts'
import { Box, Flex, Heading, useThemeUI } from 'theme-ui'

import { ITEMS_PER_PAGE, RESEARCH_EDITOR_ROLES } from '../constants'
import { listing } from '../labels'
import { researchService } from '../research.service'
import { ResearchFilterHeader } from './ResearchFilterHeader'
import ResearchListItem from './ResearchListItem'
import { ResearchSearchParams } from './ResearchSearchParams'

import type { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore'
import type { IResearch, ResearchStatus } from 'oa-shared'
import type { ThemeWithName } from 'oa-themes'
import type { ResearchSortOption } from '../ResearchSortOptions'

const ResearchList = observer(() => {
  const themeUi = useThemeUI()
  const theme = themeUi.theme as ThemeWithName
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

      {showDrafts ? (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {drafts.map((item) => {
            return <ResearchListItem key={item._id} item={item} />
          })}
        </ul>
      ) : (
        <>
          {researchItems && researchItems.length !== 0 && (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {researchItems.map((item) => (
                <ResearchListItem key={item._id} item={item} />
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
                  onClick={() => fetchResearchItems(lastVisible)}
                >
                  {listing.loadMore}
                </Button>
              </Flex>
            )}
        </>
      )}

      {(isFetching || isFetchingDrafts) && <Loader />}
    </>
  )
})
export default ResearchList
