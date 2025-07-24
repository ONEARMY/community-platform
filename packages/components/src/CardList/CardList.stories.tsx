import { CardList } from './CardList'

import type { Meta, StoryFn } from '@storybook/react-vite'
import type { MapPin, Moderation, ProfileTypeName } from 'oa-shared'

export default {
  title: 'Map/CardList',
  component: CardList,
} as Meta<typeof CardList>

const list = [
  {
    id: 1,
    profile: {
      type: 'member' as ProfileTypeName,
      isVerified: false,
    },
    moderation: 'accepted' as Moderation,
    lat: 0,
    lng: 0,
  },
  {
    id: 2,
    moderation: 'accepted' as Moderation,
    profile: {
      type: 'collection-point' as ProfileTypeName,
      isVerified: false,
    },
    lat: 10,
    lng: -38,
  },
  {
    id: 3,
    profile: {
      type: 'member' as ProfileTypeName,
      isVerified: false,
    },
    moderation: 'accepted' as Moderation,
    lat: 102,
    lng: 30,
  },
  {
    id: 4,
    profile: {
      type: 'member' as ProfileTypeName,
      isVerified: false,
    },
    moderation: 'accepted' as Moderation,
    lat: 0,
    lng: 73,
  },
] as MapPin[]

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
