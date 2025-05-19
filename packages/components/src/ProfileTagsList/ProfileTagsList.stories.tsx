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
        _id: 'hwh',
        _created: 'today',
        _deleted: false,
        color: '#20B7EB',
        label: 'Electronics',
        profileType: 'space',
      },
      {
        _id: 'a45397uh',
        _created: 'yesterday',
        _deleted: false,
        color: '#F29195',
        label: 'Electronics II',
        profileType: 'space',
      },
    ]}
    isSpace={false}
  />
)
