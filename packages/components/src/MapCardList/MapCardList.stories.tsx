import { MapCardList } from './MapCardList'

import type { Meta, StoryFn } from '@storybook/react-vite'
import type { MapPin, Moderation, ProfileTypeName } from 'oa-shared'

export default {
  title: 'Map/CardList',
  component: MapCardList,
} as Meta<typeof MapCardList>

const list = [
  {
    id: 1,
    profile: {
      type: 'member' as ProfileTypeName,
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
    },
    lat: 10,
    lng: -38,
  },
  {
    id: 3,
    profile: {
      type: 'member' as ProfileTypeName,
    },
    moderation: 'accepted' as Moderation,
    lat: 102,
    lng: 30,
  },
  {
    id: 4,
    profile: {
      type: 'member' as ProfileTypeName,
    },
    moderation: 'accepted' as Moderation,
    lat: 0,
    lng: 73,
  },
] as MapPin[]

const onPinClick = () => undefined

export const Default: StoryFn<typeof MapCardList> = () => {
  return (
    <MapCardList
      list={list}
      onPinClick={onPinClick}
      selectedPin={undefined}
      viewport="stories"
    />
  )
}

export const WhenDisplayIsZero: StoryFn<typeof MapCardList> = () => {
  return (
    <MapCardList
      list={[]}
      onPinClick={onPinClick}
      selectedPin={undefined}
      viewport="stories"
    />
  )
}
