import { Textarea } from 'theme-ui'

import type { Meta, StoryFn } from '@storybook/react'

export default {
  title: 'Components/Textarea',
  component: Textarea,
} as Meta<typeof Textarea>

export const Default: StoryFn<typeof Textarea> = () => (
  <Textarea placeholder="A short placeholder" />
)
