import { ProfileTagsList } from './ProfileTagsList'

import type { Meta, StoryFn } from '@storybook/react'

export default {
  title: 'Components/ProfileTagsList',
  component: ProfileTagsList,
} as Meta<typeof ProfileTagsList>

export const Default: StoryFn<typeof ProfileTagsList> = () => (
  <ProfileTagsList
    tagIds={{ uCzWZbz3aVKyx2keoqRi: true, J3LF7fMsDfniYT2ZX3rf: false }}
  />
)
