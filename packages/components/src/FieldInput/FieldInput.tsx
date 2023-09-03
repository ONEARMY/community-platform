import { useState } from 'react'
import type { FieldRenderProps } from 'react-final-form'
import { Text, Input } from 'theme-ui'
import { CharacterCount } from '../CharacterCount/CharacterCount'

type FieldProps = FieldRenderProps<any, any> & { children?: React.ReactNode }

export interface Props extends FieldProps {
  // additional fields intending to pass down
  disabled?: boolean
  children?: React.ReactNode
  showCharacterCount?: boolean
  'data-cy'?: string
  customOnBlur?: (event: any) => void
}

type InputModifiers = {
  capitalize?: boolean
  trim?: boolean
}

const capitalizeFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1)

const processInputModifiers = (value: any, modifiers: InputModifiers = {}) => {
  if (typeof value !== 'string') return value
  if (modifiers.trim) {
    value = value.trim()
  }
  if (modifiers.capitalize) {
    value = capitalizeFirstLetter(value)
  }
  return value
}

export const FieldInput = ({
  input,
  meta,
  disabled,
  modifiers,
  customOnBlur,
  showCharacterCount,
  minLength,
  maxLength,
  ...rest
}: Props) => {
  const [curLength, setLength] = useState<number>(input?.value?.length ?? 0)
  return (
    <>
      <Input
        disabled={disabled}
        variant={meta?.error && meta?.touched ? 'textareaError' : 'textarea'}
        {...input}
        {...rest}
        minLength={minLength}
        maxLength={maxLength}
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
        onChange={(ev) => {
          showCharacterCount && setLength(ev.target.value.length)
          input.onChange(ev)
        }}
      />
      {meta.error && meta.touched && (
        <Text sx={{ fontSize: 0, margin: 1, color: 'error' }}>
          {meta.error}
        </Text>
      )}
      {showCharacterCount && maxLength && (
        <CharacterCount
          currentSize={curLength}
          minSize={minLength}
          maxSize={maxLength}
        />
      )}
    </>
  )
}
