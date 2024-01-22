import { Heading } from 'theme-ui'

import type { Meta, StoryFn } from '@storybook/react'

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
