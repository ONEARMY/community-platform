import { faker } from '@faker-js/faker'
import type { StoryFn, Meta } from '@storybook/react'
import { Text } from 'theme-ui'

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
