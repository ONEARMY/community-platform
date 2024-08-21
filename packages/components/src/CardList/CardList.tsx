import { Flex, Text } from 'theme-ui'

import { CardListItem } from '../CardListItem/CardListItem'

import type { ListItem } from '../CardListItem/CardListItem'

export interface IProps {
  list: ListItem[]
  filteredList: ListItem[] | null
  onClick: (id: string) => void
}

export const EMPTY_LIST = 'Oh nos! Nothing to show!'

export const CardList = (props: IProps) => {
  const { onClick, filteredList, list } = props

  const listToShow = filteredList === null ? list : filteredList
  const displayItems = listToShow.map((item) => (
    <CardListItem item={item} key={item._id} onClick={onClick} />
  ))

  const isListEmpty = displayItems.length === 0

  return (
    <Flex
      sx={{
        flexDirection: 'column',
        gap: 4,
        padding: 4,
      }}
    >
      {!isListEmpty && (
        <Flex>
          <Text>{displayItems.length} results</Text>
        </Flex>
      )}
      <Flex
        sx={{
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 4,
        }}
      >
        {!isListEmpty && displayItems}
        {isListEmpty && EMPTY_LIST}
      </Flex>
    </Flex>
  )
}
