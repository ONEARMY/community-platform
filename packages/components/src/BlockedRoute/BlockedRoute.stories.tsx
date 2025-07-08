import { faker } from '@faker-js/faker'

import { BlockedRoute } from './BlockedRoute'

import type { Meta, StoryFn } from '@storybook/react-vite'

export default {
  title: 'Layout/BlockedRoute',
  component: BlockedRoute,
} as Meta<typeof BlockedRoute>

export const Default: StoryFn<typeof BlockedRoute> = () => (
  <BlockedRoute>{faker.lorem.sentences(2)}</BlockedRoute>
)

export const OverrideButton: StoryFn<typeof BlockedRoute> = () => (
  <BlockedRoute
    redirectLabel="A custom call to action"
    redirectUrl="/another-url"
  >
    {faker.lorem.sentences(2)}
  </BlockedRoute>
)
