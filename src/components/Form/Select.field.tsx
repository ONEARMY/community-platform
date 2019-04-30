import * as React from 'react'
import Select from 'react-select'
import { IFieldProps } from './Fields'
import { Styles } from 'react-select/lib/styles'
import { Props as SelectProps } from 'react-select/lib/Select'
import { FieldContainer } from './elements'

interface ISelectOption {
  value: string
  label: string
}
interface ISelectFieldProps extends IFieldProps, SelectProps {
  options?: ISelectOption[]
  placeholder?: string
  style?: React.CSSProperties
}

// TODO - better bind the above input styles to the react-select component
// (currently implements its own styling with following overrides)
export const SelectStyles: Partial<Styles> = {
  container: (provided, state) => ({
    ...provided,
  }),
  control: (provided, state) => ({
    ...provided,
    borderRadius: 0,
    fontSize: '1em',
  }),
}

// annoyingly react-final-form saves the full option as values (not just the value field)
// therefore the following two functions are used for converting to-from string values and field options

// depending on select type (e.g. multi) and option selected get value
function getValueFromSelect(
  v: ISelectOption | ISelectOption[] | null | undefined,
) {
  return v ? (Array.isArray(v) ? v.map(el => el.value) : v.value) : v
}

// given current values find the relevant select options
function getValueForSelect(
  opts: ISelectOption[] = [],
  v: string | string[] | null | undefined,
) {
  function findVal(optVal: string) {
    return opts.find(o => o.value === optVal)
  }
  return v
    ? Array.isArray(v)
      ? v.map(optVal => findVal(optVal) as ISelectOption)
      : findVal(v)
    : null
}

const defaultProps: Partial<ISelectFieldProps> = {
  getOptionLabel: (option: ISelectOption) => option.label,
  getOptionValue: (option: ISelectOption) => option.value,
  options: [],
}
export const SelectField = ({ input, meta, ...rest }: ISelectFieldProps) => (
  // note, we first use a div container so that default styles can be applied
  <FieldContainer style={rest.style}>
    <Select
      styles={SelectStyles}
      onChange={v => input.onChange(getValueFromSelect(v))}
      value={getValueForSelect(rest.options, input.value)}
      {...defaultProps}
      {...rest}
    />
  </FieldContainer>
)
