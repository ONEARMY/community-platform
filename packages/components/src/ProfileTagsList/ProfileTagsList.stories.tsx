import { ProfileTagsList } from './ProfileTagsList'

import type { Meta, StoryFn } from '@storybook/react'

export default {
  title: 'Components/ProfileTagsList',
  component: ProfileTagsList,
} as Meta<typeof ProfileTagsList>

export const Default: StoryFn<typeof ProfileTagsList> = () => (
  <ProfileTagsList
    tags={[
      {
        id: 1,
        createdAt: new Date(),
        name: 'Electronics',
        profileType: 'space',
      },
      {
        id: 2,
        createdAt: new Date(),
        name: 'Graphic Design',
        profileType: 'member',
      },
    ]}
    isSpace={false}
  />
)
