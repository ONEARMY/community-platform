import type { ComponentStory, ComponentMeta } from '@storybook/react'
import { FieldDatepicker } from './FieldDatepicker'

export default {
  title: 'Base Components/Form/FieldDatepicker',
  component: FieldDatepicker,
} as ComponentMeta<typeof FieldDatepicker>

export const Default: ComponentStory<typeof FieldDatepicker> = () => (
  <FieldDatepicker meta={{}} input={{} as any} />
)
