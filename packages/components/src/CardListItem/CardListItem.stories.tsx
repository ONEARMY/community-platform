import { faker } from '@faker-js/faker'

import { CardListItem } from './CardListItem'

import type { Meta, StoryFn } from '@storybook/react'
import type { IModerationStatus, ProfileTypeName } from 'oa-shared'

export default {
  title: 'Map/CardListItem',
  component: CardListItem,
} as Meta<typeof CardListItem>

const onPinClick = () => undefined
const viewport = 'desktop'

export const DefaultMember: StoryFn<typeof CardListItem> = () => {
  const item = {
    _deleted: false,
    _id: 'not-selected-onload',
    type: 'member' as ProfileTypeName,
    moderation: 'accepted' as IModerationStatus,
    verified: false,
    location: { lat: 0, lng: 0 },
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
      <CardListItem
        item={item}
        isSelectedPin={false}
        onPinClick={onPinClick}
        viewport={viewport}
      />
    </div>
  )
}

export const DefaultSpace: StoryFn<typeof CardListItem> = () => {
  const item = {
    _deleted: false,
    _id: 'not-selected-onload',
    location: { lat: 0, lng: 0 },
    moderation: 'accepted' as IModerationStatus,
    type: 'workspace' as ProfileTypeName,
    verified: false,
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
      workspaceType: 'Sheetpress',
    },
  }

  return (
    <div style={{ width: '500px' }}>
      <CardListItem
        item={item}
        isSelectedPin={false}
        onPinClick={onPinClick}
        viewport={viewport}
      />
    </div>
  )
}

export const DefaultFallback: StoryFn<typeof CardListItem> = () => {
  const item = {
    _deleted: false,
    _id: 'not-selected-onload',
    type: 'member' as ProfileTypeName,
    location: { lat: 0, lng: 0 },
    moderation: 'accepted' as IModerationStatus,
    verified: false,
  }

  return (
    <div style={{ width: '500px' }}>
      <CardListItem
        item={item}
        isSelectedPin={false}
        onPinClick={onPinClick}
        viewport={viewport}
      />
    </div>
  )
}
