import type { IFieldProps } from './types'
import { StyledDatePicker, ErrorMessage } from './elements'

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
