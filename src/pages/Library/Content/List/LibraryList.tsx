import { useEffect, useState } from 'react'
import { useSearchParams } from '@remix-run/react'
import { Button, Loader, MoreContainer } from 'oa-components'
import { logger } from 'src/logger'
import useDrafts from 'src/pages/common/Drafts/useDraftsSupabase'
import { Flex, Grid, Heading } from 'theme-ui'

import { listing } from '../../labels'
import { LibrarySearchParams, libraryService } from '../../library.service'
import { LibraryListHeader } from './LibraryListHeader'
import { ProjectCard } from './ProjectCard'

import type { Project } from 'oa-shared'
import type { LibrarySortOption } from './LibrarySortOptions'

const siteName = import.meta.env.VITE_SITE_NAME

export const LibraryList = () => {
  const [isFetching, setIsFetching] = useState<boolean>(true)
  const [projects, setProjects] = useState<Project[]>([])
  const [total, setTotal] = useState<number>(0)
  const { draftCount, isFetchingDrafts, drafts, showDrafts, handleShowDrafts } =
    useDrafts<Project>({
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
      fetchProjects()
    }
  }, [q, category, sort])

  const fetchProjects = async (skip: number = 0) => {
    setIsFetching(true)

    try {
      const result = await libraryService.search(
        q?.toLocaleLowerCase(),
        category,
        sort,
        skip,
      )

      if (result) {
        if (skip) {
          // if skipFrom is set, means we are requesting another page that should be appended
          setProjects((items) => [...items, ...result.items])
        } else {
          setProjects(result.items)
        }

        setTotal(result.total)
      }
    } catch (error) {
      logger.error('error fetching library', error)
    }

    setIsFetching(false)
  }

  const showLoadMore =
    !isFetching &&
    !showDrafts &&
    projects &&
    projects.length > 0 &&
    projects.length < total

  return (
    <Flex sx={{ flexDirection: 'column', gap: [2, 3] }}>
      <LibraryListHeader
        draftCount={draftCount}
        handleShowDrafts={handleShowDrafts}
        showDrafts={showDrafts}
      />

      <Grid
        columns={[1, 2, 2, 3]}
        gap={[2, 3, 4]}
        sx={{ paddingTop: 1, marginBottom: 3 }}
      >
        {showDrafts ? (
          drafts.map((item) => {
            return <ProjectCard key={item.id} item={item} />
          })
        ) : (
          <>
            {projects &&
              projects.length > 0 &&
              projects.map((item, index) => (
                <ProjectCard key={index} item={item} query={q} />
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
          <Button type="button" onClick={() => fetchProjects(projects.length)}>
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
}
