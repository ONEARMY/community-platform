import { FieldDatepicker } from './FieldDatepicker'

import type { Meta, StoryFn } from '@storybook/react'

export default {
  title: 'Forms/FieldDatepicker',
  component: FieldDatepicker,
} as Meta<typeof FieldDatepicker>

export const Default: StoryFn<typeof FieldDatepicker> = () => (
  <FieldDatepicker meta={{}} input={{} as any} />
)
