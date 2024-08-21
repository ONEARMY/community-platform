import { CardListItem } from './CardListItem'

import type { Meta, StoryFn } from '@storybook/react'
import type { IProfileTypeName } from 'oa-shared'

export default {
  title: 'Components/CardListItem',
  component: CardListItem,
} as Meta<typeof CardListItem>

export const DefaultMember: StoryFn<typeof CardListItem> = () => {
  const item = {
    _id: 'not-selected-onload',
    type: 'member' as IProfileTypeName,
  }

  return <CardListItem onClick={() => null} item={item} />
}

export const DefaultSpace: StoryFn<typeof CardListItem> = () => {
  const item = {
    _id: 'not-selected-onload',
    type: 'workspace' as IProfileTypeName,
  }

  return <CardListItem onClick={() => null} item={item} />
}
