import type { StoryFn, Meta } from '@storybook/react'
import { Textarea } from 'theme-ui'

export default {
  title: 'Components/Textarea',
  component: Textarea,
} as Meta<typeof Textarea>

export const Default: StoryFn<typeof Textarea> = () => (
  <Textarea placeholder="A short placeholder" />
)
