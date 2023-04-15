import type { StoryFn, Meta } from '@storybook/react'
import { Input } from 'theme-ui'

export default {
  title: 'Components/Input',
  component: Input,
} as Meta<typeof Input>

export const Default: StoryFn<typeof Input> = () => (
  <Input placeholder="Placeholder" />
)

export const Error: StoryFn<typeof Input> = () => (
  <Input variant="error" value="Invalid input" />
)

export const Outlined: StoryFn<typeof Input> = () => (
  <Input variant="inputOutline" placeholder="Placeholder" />
)
