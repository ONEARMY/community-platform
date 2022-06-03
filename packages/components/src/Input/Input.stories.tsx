import type { ComponentStory, ComponentMeta } from '@storybook/react'
import { Input } from 'theme-ui'

export default {
  title: 'Base Components/Input',
  component: Input,
} as ComponentMeta<typeof Input>

export const Default: ComponentStory<typeof Input> = () => (
  <Input placeholder="Placeholder" />
)

export const Error: ComponentStory<typeof Input> = () => (
  <Input variant="error" value="Invalid input" />
)

export const Outlined: ComponentStory<typeof Input> = () => (
  <Input variant="inputOutline" placeholder="Placeholder" />
)
