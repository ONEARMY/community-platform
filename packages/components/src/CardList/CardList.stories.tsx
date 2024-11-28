import { CardList } from './CardList'

import type { Meta, StoryFn } from '@storybook/react'
import type { IModerationStatus, ProfileTypeName } from 'oa-shared'

export default {
  title: 'Map/CardList',
  component: CardList,
} as Meta<typeof CardList>

const list = [
  {
    _deleted: false,
    _id: 'first-one',
    type: 'member' as ProfileTypeName,
    moderation: 'accepted' as IModerationStatus,
    verified: false,
    location: { lat: 0, lng: 0 },
  },
  {
    _deleted: false,
    _id: 'second-one',
    type: 'collection-point' as ProfileTypeName,
    moderation: 'accepted' as IModerationStatus,
    verified: false,
    location: { lat: 10, lng: -38 },
  },
  {
    _deleted: false,
    _id: 'third',
    type: 'member' as ProfileTypeName,
    moderation: 'accepted' as IModerationStatus,
    verified: false,
    location: { lat: 102, lng: 30 },
  },
  {
    _deleted: false,
    _id: '4th',
    type: 'member' as ProfileTypeName,
    moderation: 'accepted' as IModerationStatus,
    verified: false,
    location: { lat: 0, lng: 73 },
  },
]

const onPinClick = () => undefined

export const Default: StoryFn<typeof CardList> = () => {
  return (
    <CardList
      list={list}
      onPinClick={onPinClick}
      selectedPin={undefined}
      viewport="stories"
    />
  )
}

export const WhenDisplayIsZero: StoryFn<typeof CardList> = () => {
  return (
    <CardList
      list={[]}
      onPinClick={onPinClick}
      selectedPin={undefined}
      viewport="stories"
    />
  )
}
