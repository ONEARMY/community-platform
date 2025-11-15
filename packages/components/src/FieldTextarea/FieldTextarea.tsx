import { useMemo } from 'react'
import { Flex, Text, Textarea } from 'theme-ui'

import { CharacterCount } from '../CharacterCount/CharacterCount'

import type { FieldRenderProps } from 'react-final-form'

type FieldProps = FieldRenderProps<any, any> & { children?: React.ReactNode }
export interface Props extends FieldProps {
  // additional fields intending to pass down
  disabled?: boolean
  children?: React.ReactNode
  showCharacterCount?: boolean
  'data-cy'?: string
  customOnBlur?: (event: any) => void
  rows?: number
}

type InputModifiers = {
  capitalize?: boolean
  trim?: boolean
}

const capitalizeFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1)

const processInputModifiers = (value: any, modifiers: InputModifiers) => {
  if (typeof value !== 'string') return value
  if (modifiers.trim) {
    value = value.trim()
  }
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
  minLength = 0,
  maxLength,
  showCharacterCount,
  rows,
  ...rest
}: Props) => {
  const curLength = useMemo<number>(
    () => input?.value?.length ?? 0,
    [input?.value],
  )
  return (
    <Flex sx={{ flexDirection: 'column', gap: 1 }}>
      {meta.error && meta.touched && (
        <Text sx={{ fontSize: 1, color: 'error' }}>{meta.error}</Text>
      )}

      <Textarea
        disabled={disabled}
        minLength={minLength}
        maxLength={maxLength}
        variant={meta?.error && meta?.touched ? 'textareaError' : 'textarea'}
        rows={rows ? rows : 5}
        sx={{
          resize: rest?.style?.resize ? rest.style.resize : 'vertical',
        }}
        {...input}
        {...rest}
        onBlur={(e) => {
          if (modifiers) {
            e.target.value = processInputModifiers(e.target.value, modifiers)
            input.onChange(e.target.value)
          }
          if (customOnBlur) {
            customOnBlur(e)
          }
          input.onBlur()
        }}
        onChange={(ev) => input.onChange(ev.target.value)}
      />

      {showCharacterCount && maxLength && (
        <CharacterCount
          minSize={minLength}
          maxSize={maxLength}
          currentSize={curLength}
        />
      )}
    </Flex>
  )
}
