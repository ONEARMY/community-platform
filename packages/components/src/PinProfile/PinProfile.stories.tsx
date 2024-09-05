import { faker } from '@faker-js/faker'

import { PinProfile } from './PinProfile'

import type { Meta, StoryFn } from '@storybook/react'
import type { ProfileTypeName } from 'oa-shared'

export default {
  title: 'Map/PinProfile',
  component: PinProfile,
} as Meta<typeof PinProfile>

export const DefaultMember: StoryFn<typeof PinProfile> = () => {
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
    <div style={{ width: '230px', position: 'fixed' }}>
      <PinProfile item={item} onClose={() => console.log()} />
    </div>
  )
}

export const DefaultSpace: StoryFn<typeof PinProfile> = () => {
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
      isContactableByPublic: true,
      profileType: 'workspace' as ProfileTypeName,
      subType: 'Sheetpress',
    },
  }

  return (
    <div style={{ width: '230px', position: 'fixed' }}>
      <PinProfile item={item} onClose={() => console.log()} />
    </div>
  )
}
