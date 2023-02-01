import { faker } from '@faker-js/faker'
import type { ComponentStory, ComponentMeta } from '@storybook/react'
import { Text } from 'theme-ui'

export default {
  title: 'Components/Text',
  component: Text,
} as ComponentMeta<typeof Text>

export const Default: ComponentStory<typeof Text> = () => (
  <Text>{faker.lorem.paragraphs(3)}</Text>
)

export const Quiet: ComponentStory<typeof Text> = () => (
  <Text variant="quiet">{faker.lorem.paragraphs(3)}</Text>
)
