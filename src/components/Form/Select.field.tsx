import * as React from 'react'
import ReactFlagsSelect from 'react-flags-select'
import Select from 'react-select'
import { Props as SelectProps } from 'react-select/lib/Select'
import { Styles } from 'react-select/lib/styles'
import theme from 'src/themes/styled.theme'
import { getCountryName } from 'src/utils/helpers'
import { Flex } from 'src/components/Flex'
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
  onCustomChange?: (value) => void
}

// TODO - better bind the above input styles to the react-select component
// (currently implements its own styling with following overrides)
export const SelectStyles: Partial<Styles> = {
  container: (provided, state) => ({
    ...provided,
    fontSize: theme.fontSizes[1] + 'px',
    fontFamily: '"Varela Round", Arial, sans-serif',
  }),
  control: (provided, state) => ({
    ...provided,
    border: '1px solid #dce4e5',
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

  option: (provided, state) => ({
    ...provided,
    backgroundColor: theme.colors.background,
    boxShadow: 'none',
    color: 'black',
    ':hover': {
      outline: 'none',
      backgroundColor: 'white',
      color: 'black',
    },
  }),

  menu: (provided, state) => ({
    ...provided,
    border: '1px solid #dce4e5',
    boxShadow: 'none',
    backgroundColor: theme.colors.background,
    ':hover': {
      border: '1px solid #dce4e5',
    },
  }),

  multiValue: (provided, state) => ({
    ...provided,
    backgroundColor: theme.colors.softblue,
    padding: '2px',
    border: '1px solid #c2d4e4',
    color: theme.colors.grey,
  }),

  indicatorSeparator: (provided, state) => ({
    ...provided,
    display: 'none',
  }),
}

export const FilterStyles: Partial<Styles> = {
  container: (provided, state) => ({
    ...provided,
    fontSize: theme.fontSizes[1] + 'px',
    fontFamily: '"Varela Round", Arial, sans-serif',
    border: '2px solid black',
    borderRadius: '5px',
    color: 'black',
  }),
  control: (provided, state) => ({
    ...provided,
    backgroundColor: 'white',
    minHeight: '40px',
    boxShadow: 'none',
    ':hover': {
      border: '1px solid ' + theme.colors.blue,
    },
    ':focus': {
      border: '1px solid ' + theme.colors.blue,
    },
  }),

  option: (provided, state) => ({
    color: 'black',
    ...provided,
    backgroundColor: 'white',
    boxShadow: 'none',
    ':hover': {
      outline: 'none',
      backgroundColor: theme.colors.softblue,
      color: 'black',
    },
  }),

  menu: (provided, state) => ({
    ...provided,
    border: '2px solid black',
    boxShadow: 'none',
    backgroundColor: 'white',
    ':hover': {
      border: '2px solid black',
    },
  }),

  multiValue: (provided, state) => ({
    ...provided,
    backgroundColor: theme.colors.softblue,
    padding: '2px',
    border: '1px solid black',
    color: theme.colors.grey,
  }),

  indicatorSeparator: (provided, state) => ({
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
    <Flex p={0} flexWrap="nowrap">
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
          onBlur={input.onBlur}
          onFocus={input.onFocus}
          value={getValueForSelect(rest.options, input.value)}
          classNamePrefix={'data-cy'}
          {...defaultProps}
          {...rest}
        />
      </FieldContainer>
    </Flex>
    {meta.error && meta.touched && <ErrorMessage>{meta.error}</ErrorMessage>}
  </>
)

export const FlagSelector = ({ input, meta, ...rest }: ISelectFieldProps) => (
  <Flex p={0} flexWrap="wrap">
    <FieldContainer
      invalid={meta.error && meta.touched}
      data-cy={rest['data-cy']}
    >
      <ReactFlagsSelect
        onSelect={v => {
          input.onChange(getCountryName(v))
        }}
        onBlur={input.onBlur}
        onFocus={input.onFocus}
        {...defaultProps}
        {...rest}
      />
    </FieldContainer>
    {meta.error && meta.touched && (
      <ErrorMessage style={{ bottom: '-10px' }}>{meta.error}</ErrorMessage>
    )}
  </Flex>
)
