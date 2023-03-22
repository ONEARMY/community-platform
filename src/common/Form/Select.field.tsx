import * as React from 'react'
import { Select } from 'oa-components'
import { Flex, Text } from 'theme-ui'
import { FieldContainer } from './FieldContainer'
import type { FieldProps } from './types'

interface ISelectOption {
  value: string
  label: string
}
interface ISelectFieldProps extends FieldProps {
  options?: ISelectOption[]
  placeholder?: string
  style?: React.CSSProperties
  onCustomChange?: (value) => void
  showError?: boolean
}

// annoyingly react-final-form saves the full option as values (not just the value field)
// therefore the following two functions are used for converting to-from string values and field options

// depending on select type (e.g. multi) and option selected get value
const getValueFromSelect = (
  v: ISelectOption | ISelectOption[] | null | undefined,
) => (v ? (Array.isArray(v) ? v.map((el) => el.value) : v.value) : v)

// given current values find the relevant select options
const getValueForSelect = (
  opts: ISelectOption[] = [],
  v: string | string[] | null | undefined,
) => {
  const findVal = (optVal: string) => opts.find((o) => o.value === optVal)
  return v
    ? Array.isArray(v)
      ? v.map((optVal) => findVal(optVal) as ISelectOption)
      : findVal(v)
    : null
}

const defaultProps: Partial<ISelectFieldProps> = {
  getOptionLabel: (option: ISelectOption) => option.label,
  getOptionValue: (option: ISelectOption) => option.value,
  options: [],
}

export const SelectField = ({
  input,
  meta,
  onCustomChange,
  showError = true,
  ...rest
}: ISelectFieldProps) => (
  // note, we first use a div container so that default styles can be applied
  <Flex p={0} sx={{ flexDirection: 'column', flexWrap: 'nowrap' }}>
    <FieldContainer
      invalid={meta.error && meta.touched}
      style={rest.style}
      data-cy={rest['data-cy']}
    >
      <Select
        onChange={(v) => {
          input.onChange(getValueFromSelect(v as any))
          if (onCustomChange) {
            onCustomChange(getValueFromSelect(v as any))
          }
        }}
        onBlur={input.onBlur as any}
        onFocus={input.onFocus as any}
        value={getValueForSelect(rest.options, input.value)}
        variant="form"
        {...defaultProps}
        {...(rest as any)}
      />
    </FieldContainer>
    {showError && meta.error && meta.touched && (
      <Text sx={{ fontSize: 0, margin: 1, color: 'error' }}>{meta.error}</Text>
    )}
  </Flex>
)
