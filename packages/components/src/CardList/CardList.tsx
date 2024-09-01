import Masonry from 'react-responsive-masonry'
import { Flex, Text } from 'theme-ui'

import { CardListItem } from '../CardListItem/CardListItem'
import { Icon } from '../Icon/Icon'
import { Loader } from '../Loader/Loader'

import type { ListItem } from '../CardListItem/types'

export interface IProps {
  filteredList: ListItem[] | null
  list: ListItem[]
}

export const EMPTY_LIST = 'Oh nos! Nothing to show!'

export const CardList = (props: IProps) => {
  const { filteredList, list } = props

  const listToShow = filteredList === null ? list : filteredList
  const displayItems = listToShow
    .sort(
      (a, b) =>
        Date.parse(b.creator?._lastActive || '0') -
        Date.parse(a.creator?._lastActive || '0'),
    )
    .map((item) => <CardListItem item={item} key={item._id} />)

  const isListEmpty = displayItems.length === 0
  const hasListLoaded = list
  const results = `${displayItems.length} ${
    displayItems.length == 1 ? 'result' : 'results'
  }`

  return (
    <Flex
      data-cy="CardList"
      sx={{
        flexDirection: 'column',
        gap: 2,
      }}
    >
      {!hasListLoaded && <Loader />}
      {hasListLoaded && (
        <>
          <Flex
            sx={{
              justifyContent: 'space-between',
              paddingX: 2,
              fontSize: 2,
            }}
          >
            <Text data-cy="list-results">{results}</Text>
            <Flex sx={{ alignItems: 'center', gap: 1 }}>
              <Text> Most active</Text>
              <Icon glyph="arrow-full-down" />
            </Flex>
          </Flex>
          {isListEmpty && EMPTY_LIST}
          {!isListEmpty && <Masonry columnsCount={2}>{displayItems}</Masonry>}
        </>
      )}
    </Flex>
  )
}
