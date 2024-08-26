import { CardListItem } from './CardListItem'

import type { Meta, StoryFn } from '@storybook/react'
import type { ProfileTypeName } from 'oa-shared'

export default {
  title: 'Components/CardListItem',
  component: CardListItem,
} as Meta<typeof CardListItem>

export const DefaultMember: StoryFn<typeof CardListItem> = () => {
  const item = {
    _id: 'not-selected-onload',
    type: 'member' as ProfileTypeName,
  }

  return <CardListItem item={item} />
}

export const DefaultSpace: StoryFn<typeof CardListItem> = () => {
  const item = {
    _id: 'not-selected-onload',
    type: 'workspace' as ProfileTypeName,
  }

  return <CardListItem item={item} />
}
