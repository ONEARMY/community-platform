import { faker } from '@faker-js/faker'

import { CardListItem } from './CardListItem'

import type { Meta, StoryFn } from '@storybook/react'
import type { ProfileTypeName } from 'oa-shared'

export default {
  title: 'Map/CardListItem',
  component: CardListItem,
} as Meta<typeof CardListItem>

export const DefaultMember: StoryFn<typeof CardListItem> = () => {
  const item = {
    _id: 'not-selected-onload',
    type: 'member' as ProfileTypeName,
    creator: {
      _id: 'member_no2',
      _lastActive: 'string',
      countryCode: 'br',
      userImage: faker.image.avatar(),
      displayName: 'member_no1',
      isContactableByPublic: false,
      profileType: 'member' as ProfileTypeName,
    },
  }

  return (
    <div style={{ width: '500px' }}>
      <CardListItem item={item} />
    </div>
  )
}

export const DefaultSpace: StoryFn<typeof CardListItem> = () => {
  const item = {
    _id: 'not-selected-onload',
    type: 'workspace' as ProfileTypeName,
    creator: {
      _id: 'string',
      _lastActive: 'string',
      about:
        'Lorem ipsum odor amet, consectetuer adipiscing elit. Lorem ipsum odor amet, consectetuer adipiscing elit.',
      badges: {
        supporter: true,
        verified: false,
      },
      countryCode: 'uk',
      displayName: 'user',
      isContactableByPublic: false,
      profileType: 'workspace' as ProfileTypeName,
      subType: 'Sheetpress',
    },
  }

  return (
    <div style={{ width: '500px' }}>
      <CardListItem item={item} />
    </div>
  )
}

export const DefaultFallback: StoryFn<typeof CardListItem> = () => {
  const item = {
    _id: 'not-selected-onload',
    type: 'member' as ProfileTypeName,
  }

  return (
    <div style={{ width: '500px' }}>
      <CardListItem item={item} />
    </div>
  )
}
