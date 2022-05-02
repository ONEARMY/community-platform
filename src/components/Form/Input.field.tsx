import type { IFieldProps } from './types'
import { Input, ErrorMessage } from './elements'
import { processInputModifiers } from '../../utils/processInputModifiers'

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
      onBlur={(e) => {
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
