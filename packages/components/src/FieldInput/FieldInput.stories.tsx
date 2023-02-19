import type { ComponentStory, ComponentMeta } from '@storybook/react'
import { FieldInput } from './FieldInput'

export default {
  title: 'Components/FieldInput',
  component: FieldInput,
} as ComponentMeta<typeof FieldInput>

export const Default: ComponentStory<typeof FieldInput> = () => (
  <FieldInput placeholder="Input placeholder" meta={{}} input={{} as never} />
)

export const WithError: ComponentStory<typeof FieldInput> = () => (
  <FieldInput
    placeholder="Text area input"
    input={{} as never}
    meta={{ error: 'What an error', touched: true }}
  />
)
