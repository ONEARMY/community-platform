import { FieldInput } from './FieldInput'

import type { Meta, StoryFn } from '@storybook/react'

export default {
  title: 'Forms/FieldInput',
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
