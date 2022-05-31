import type { ComponentStory, ComponentMeta } from '@storybook/react'
import { FieldInput } from './FieldInput'

export default {
  title: 'Base Components/Form/FieldInput',
  component: FieldInput,
} as ComponentMeta<typeof FieldInput>

export const Default: ComponentStory<typeof FieldInput> = () => (
  <FieldInput placeholder="Input placeholder" meta={{}} />
)

export const WithError: ComponentStory<typeof FieldInput> = () => (
  <FieldInput
    placeholder="Text area input"
    meta={{ error: 'What an error', touched: true }}
  />
)
