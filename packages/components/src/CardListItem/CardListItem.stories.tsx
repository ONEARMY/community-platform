import { faker } from '@faker-js/faker'

import { CardListItem } from './CardListItem'

import type { Meta, StoryFn } from '@storybook/react-vite'
import type { MapPin, Moderation, ProfileTypeName } from 'oa-shared'

export default {
  title: 'Map/CardListItem',
  component: CardListItem,
} as Meta<typeof CardListItem>

const onPinClick = () => undefined
const viewport = 'desktop'

export const DefaultMember: StoryFn<typeof CardListItem> = () => {
  const item = {
    id: 1,
    lat: 0,
    lng: 0,
    administrative: '',
    country: 'Brazil',
    countryCode: 'BR',
    moderation: 'accepted' as Moderation,
    profile: {
      id: 1,
      photo: {
        publicUrl: faker.image.avatar(),
      },
      displayName: 'member_no1',
      isContactable: false,
      type: 'member' as ProfileTypeName,
    },
  } as MapPin

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
    id: 1,
    lat: 0,
    lng: 0,
    administrative: '',
    country: 'United Kingdom',
    countryCode: 'UK',
    moderation: 'accepted' as Moderation,
    profile: {
      id: 1,
      photo: {
        publicUrl: faker.image.avatar(),
      },
      about:
        'Lorem ipsum odor amet, consectetuer adipiscing elit. Lorem ipsum odor amet, consectetuer adipiscing elit.',
      displayName: 'member_no1',
      isContactable: false,
      type: 'space' as ProfileTypeName,
      tags: [{ id: 1, name: 'Sheetpress' }],
    },
  } as MapPin

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
