import * as React from 'react'
import { Flex } from 'rebass'
import { List, WindowScroller } from 'react-virtualized'
// TODO add loader (and remove this material-ui dep)
import { Link } from 'src/components/Links'
import TagsSelect from 'src/components/Tags/TagsSelect'

import { inject, observer } from 'mobx-react'
import { HowtoStore } from 'src/stores/Howto/howto.store'
import { Button } from 'src/components/Button'
import { IHowtoDB } from 'src/models/howto.models'
import { AuthWrapper } from 'src/components/Auth/AuthWrapper'
import MoreContainer from 'src/components/MoreContainer/MoreContainer'
import HowToCard from 'src/components/HowToCard/HowToCard'
import Heading from 'src/components/Heading'
import { Loader } from 'src/components/Loader'
import themes from 'src/themes/styled.theme'

interface InjectedProps {
  howtoStore?: HowtoStore
}

interface IState {
  isLoading: boolean
}

const breakpointsInPX = themes.breakpoints.map(
  // From em string to px number
  breakpoint => Number(breakpoint.replace('em', '')) * 16,
)

// First we use the @inject decorator to bind to the howtoStore state
@inject('howtoStore')
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
  }
  get injected() {
    return this.props as InjectedProps
  }

  /**
   * Split Howtos into chunks depending on the current window width.
   * This determines how many Howtos are displayed in one row. For small screen
   * the function won´t split the arrays, as there can only be one Howto displayed in every row
   */
  get filteredHowtoChunks(): IHowtoDB[] | IHowtoDB[][] {
    const { filteredHowtos } = this.props.howtoStore
    const windowWidth = window.innerWidth
    let chunk = 1
    if (windowWidth > breakpointsInPX[0] && windowWidth <= breakpointsInPX[1]) {
      chunk = 2
    } else if (windowWidth > breakpointsInPX[1]) {
      chunk = 3
    }
    const howToChunks: IHowtoDB[][] = []
    let i = 0
    let j = 0
    if (chunk > 1) {
      for (i = 0, j = filteredHowtos.length; i < j; i += chunk) {
        howToChunks.push(filteredHowtos.slice(i, i + chunk))
      }
      return howToChunks
    } else {
      return filteredHowtos
    }
  }

  rowRenderer(chunks: IHowtoDB[][] | IHowtoDB[], { index, key, style }) {
    const row: IHowtoDB[] | IHowtoDB = chunks[index]
    return (
      <Flex key={key} style={style}>
        {Array.isArray(row) ? (
          row.map((howto: IHowtoDB) => (
            <Flex key={howto._id} px={4} py={4} width={[1, 1 / 2, 1 / 3]}>
              <HowToCard howto={howto} />
            </Flex>
          ))
        ) : (
          <Flex key={row._id} px={4} py={4} width={[1, 1 / 2, 1 / 3]}>
            <HowToCard howto={row} />
          </Flex>
        )}
      </Flex>
    )
  }

  public render() {
    const { filteredHowtos, selectedTags } = this.props.howtoStore
    return (
      <>
        <Flex py={26}>
          <Heading medium bold txtcenter width={1} my={20}>
            Learn & share how to recycle, build and work with plastic
          </Heading>
        </Flex>
        <Flex
          flexWrap={'nowrap'}
          justifyContent={'space-between'}
          flexDirection={['column', 'column', 'row']}
        >
          <Flex width={[1, 1, 0.2]} mb={['10px', '10px', 0]}>
            <TagsSelect
              onChange={tags => this.props.howtoStore.updateSelectedTags(tags)}
              category="how-to"
              styleVariant="filter"
              placeholder="Filter How-tos by tag"
              relevantTagsItems={filteredHowtos}
            />
          </Flex>
          <AuthWrapper>
            <Flex justifyContent={['flex-end', 'flex-end', 'auto']}>
              <Link width="100%" to={'/how-to/create'} mb={[3, 3, 0]}>
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
          </AuthWrapper>
        </Flex>
        <React.Fragment>
          {filteredHowtos.length === 0 ? (
            <Flex>
              <Heading auxiliary txtcenter width={1}>
                {Object.keys(selectedTags).length === 0 ? (
                  <Loader />
                ) : (
                  'No how-tos to show'
                )}
              </Heading>
            </Flex>
          ) : (
            <Flex flexWrap="wrap" mx={-4}>
              <WindowScroller>
                {({ height, isScrolling, onChildScroll, scrollTop }) => (
                  <List
                    autoHeight
                    height={height}
                    width={window.innerWidth}
                    isScrolling={isScrolling}
                    onScroll={onChildScroll}
                    scrollTop={scrollTop}
                    rowCount={this.filteredHowtoChunks.length}
                    rowHeight={410}
                    rowRenderer={data =>
                      this.rowRenderer(this.filteredHowtoChunks, data)
                    }
                  />
                )}
              </WindowScroller>
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
