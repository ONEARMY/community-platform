import * as React from 'react'
import {
  TextAreaStyled,
  Input,
  TextAreaDisabled,
  ErrorMessage,
  StyledDatePicker,
} from './elements'
import { FieldRenderProps } from 'react-final-form'
import 'react-datepicker/dist/react-datepicker.css'
import { capitalizeFirstLetter } from 'src/utils/helpers'

// any props can be passed to field and down to child component
// input and meta props come from react field render props and will be
// picked up by typing
type FieldProps = FieldRenderProps<any, any> & { children?: React.ReactNode }

type InputModifiers = {
  capitalize?: boolean
}
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

const processInputModifiers = (value: any, modifiers: InputModifiers = {}) => {
  if (typeof value !== 'string') return value
  if (modifiers.capitalize) {
    value = capitalizeFirstLetter(value)
  }
  return value
}

export const InputField = ({
  input,
  meta,
  customOnBlur,
  modifiers,
  ...rest
}: IFieldProps) => (
  <>
    <Input
      invalid={meta.error && meta.touched}
      {...input}
      {...rest}
      onBlur={e => {
        if (modifiers) {
          e.target.value = processInputModifiers(e.target.value, modifiers)
          input.onChange(e)
        }
        if (customOnBlur) {
          customOnBlur(e)
        }
        input.onBlur(e)
      }}
    />
    {meta.error && meta.touched ? (
      <ErrorMessage>{meta.error}</ErrorMessage>
    ) : null}
  </>
)

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
      onChange={date => {
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
    <Input invalid={meta.error && meta.touched} {...input} {...rest} />
  </>
)

export const TextAreaField = ({
  input,
  meta,
  disabled,
  modifiers,
  customOnBlur,
  ...rest
}: IFieldProps) =>
  disabled ? (
    // want disabled textarea to just render as styled div to remove scrollbars
    <TextAreaDisabled>{input.value}</TextAreaDisabled>
  ) : (
    <>
      <TextAreaStyled
        invalid={meta.error && meta.touched}
        {...input}
        {...rest}
        onBlur={e => {
          if (modifiers) {
            e.target.value = processInputModifiers(e.target.value, modifiers)
            input.onChange(e)
          }
          if (customOnBlur) {
            customOnBlur(e)
          }
          input.onBlur()
        }}
      />
      {meta.error && meta.touched && <ErrorMessage>{meta.error}</ErrorMessage>}
    </>
  )
