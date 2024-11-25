import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import { Flex, Text } from 'theme-ui'

import { CardListItem } from '../CardListItem/CardListItem'
import { Icon } from '../Icon/Icon'
import { Loader } from '../Loader/Loader'

import type { IMapPin } from 'oa-shared'

export interface IProps {
  columnsCountBreakPoints?: { [key: number]: number }
  filteredList: IMapPin[] | null
  list: IMapPin[]
  onBlur: () => void
  onPinClick: (arg: IMapPin) => void
  selectedPin: IMapPin | undefined
  viewport: string
}

export const EMPTY_LIST = 'Oh nos! Nothing to show!'

export const CardList = (props: IProps) => {
  const {
    columnsCountBreakPoints,
    filteredList,
    list,
    onBlur,
    onPinClick,
    selectedPin,
    viewport,
  } = props

  const listToShow = filteredList === null ? list : filteredList
  const displayItems = listToShow
    .sort(
      (a, b) =>
        Date.parse(b.creator?._lastActive || '0') -
        Date.parse(a.creator?._lastActive || '0'),
    )
    .map((item) => {
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

  const isListEmpty = displayItems.length === 0
  const hasListLoaded = list
  const results = `${displayItems.length} result${
    displayItems.length == 1 ? '' : 's'
  } in view`

  return (
    <Flex
      data-cy={`CardList-${viewport}`}
      sx={{
        flexDirection: 'column',
        gap: 2,
        padding: 2,
      }}
    >
      {!hasListLoaded && <Loader />}
      {hasListLoaded && (
        <>
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
            <ResponsiveMasonry
              columnsCountBreakPoints={
                columnsCountBreakPoints
                  ? columnsCountBreakPoints
                  : { 600: 1, 1100: 2, 1600: 3 }
              }
            >
              <Masonry>{displayItems}</Masonry>
            </ResponsiveMasonry>
          )}
        </>
      )}
    </Flex>
  )
}
