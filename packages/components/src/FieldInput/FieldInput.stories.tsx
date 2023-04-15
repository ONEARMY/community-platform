import type { StoryFn, Meta } from '@storybook/react'
import { FieldInput } from './FieldInput'

export default {
  title: 'Components/FieldInput',
  component: FieldInput,
} as Meta<typeof FieldInput>

export const Default: StoryFn<typeof FieldInput> = () => (
  <FieldInput placeholder="Input placeholder" meta={{}} input={{} as any} />
)

export const WithError: StoryFn<typeof FieldInput> = () => (
  <FieldInput
    placeholder="Text area input"
    input={{} as any}
    meta={{ error: 'What an error', touched: true }}
  />
)
