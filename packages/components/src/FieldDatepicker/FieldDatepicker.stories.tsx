import type { StoryFn, Meta } from '@storybook/react'
import { FieldDatepicker } from './FieldDatepicker'

export default {
  title: 'Components/FieldDatepicker',
  component: FieldDatepicker,
} as Meta<typeof FieldDatepicker>

export const Default: StoryFn<typeof FieldDatepicker> = () => (
  <FieldDatepicker meta={{}} input={{} as any} />
)
