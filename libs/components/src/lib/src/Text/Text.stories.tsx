import { faker } from '@faker-js/faker'
import { Text } from 'theme-ui'

import type { Meta, StoryFn } from '@storybook/react'

export default {
  title: 'Components/Text',
  component: Text,
} as Meta<typeof Text>

export const Default: StoryFn<typeof Text> = () => (
  <Text>{faker.lorem.paragraphs(3)}</Text>
)

export const Quiet: StoryFn<typeof Text> = () => (
  <Text variant="quiet">{faker.lorem.paragraphs(3)}</Text>
)
