import { faker } from '@faker-js/faker'

import { BlockedRoute } from './BlockedRoute'

import type { ComponentMeta, ComponentStory } from '@storybook/react'

export default {
  title: 'Components/BlockedRoute',
  component: BlockedRoute,
} as ComponentMeta<typeof BlockedRoute>

export const Default: ComponentStory<typeof BlockedRoute> = () => (
  <BlockedRoute>{faker.lorem.sentences(2)}</BlockedRoute>
)

export const OverrideButton: ComponentStory<typeof BlockedRoute> = () => (
  <BlockedRoute
    redirectLabel="A custom call to action"
    redirectUrl="/another-url"
  >
    {faker.lorem.sentences(2)}
  </BlockedRoute>
)
