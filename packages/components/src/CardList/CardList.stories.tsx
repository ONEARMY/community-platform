import { CardList } from './CardList'

import type { Meta, StoryFn } from '@storybook/react'
import type { IProfileTypeName } from 'oa-shared'

export default {
  title: 'Layout/CardList',
  component: CardList,
} as Meta<typeof CardList>

const allItems = [
  { _id: 'first-one', type: 'member' as IProfileTypeName },
  { _id: 'second-one', type: 'collection-point' as IProfileTypeName },
  { _id: 'third', type: 'member' as IProfileTypeName },
  { _id: '4th', type: 'member' as IProfileTypeName },
]

export const Default: StoryFn<typeof CardList> = () => {
  return <CardList list={allItems} onClick={() => null} filteredList={null} />
}

export const FiltedDisplay: StoryFn<typeof CardList> = () => {
  const filteredList = [allItems[0], allItems[2]]

  return (
    <CardList
      list={allItems}
      onClick={() => null}
      filteredList={filteredList}
    />
  )
}

export const WhenFiltedDisplayIsZero: StoryFn<typeof CardList> = () => {
  return <CardList list={allItems} onClick={() => null} filteredList={[]} />
}
