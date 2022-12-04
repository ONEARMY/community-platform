import type { ComponentStory, ComponentMeta } from '@storybook/react'
import { Field, Form } from 'react-final-form'
import { FieldDatepicker } from './FieldDatepicker'

export default {
  title: 'Components/FieldDatepicker',
  component: FieldDatepicker,
} as ComponentMeta<typeof FieldDatepicker>

export const Default: ComponentStory<typeof FieldDatepicker> = () => (
  <Form
    onSubmit={(v) => console.log(v)}
    render={() => <Field name="default" component={FieldDatepicker} />}
  />
)
