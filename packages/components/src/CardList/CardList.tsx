import { useEffect, useState } from 'react'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import { compareDesc } from 'date-fns'
import { Flex, Text } from 'theme-ui'

import { Button } from '../Button/Button'
import { CardListItem } from '../CardListItem/CardListItem'
import { Icon } from '../Icon/Icon'

import type { MapPin } from 'oa-shared'

export interface IProps {
  columnsCountBreakPoints?: { [key: number]: number }
  list: MapPin[]
  onPinClick: (arg: MapPin) => void
  selectedPin: MapPin | undefined
  viewport: string
}

const DEFAULT_BREAKPOINTS = { 600: 1, 1100: 2, 1600: 3 }
export const EMPTY_LIST = 'Oh nos! Nothing to show!'
const ITEMS_PER_RENDER = 20

export const CardList = (props: IProps) => {
  const [renderCount, setRenderCount] = useState<number>(ITEMS_PER_RENDER)
  const [displayItems, setDisplayItems] = useState<JSX.Element[]>([])
  const { list, onPinClick, selectedPin, viewport } = props

  useEffect(() => {
    setRenderCount(ITEMS_PER_RENDER)
  }, [list])

  useEffect(() => {
    const toRender = list
      .sort((a, b) =>
        compareDesc(
          a.profile!.lastActive || Date.parse('0'),
          b.profile!.lastActive || Date.parse('0'),
        ),
      )
      .slice(0, renderCount)
      .map((item) => {
        const isSelectedPin = item.id === selectedPin?.id

        return (
          <CardListItem
            item={item}
            key={item.id}
            isSelectedPin={isSelectedPin}
            onPinClick={onPinClick}
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
        <>
          <ResponsiveMasonry columnsCountBreakPoints={columnsCountBreakPoints}>
            <Masonry>{displayItems}</Masonry>
          </ResponsiveMasonry>
          {hasMore && (
            <Flex sx={{ justifyContent: 'center' }}>
              <Button onClick={addRenderItems}>Show more </Button>
            </Flex>
          )}
        </>
      )}
    </Flex>
  )
}
