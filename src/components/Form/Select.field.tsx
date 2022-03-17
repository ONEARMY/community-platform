import * as React from 'react'
import Select from 'react-select'
import { Props as SelectProps } from 'react-select/lib/Select'
import { Styles } from 'react-select/lib/styles'
import theme from 'src/themes/styled.theme'
import { Flex } from 'src/components/Flex'
import { ErrorMessage, FieldContainer } from './elements'
import { IFieldProps } from './Fields'
import { DropdownIndicator } from '../DropdownIndicator'

interface ISelectOption {
  value: string
  label: string
}
interface ISelectFieldProps extends IFieldProps, SelectProps {
  options?: ISelectOption[]
  placeholder?: string
  style?: React.CSSProperties
  onCustomChange?: (value) => void
}

// TODO - better bind the above input styles to the react-select component
// (currently implements its own styling with following overrides)
export const SelectStyles: Partial<Styles> = {
  container: provided => ({
    ...provided,
    fontSize: theme.fontSizes[2] + 'px',
    fontFamily: '"Varela Round", Arial, sans-serif',
  }),
  control: provided => ({
    ...provided,
    border: '1px solid ' + theme.colors.softblue,
    backgroundColor: theme.colors.background,
    minHeight: '40px',
    boxShadow: 'none',
    ':focus': {
      border: '1px solid ' + theme.colors.blue,
      outline: 'none',
    },
    ':hover': {
      border: '1px solid ' + theme.colors.blue,
    },
  }),

  option: provided => ({
    ...provided,
    backgroundColor: theme.colors.background,
    boxShadow: 'none',
    color: theme.colors.black,
    ':hover': {
      outline: 'none',
      backgroundColor: theme.colors.white,
      color: theme.colors.black,
    },
  }),

  menu: provided => ({
    ...provided,
    border: '1px solid ' + theme.colors.softblue,
    boxShadow: 'none',
    backgroundColor: theme.colors.background,
    ':hover': {
      border: '1px solid ' + theme.colors.softblue,
    },
  }),

  multiValue: provided => ({
    ...provided,
    backgroundColor: theme.colors.softblue,
    padding: '2px',
    border: '1px solid ' + theme.colors.softgrey,
    color: theme.colors.grey,
  }),

  indicatorSeparator: provided => ({
    ...provided,
    display: 'none',
  }),

  dropdownIndicator: (provided, state) => ({
    ...provided,
    ':hover': {
      opacity: state.isFocused ? 1 : 0.5,
    },
    opacity: state.isFocused ? 1 : 0.3,
  }),
}

export const FilterStyles: Partial<Styles> = {
  container: provided => ({
    ...provided,
    fontSize: theme.fontSizes[2] + 'px',
    fontFamily: '"Varela Round", Arial, sans-serif',
    border: '2px solid ' + theme.colors.black,
    borderRadius: '5px',
    color: theme.colors.black,
  }),
  control: provided => ({
    ...provided,
    backgroundColor: theme.colors.white,
    minHeight: '40px',
    boxShadow: 'none',
    ':hover': {
      border: '1px solid ' + theme.colors.blue,
    },
    ':focus': {
      border: '1px solid ' + theme.colors.blue,
    },
  }),
  placeholder: provided => ({
    ...provided,
    color: theme.colors.black,
  }),
  option: provided => ({
    ...provided,
    color: theme.colors.black,
    backgroundColor: theme.colors.white,
    boxShadow: 'none',
    ':hover': {
      outline: 'none',
      backgroundColor: theme.colors.softblue,
      color: theme.colors.black,
    },
  }),

  menu: provided => ({
    ...provided,
    border: '2px solid ' + theme.colors.black,
    boxShadow: 'none',
    backgroundColor: theme.colors.white,
    ':hover': {
      border: '2px solid ' + theme.colors.black,
    },
  }),

  multiValue: provided => ({
    ...provided,
    backgroundColor: theme.colors.softblue,
    padding: '2px',
    border: '1px solid ' + theme.colors.black,
    color: theme.colors.grey,
  }),

  indicatorSeparator: provided => ({
    ...provided,
    display: 'none',
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

export const SelectField = ({
  input,
  meta,
  onCustomChange,
  ...rest
}: ISelectFieldProps) => (
  // note, we first use a div container so that default styles can be applied
  <>
    <Flex p={0} sx={{flexWrap: 'nowrap'}}>
      <FieldContainer
        invalid={meta.error && meta.touched}
        style={rest.style}
        data-cy={rest['data-cy']}
      >
        <Select
          styles={SelectStyles}
          onChange={v => {
            input.onChange(getValueFromSelect(v as any))
            if (onCustomChange) {
              onCustomChange(getValueFromSelect(v as any))
            }
          }}
          onBlur={input.onBlur as any}
          onFocus={input.onFocus as any}
          value={getValueForSelect(rest.options, input.value)}
          classNamePrefix={'data-cy'}
          components={{ DropdownIndicator }}
          {...defaultProps}
          {...rest}
        />
      </FieldContainer>
    </Flex>
    {meta.error && meta.touched && <ErrorMessage>{meta.error}</ErrorMessage>}
  </>
)
