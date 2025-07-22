import { ProfileLink } from './ProfileLink'

import type { Meta, StoryFn } from '@storybook/react-vite'

export default {
  title: 'Components/ProfileLink',
  component: ProfileLink,
} as Meta<typeof ProfileLink>

export const Website: StoryFn<typeof ProfileLink> = () => (
  <ProfileLink url="https://example.com" />
)
