import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import { Flex, Text } from 'theme-ui'

import { CardListItem } from '../CardListItem/CardListItem'
import { Icon } from '../Icon/Icon'
import { Loader } from '../Loader/Loader'

import type { IMapPin } from 'oa-shared'

export interface IProps {
  columnsCountBreakPoints?: { [key: number]: number }
  list: IMapPin[]
  onBlur: () => void
  onPinClick: (arg: IMapPin) => void
  selectedPin: IMapPin | undefined
  viewport: string
  
}

const DEFAULT_BREAKPOINTS = { 600: 1, 1100: 2, 1600: 3 }
export const EMPTY_LIST = 'Oh nos! Nothing to show!'
const ITEMS_PER_RENDER = 20

export const CardList = (props: IProps) => {
  const [renderCount, setRenderCount] = useState<number>(ITEMS_PER_RENDER)
  const [displayItems, setDisplayItems] = useState<JSX.Element[]>([])
  const {
    list,
    onBlur,
    onPinClick,
    selectedPin,
    viewport,
  } = props
  
  useEffect(() => {
    setRenderCount(ITEMS_PER_RENDER)
  }, [list])

  useEffect(() => {
    const toRender = list
      .slice(0, renderCount)
      .sort(
        (a, b) =>
          Date.parse(b.creator?._lastActive || '0') -
          Date.parse(a.creator?._lastActive || '0'),
      ).map((item) => {
      const isSelectedPin = item._id === selectedPin?._id
      return (
        <CardListItem
          item={item}
          key={item._id}
          isSelectedPin={isSelectedPin}
          onPinClick={isSelectedPin ? onBlur : onPinClick}
          viewport={viewport}
        />
      )
    })

    setDisplayItems(toRender)
  }, [renderCount, list])

  const addRenderItems = () =>
    setRenderCount((count) => count + ITEMS_PER_RENDER)
  const hasMore = !(displayItems.length === list.length)

  const isListEmpty = list.length === 0
  const results = `${list.length} result${list.length == 1 ? '' : 's'} in view`
  const columnsCountBreakPoints =
    props.columnsCountBreakPoints || DEFAULT_BREAKPOINTS

  return (
    <Flex
      data-cy={`CardList-${viewport}`}
      sx={{
        flexDirection: 'column',
        gap: 2,
        padding: 2,
      }}
    >
      <Flex
        sx={{
          justifyContent: 'space-between',
          paddingX: 2,
          paddingTop: 2,
          fontSize: 2,
        }}
      >
        <Text data-cy="list-results">{results}</Text>
        <Flex sx={{ alignItems: 'center', gap: 1 }}>
          <Text> Most recently active</Text>
          <Icon glyph="arrow-full-down" />
        </Flex>
      </Flex>
      {isListEmpty && EMPTY_LIST}
      {!isListEmpty && (
        <InfiniteScroll
          dataLength={displayItems.length}
          next={addRenderItems}
          hasMore={hasMore}
          loader={<Loader />}
          scrollThreshold={0.6}
          endMessage={<></>}
          style={{ display: 'flex', flexDirection: 'column', width: '100%' }}
        >
          <ResponsiveMasonry columnsCountBreakPoints={columnsCountBreakPoints}>
            <Masonry>{displayItems}</Masonry>
          </ResponsiveMasonry>
        </InfiniteScroll>
      )}
    </Flex>
  )
}
