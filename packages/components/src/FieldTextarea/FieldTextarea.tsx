interface Props {
  meta: any
  input: any
  disabled: boolean
}
import { Textarea, Text } from 'theme-ui'

const capitalizeFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1)

const processInputModifiers = (value: any, modifiers: any = {}) => {
  if (typeof value !== 'string') return value
  if (modifiers.capitalize) {
    value = capitalizeFirstLetter(value)
  }
  return value
}

export const FieldTextarea = ({
  input,
  meta,
  disabled,
  modifiers,
  customOnBlur,
  ...rest
}: any) => {
  return (
    <>
      <Textarea
        disabled={disabled}
        invalid={meta?.error && meta?.touched}
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

      {meta.error && meta.touched && <Text>{meta.error}</Text>}
    </>
  )
}
