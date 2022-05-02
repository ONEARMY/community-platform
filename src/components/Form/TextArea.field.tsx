import type { IFieldProps } from './types'
import { TextAreaStyled, TextAreaDisabled, ErrorMessage } from './elements'
import 'react-datepicker/dist/react-datepicker.css'
import { processInputModifiers } from '../../utils/processInputModifiers'

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
        onBlur={(e) => {
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
