import type { ComponentStory, ComponentMeta } from '@storybook/react'
import { Textarea } from 'theme-ui'

export default {
  title: 'Base Components/Textarea',
  component: Textarea,
} as ComponentMeta<typeof Textarea>

export const Default: ComponentStory<typeof Textarea> = () => (
  <Textarea placeholder="A short placeholder" />
)
