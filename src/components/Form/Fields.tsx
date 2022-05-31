import * as React from 'react'
import { ErrorMessage, StyledDatePicker } from './elements'
import { Input } from 'theme-ui'
import type { FieldRenderProps } from 'react-final-form'
import 'react-datepicker/dist/react-datepicker.css'

// any props can be passed to field and down to child component
// input and meta props come from react field render props and will be
// picked up by typing
type FieldProps = FieldRenderProps<any, any> & { children?: React.ReactNode }

export interface IFieldProps extends FieldProps {
  // additional fields intending to pass down
  disabled?: boolean
  children?: React.ReactNode
  'data-cy'?: string
  customOnBlur?: (event) => void
}

interface IDatePickerFieldProps extends IFieldProps {
  customChange?: (location) => void
}

export const DatePickerField = ({
  input,
  meta,
  customChange,
  ...rest
}: IDatePickerFieldProps) => (
  <>
    <StyledDatePicker
      invalid={meta.error && meta.touched}
      {...input}
      {...rest}
      onChange={(date) => {
        input.onChange(date)
        if (customChange) {
          customChange(date)
        }
        input.onBlur()
      }}
    />
    {meta.error && meta.touched ? (
      <ErrorMessage>{meta.error}</ErrorMessage>
    ) : null}
  </>
)
export const HiddenInputField = ({ input, meta, ...rest }: IFieldProps) => (
  <>
    <Input
      variant={meta.error && meta.touched ? 'error' : 'input'}
      {...input}
      {...rest}
    />
  </>
)
