import type { StoryFn, Meta } from '@storybook/react'
import { Heading } from 'theme-ui'

export default {
  title: 'Components/Heading',
  component: Heading,
} as Meta<typeof Heading>

export const Default: StoryFn<typeof Heading> = () => (
  <Heading>Default Heading style</Heading>
)

export const Small: StoryFn<typeof Heading> = () => (
  <Heading variant="small">Default Heading style</Heading>
)
