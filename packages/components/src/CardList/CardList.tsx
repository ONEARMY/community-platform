import { Flex, Grid, Text } from 'theme-ui'

import { CardListItem } from '../CardListItem/CardListItem'
import { Loader } from '../Loader/Loader'

import type { ListItem } from '../CardListItem/CardListItem'

export interface IProps {
  filteredList: ListItem[] | null
  list: ListItem[]
}

export const EMPTY_LIST = 'Oh nos! Nothing to show!'

export const CardList = (props: IProps) => {
  const { filteredList, list } = props

  const listToShow = filteredList === null ? list : filteredList
  const displayItems = listToShow.map((item) => (
    <CardListItem item={item} key={item._id} />
  ))

  const isListEmpty = displayItems.length === 0
  const hasListLoaded = list
  const results = `${displayItems.length} ${displayItems.length == 1 ? 'result' : 'results'}`

  return (
    <Flex
      data-cy="CardList"
      sx={{
        flexDirection: 'column',
        gap: 4,
      }}
    >
      {!hasListLoaded && <Loader />}
      {hasListLoaded && (
        <>
          <Flex>
            <Text data-cy="list-results">{results}</Text>
          </Flex>
          <Grid
            sx={{
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: 4,
            }}
            width="250px"
            columns={3}
          >
            {!isListEmpty && displayItems}
            {isListEmpty && EMPTY_LIST}
          </Grid>
        </>
      )}
    </Flex>
  )
}
