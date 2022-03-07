import { inject, observer } from 'mobx-react'
import * as React from 'react'
import { AuthWrapper } from 'src/components/Auth/AuthWrapper'
import { Button } from 'src/components/Button'
import Heading from 'src/components/Heading'
import { Flex, Box } from 'rebass/styled-components'
import { Link } from 'src/components/Links'
import { Loader } from 'src/components/Loader'
import MoreContainer from 'src/components/MoreContainer/MoreContainer'
import SearchInput from 'src/components/SearchInput'
import TagsSelect from 'src/components/Tags/TagsSelect'
import { VirtualizedFlex } from 'src/components/VirtualizedFlex/VirtualizedFlex'
import { IHowtoDB } from 'src/models/howto.models'
import { HowtoStore } from 'src/stores/Howto/howto.store'
import { UserStore } from 'src/stores/User/user.store'
import HowToCard from './HowToCard'
import { ThemeStore } from 'src/stores/Theme/theme.store'

interface InjectedProps {
  howtoStore: HowtoStore
  userStore: UserStore
  themeStore: ThemeStore
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
@inject('howtoStore', 'userStore', 'themeStore')
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
        tagQuery.split(',').forEach(tag => {
          tags[tag] = true
        })

        this.props.howtoStore.updateSelectedTags(tags)
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
    const { verifiedUsers } = this.injected.userStore
    const {
      filteredHowtos,
      selectedTags,
      searchValue,
      referrerSource,
    } = this.props.howtoStore

    const theme = this.props?.themeStore?.currentTheme

    return (
      <>
        <Flex py={26}>
          {referrerSource ? (
            <Box width={1}>
              <Heading medium bold txtcenter mt={20}>
                The page you were looking for was moved or doesn't exist.
              </Heading>
              <Heading small txtcenter mt={3} mb={10}>
                Search all of our how-to's below
              </Heading>
            </Box>
          ) : (
            <Heading medium bold txtcenter width={1}>
              {theme && theme.howtoHeading}
            </Heading>
          )}
        </Flex>
        <Flex
          flexWrap={'nowrap'}
          justifyContent={'space-between'}
          flexDirection={['column', 'column', 'row']}
        >
          <Flex width={[1, 1, 0.2]} mb={['10px', '10px', 0]}>
            <TagsSelect
              value={selectedTags}
              onChange={tags => {
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
          <Flex ml={[0, 0, '8px']} mr={[0, 0, 'auto']} mb={['10px', '10px', 0]}>
            <SearchInput
              data-cy="how-to-search-box"
              value={searchValue}
              placeholder="Search for a how-to"
              onChange={value => {
                updateQueryParams(window.location.href, 'search', value)
                this.props.howtoStore.updateSearchValue(value)
              }}
            />
          </Flex>
          <Flex justifyContent={['flex-end', 'flex-end', 'auto']}>
            <Link
              width="100%"
              to={this.props.userStore!.user ? '/how-to/create' : 'sign-up'}
              mb={[3, 3, 0]}
            >
              <Button
                width="100%"
                variant={'primary'}
                translateY
                data-cy="create"
              >
                Create a How-to
              </Button>
            </Link>
          </Flex>
        </Flex>
        <React.Fragment>
          {filteredHowtos.length === 0 ? (
            <Flex>
              <Heading auxiliary txtcenter width={1}>
                {Object.keys(selectedTags).length === 0 &&
                searchValue.length === 0 ? (
                  <Loader />
                ) : (
                  'No how-tos to show'
                )}
              </Heading>
            </Flex>
          ) : (
            <Flex
              justifyContent={'center'}
              mx={-4}
              data-cy="howtolist-flex-container"
            >
              <VirtualizedFlex
                data={filteredHowtos}
                renderItem={(data: IHowtoDB) => (
                  <Box px={4} py={4}>
                    <HowToCard
                      howto={data}
                      verified={verifiedUsers?.[data._createdBy]}
                    />
                  </Box>
                )}
              />
            </Flex>
          )}
          <Flex justifyContent={'center'} mt={20}>
            <Link to={'#'} style={{ visibility: 'hidden' }}>
              <Button variant={'secondary'} data-cy="more-how-tos">
                More how-tos
              </Button>
            </Link>
          </Flex>
          <MoreContainer m={'0 auto'} pt={60} pb={90}>
            <Flex alignItems={'center'} flexDirection={'column'} mt={5}>
              <Heading medium sx={{ textAlign: 'center' }}>
                Inspire the Precious Plastic world.
              </Heading>
              <Heading medium>Share your how-to!</Heading>
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
      </>
    )
  }
}
