import React, { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { observer } from 'mobx-react'
import { Button, Loader, MoreContainer } from 'oa-components'
import { AuthWrapper } from 'src/common/AuthWrapper'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { SortFilterHeader } from 'src/pages/common/SortFilterHeader/SortFilterHeader'
import { Box, Flex, Grid, Heading } from 'theme-ui'

import HowToCard from './HowToCard'

import type { IHowto } from 'src/models'

export const HowtoList = observer(() => {
  const { howtoStore, themeStore, tagsStore, userStore } =
    useCommonStores().stores
  const previousSearch = useRef<string>('')
  const location = useLocation()

  useEffect(() => {
    if (!new RegExp(/source=how-to-not-found/).test(window.location.search)) {
      howtoStore.updateReferrerSource('')
    }

    syncUrlWithStorage()

    return () => {
      howtoStore.updateSearchValue('')
      howtoStore.updateSelectedCategory('')
    }
  }, [])

  useEffect(() => {
    if (location.search !== previousSearch.current) {
      syncUrlWithStorage()
    }
  }, [location.search])

  const syncUrlWithStorage = () => {
    previousSearch.current = location.search

    const searchParams = new URLSearchParams(location?.search ?? '')

    const categoryQuery = searchParams.get('category')?.toString() ?? ''
    howtoStore.updateSelectedCategory(categoryQuery)

    const searchQuery = searchParams.get('search')?.toString() ?? ''
    howtoStore.updateSearchValue(searchQuery)

    const referrerSource = searchParams.get('source')?.toString()
    if (referrerSource) {
      howtoStore.updateReferrerSource(referrerSource)
    }
  }

  const { filteredHowtos, selectedCategory, searchValue, referrerSource } =
    howtoStore
  const theme = themeStore?.currentTheme
  const { allTagsByKey } = tagsStore

  const howtoItems = filteredHowtos.map((howto: IHowto) => ({
    ...howto,
    tagList:
      howto.tags &&
      Object.keys(howto.tags)
        .map((key) => allTagsByKey[key])
        .filter(Boolean),
  }))

  return (
    <Box>
      <Flex sx={{ paddingTop: [10, 26], paddingBottom: [10, 26] }}>
        {referrerSource ? (
          <Box sx={{ width: '100%' }}>
            <Heading
              sx={{
                marginX: 'auto',
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: 5,
              }}
              mt={20}
            >
              The page you were looking for was moved or doesn't exist.
            </Heading>
            <Heading
              sx={{
                textAlign: 'center',
                fontSize: 1,
              }}
              mt={3}
              mb={10}
            >
              Search all of our how-to's below
            </Heading>
          </Box>
        ) : (
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
        )}
      </Flex>
      <Flex
        sx={{
          flexWrap: 'nowrap',
          justifyContent: 'space-between',
          flexDirection: ['column', 'column', 'row'],
        }}
      >
        <SortFilterHeader store={howtoStore} type="how-to" />
        <Flex sx={{ justifyContent: ['flex-end', 'flex-end', 'auto'] }}>
          <Link to={userStore!.user ? '/how-to/create' : '/sign-up'}>
            <Box sx={{ width: '100%', display: 'block' }} mb={[3, 3, 0]}>
              <Button
                sx={{ width: '100%' }}
                variant={'primary'}
                data-cy="create"
              >
                Create a How-to
              </Button>
            </Box>
          </Link>
        </Flex>
      </Flex>
      <React.Fragment>
        {howtoItems.length === 0 && (
          <Flex>
            <Heading
              sx={{
                width: '100%',
                textAlign: 'center',
              }}
            >
              {searchValue.length === 0 && selectedCategory.length === 0 ? (
                <Loader />
              ) : (
                'No how-tos to show'
              )}
            </Heading>
          </Flex>
        )}
        <Grid
          columns={[1, 2, 2, 3]}
          data-cy="howtolist-flex-container"
          gap={4}
          sx={{ paddingTop: 1 }}
        >
          {howtoItems.map((howto: any, index) => (
            <HowToCard
              howto={howto}
              votedUsefulCount={(howto.votedUsefulBy || []).length}
              key={index}
            />
          ))}
        </Grid>
        <Flex sx={{ justifyContent: 'center' }} mt={20}>
          <Link to={'#'} style={{ visibility: 'hidden' }}>
            <Button variant={'secondary'} data-cy="more-how-tos">
              More how-tos
            </Button>
          </Link>
        </Flex>
        <MoreContainer m={'0 auto'} pt={60} pb={90}>
          <Flex sx={{ alignItems: 'center', flexDirection: 'column' }} mt={5}>
            <Heading sx={{ textAlign: 'center' }}>
              Inspire the {theme.siteName} world.
              <br />
              Share your how-to!
            </Heading>
            <AuthWrapper>
              <Link to={'/how-to/create'}>
                <Button variant="primary" mt={30}>
                  Create a how-to
                </Button>
              </Link>
            </AuthWrapper>
          </Flex>
        </MoreContainer>
      </React.Fragment>
    </Box>
  )
})
