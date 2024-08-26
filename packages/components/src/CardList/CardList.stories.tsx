import { CardList } from './CardList'

import type { Meta, StoryFn } from '@storybook/react'
import type { ProfileTypeName } from 'oa-shared'

export default {
  title: 'Layout/CardList',
  component: CardList,
} as Meta<typeof CardList>

const allItems = [
  { _id: 'first-one', type: 'member' as ProfileTypeName },
  { _id: 'second-one', type: 'collection-point' as ProfileTypeName },
  { _id: 'third', type: 'member' as ProfileTypeName },
  { _id: '4th', type: 'member' as ProfileTypeName },
]

export const Default: StoryFn<typeof CardList> = () => {
  return <CardList list={allItems} filteredList={null} />
}

export const FiltedDisplay: StoryFn<typeof CardList> = () => {
  const filteredList = [allItems[0], allItems[2]]

  return <CardList list={allItems} filteredList={filteredList} />
}

export const WhenFiltedDisplayIsZero: StoryFn<typeof CardList> = () => {
  return <CardList list={allItems} filteredList={[]} />
}
