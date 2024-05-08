import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { observer } from 'mobx-react'
import { Button, Loader, MoreContainer } from 'oa-components'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { logger } from 'src/logger'
import { Box, Flex, Grid, Heading } from 'theme-ui'

import { ITEMS_PER_PAGE } from '../../constants'
import { howtoService, HowtosSearchParams } from '../../howto.service'
import { listing } from '../../labels'
import HowToCard from './HowToCard'
import { HowtoFilterHeader } from './HowtoFilterHeader'

import type { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore'
import type { IHowto } from 'src/models'
import type { HowtoSortOption } from './HowtoSortOptions'

export const HowtoList = observer(() => {
  const { themeStore, userStore } = useCommonStores().stores
  const theme = themeStore.currentTheme
  const [isFetching, setIsFetching] = useState<boolean>(true)
  const [howtos, setHowtos] = useState<IHowto[]>([])
  const [total, setTotal] = useState<number>(0)
  const [lastVisible, setLastVisible] = useState<
    QueryDocumentSnapshot<DocumentData, DocumentData> | undefined
  >(undefined)

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

  return (
    <Box>
      <Flex sx={{ paddingTop: [10, 26], paddingBottom: [10, 26] }}>
        <Heading
          sx={{
            marginX: 'auto',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 5,
          }}
        >
          {theme && theme.howtoHeading}
        </Heading>
      </Flex>
      <Flex
        sx={{
          flexWrap: 'nowrap',
          justifyContent: 'space-between',
          flexDirection: ['column', 'column', 'row'],
        }}
      >
        <HowtoFilterHeader />
        <Flex sx={{ justifyContent: ['flex-end', 'flex-end', 'auto'] }}>
          <Link to={userStore!.user ? '/how-to/create' : '/sign-up'}>
            <Box sx={{ width: '100%', display: 'block' }} mb={[3, 3, 0]}>
              <Button
                sx={{ width: '100%' }}
                variant={'primary'}
                data-cy="create"
              >
                {listing.create}
              </Button>
            </Box>
          </Link>
        </Flex>
      </Flex>

      <Grid
        columns={[1, 2, 2, 3]}
        data-cy="howtolist-flex-container"
        gap={4}
        sx={{ paddingTop: 1, marginBottom: 3 }}
      >
        {howtos &&
          howtos.length > 0 &&
          howtos.map((howto, index) => <HowToCard key={index} howto={howto} />)}
      </Grid>

      {!isFetching && howtos && howtos.length > 0 && howtos.length < total && (
        <Flex
          sx={{
            justifyContent: 'center',
          }}
        >
          <Button onClick={() => fetchHowtos(lastVisible)}>
            {listing.loadMore}
          </Button>
        </Flex>
      )}
      {isFetching && <Loader />}

      <MoreContainer m={'0 auto'} pt={60} pb={90}>
        <Flex sx={{ alignItems: 'center', flexDirection: 'column' }} mt={5}>
          <Heading sx={{ textAlign: 'center' }}>
            Inspire the {theme.siteName} world.
            <br />
            Share your how-to!
          </Heading>
        </Flex>
      </MoreContainer>
    </Box>
  )
})
