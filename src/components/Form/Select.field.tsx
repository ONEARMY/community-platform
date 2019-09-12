import * as React from 'react'
import ReactFlagsSelect from 'react-flags-select'
import Select from 'react-select'
import { Props as SelectProps } from 'react-select/lib/Select'
import { Styles } from 'react-select/lib/styles'
import theme from 'src/themes/styled.theme'
import { getCountryName } from 'src/utils/helpers'
import { FlexContainer } from '../Layout/FlexContainer'
import { ErrorMessage, FieldContainer } from './elements'
import { IFieldProps } from './Fields'

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
    fontSize: theme.fontSizes[2] + 'px',
  }),
  control: (provided, state) => ({
    ...provided,
    border: 'none',
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
  <FlexContainer p={0} flexWrap="wrap">
    <FieldContainer invalid={meta.error && meta.touched} style={rest.style}>
      <Select
        styles={SelectStyles}
        onChange={v => {
          input.onChange(getValueFromSelect(v))
        }}
        onBlur={input.onBlur}
        onFocus={input.onFocus}
        value={getValueForSelect(rest.options, input.value)}
        {...defaultProps}
        {...rest}
      />
    </FieldContainer>
    {meta.error && meta.touched && <ErrorMessage>{meta.error}</ErrorMessage>}
  </FlexContainer>
)

export const FlagSelector = ({ input, meta, ...rest }: ISelectFieldProps) => (
  <>
    <ReactFlagsSelect
      onSelect={v => {
        input.onChange(getCountryName(v))
      }}
      onBlur={input.onBlur}
      onFocus={input.onFocus}
      {...defaultProps}
      {...rest}
    />
    {/* meta.error && meta.touched && <ErrorMessage>{meta.error}</ErrorMessage> */}
  </>
)
