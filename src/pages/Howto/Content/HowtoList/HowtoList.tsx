import { inject, observer } from 'mobx-react'
import * as React from 'react'
import { AuthWrapper } from 'src/common/AuthWrapper'
import { Button, MoreContainer, Loader } from 'oa-components'
import { Heading, Input, Flex, Box } from 'theme-ui'
import TagsSelect from 'src/components/Tags/TagsSelect'
import { VirtualizedFlex } from 'src/pages/Howto/VirtualizedFlex/VirtualizedFlex'
import type { HowtoStore } from 'src/stores/Howto/howto.store'
import type { UserStore } from 'src/stores/User/user.store'
import HowToCard from './HowToCard'
import SortSelect from './SortSelect'
import type { ThemeStore } from 'src/stores/Theme/theme.store'
import type { AggregationsStore } from 'src/stores/Aggregations/aggregations.store'
import type { TagsStore } from 'src/stores/Tags/tags.store'
import { CategoriesSelect } from 'src/pages/Howto/Category/CategoriesSelect'
import { Link } from 'react-router-dom'

interface InjectedProps {
  howtoStore: HowtoStore
  userStore: UserStore
  themeStore: ThemeStore
  aggregationsStore: AggregationsStore
  tagsStore: TagsStore
}

interface IState {
  isLoading: boolean
  // totalHowtoColumns: number
}

// Update query params for search and tags
const updateQueryParams = (url: string, key: string, val: string) => {
  const newUrl = new URL(url)
  const urlParams = new URLSearchParams(newUrl.search)
  if (val) {
    urlParams.set(key, val)
  } else {
    urlParams.delete(key)
  }
  newUrl.search = urlParams.toString()

  window.history.pushState({ path: newUrl.toString() }, '', newUrl.toString())
}

// First we use the @inject decorator to bind to the howtoStore state
@inject(
  'howtoStore',
  'userStore',
  'themeStore',
  'aggregationsStore',
  'tagsStore',
)
// Then we can use the observer component decorator to automatically tracks observables and re-renders on change
// (note 1, use ! to tell typescript that the store will exist (it's an injected prop))
// (note 2, mobx seems to behave more consistently when observables are referenced outside of render methods)
@observer
export class HowtoList extends React.Component<any, IState> {
  constructor(props: any) {
    super(props)
    this.state = {
      isLoading: true,
    }
    if (props.location.search) {
      const searchParams = new URLSearchParams(props.location.search)

      const tagQuery = searchParams.get('tags')?.toString()
      if (tagQuery) {
        const tags = {}
        tagQuery.split(',').forEach((tag) => {
          tags[tag] = true
        })

        this.props.howtoStore.updateSelectedTags(tags)
      }

      const categoryQuery = searchParams.get('category')?.toString()
      if (categoryQuery) {
        this.props.howtoStore.updateSelectedCategory(categoryQuery)
      }

      const searchQuery = searchParams.get('search')?.toString()
      if (searchQuery) {
        this.injected.howtoStore.updateSearchValue(searchQuery)
      }
      const referrerSource = searchParams.get('source')?.toString()
      if (referrerSource) {
        this.injected.howtoStore.updateReferrerSource(referrerSource)
      }
    }
  }

  get injected() {
    return this.props as InjectedProps
  }

  /* eslint-disable @typescript-eslint/naming-convention*/
  UNSAFE_componentWillMount() {
    if (!new RegExp(/source=how-to-not-found/).test(window.location.search)) {
      this.props.howtoStore.updateReferrerSource('')
    }
  }

  componentWillUnmount(): void {
    this.props.howtoStore.updateSearchValue('')
  }

  public render() {
    const {
      filteredHowtos,
      selectedTags,
      selectedCategory,
      searchValue,
      referrerSource,
    } = this.props.howtoStore

    const theme = this.props?.themeStore?.currentTheme
    const { allTagsByKey } = this.injected.tagsStore
    const { users_votedUsefulHowtos } =
      this.injected.aggregationsStore.aggregations

    const howtoItems = filteredHowtos.map((howto) => ({
      ...howto,
      taglist:
        howto.tags &&
        Object.keys(howto.tags)
          .map((t) => allTagsByKey[t])
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
          <AuthWrapper roleRequired="beta-tester">
            <Flex
              sx={{ width: ['100%', '100%', '20%'] }}
              mb={['10px', '10px', 0]}
              mr={[0, 0, '8px']}
            >
              <CategoriesSelect
                value={selectedCategory ? { label: selectedCategory } : null}
                onChange={(category) => {
                  updateQueryParams(
                    window.location.href,
                    'category',
                    category ? category.label : '',
                  )
                  this.props.howtoStore.updateSelectedCategory(
                    category ? category.label : '',
                  )
                }}
                placeholder="Filter by category"
              />
            </Flex>
          </AuthWrapper>
          <Flex
            sx={{ width: ['100%', '100%', '20%'] }}
            mb={['10px', '10px', 0]}
          >
            <TagsSelect
              value={selectedTags}
              onChange={(tags) => {
                updateQueryParams(
                  window.location.href,
                  'tags',
                  Object.keys(tags).join(','),
                )
                this.props.howtoStore.updateSelectedTags(tags)
              }}
              category="how-to"
              styleVariant="filter"
              placeholder="Filter by tags"
              relevantTagsItems={filteredHowtos}
            />
          </Flex>
          <Flex
            ml={[0, 0, '8px']}
            mb={['10px', '10px', 0]}
            sx={{ width: ['100%', '100%', '20%'] }}
          >
            <SortSelect usefulCounts={users_votedUsefulHowtos || {}} />
          </Flex>
          <Flex ml={[0, 0, '8px']} mr={[0, 0, 'auto']} mb={['10px', '10px', 0]}>
            <Input
              variant="inputOutline"
              data-cy="how-to-search-box"
              value={searchValue}
              placeholder="Search for a how-to"
              onChange={(evt) => {
                const value = evt.target.value
                updateQueryParams(window.location.href, 'search', value)
                this.props.howtoStore.updateSearchValue(value)
              }}
            />
          </Flex>
          <Flex sx={{ justifyContent: ['flex-end', 'flex-end', 'auto'] }}>
            <Link
              to={this.props.userStore!.user ? '/how-to/create' : 'sign-up'}
            >
              <Box sx={{ width: '100%', display: 'block' }} mb={[3, 3, 0]}>
                <Button
                  sx={{ width: '100%' }}
                  variant={'primary'}
                  translateY
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
                  ...theme.typography?.auxiliary,
                }}
              >
                {Object.keys(selectedTags).length === 0 &&
                searchValue.length === 0 &&
                selectedCategory.length === 0 ? (
                  <Loader />
                ) : (
                  'No how-tos to show'
                )}
              </Heading>
            </Flex>
          )}
          <Flex
            sx={{ justifyContent: 'center' }}
            mx={-4}
            data-cy="howtolist-flex-container"
          >
            <VirtualizedFlex
              data={howtoItems}
              renderItem={(howto: any) => (
                <Box px={4} py={4}>
                  <HowToCard
                    howto={howto}
                    votedUsefulCount={users_votedUsefulHowtos?.[howto._id]}
                  />
                </Box>
              )}
            />
          </Flex>
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
  }
}
