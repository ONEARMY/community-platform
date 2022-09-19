import ReactSelect from 'react-select'
import type {
  OptionsOrGroups,
  StylesConfig,
  Props as ReactSelectProps,
} from 'react-select'
import { useTheme } from '@emotion/react'
import { DropdownIndicator } from './DropdownIndicator'
import { Option } from './Option'

export interface Props extends ReactSelectProps {
  options: OptionsOrGroups<any, any>
  value?: any
  onChange?: any
  placeholder?: string
  isMulti?: boolean
  isClearable?: boolean
  getOptionLabel?: any
  getOptionValue?: any
  defaultValue?: any
  variant?: 'form' | 'icons'
  components?: any
}

export const Select = (props: Props) => {
  const theme: any = useTheme()

  const SelectStyles: Partial<StylesConfig> = {
    container: (provided) => ({
      ...provided,
      fontSize: theme.fontSizes[2] + 'px',
      fontFamily: '"Varela Round", Arial, sans-serif',
    }),
    control: (provided) => ({
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

    option: (provided) => ({
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

    menu: (provided) => ({
      ...provided,
      border: '1px solid ' + theme.colors.softblue,
      boxShadow: 'none',
      backgroundColor: theme.colors.background,
      ':hover': {
        border: '1px solid ' + theme.colors.softblue,
      },
    }),

    multiValue: (provided) => ({
      ...provided,
      backgroundColor: theme.colors.softblue,
      padding: '2px',
      border: '1px solid ' + theme.colors.softgrey,
      color: theme.colors.grey,
    }),

    indicatorSeparator: (provided) => ({
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

  const FilterStyles: Partial<StylesConfig> = {
    container: (provided) => ({
      ...provided,
      fontSize: theme.fontSizes[2] + 'px',
      fontFamily: '"Varela Round", Arial, sans-serif',
      border: '2px solid ' + theme.colors.black,
      borderRadius: '5px',
      color: theme.colors.black,
    }),
    control: (provided) => ({
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
    placeholder: (provided) => ({
      ...provided,
      color: theme.colors.black,
    }),
    option: (provided) => ({
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

    menu: (provided) => ({
      ...provided,
      border: '2px solid ' + theme.colors.black,
      boxShadow: 'none',
      backgroundColor: theme.colors.white,
      ':hover': {
        border: '2px solid ' + theme.colors.black,
      },
    }),

    multiValue: (provided) => ({
      ...provided,
      backgroundColor: theme.colors.softblue,
      padding: '2px',
      border: '1px solid ' + theme.colors.black,
      color: theme.colors.grey,
    }),

    indicatorSeparator: (provided) => ({
      ...provided,
      display: 'none',
    }),

    valueContainer: (base) => ({
      ...base,
      flexWrap: 'nowrap',
      overflow: 'auto',
    }),
  }

  const options: OptionsOrGroups<any, any> | undefined = props.options || []
  return (
    <ReactSelect
      defaultValue={props.defaultValue}
      components={{ DropdownIndicator, Option }}
      options={options}
      isClearable={!!props.isClearable}
      isMulti={!!props.isMulti}
      placeholder={props.placeholder}
      styles={props.variant === 'form' ? SelectStyles : FilterStyles}
      value={props.value}
      getOptionLabel={props.getOptionLabel && props.getOptionLabel}
      getOptionValue={props.getOptionValue && props.getOptionValue}
      onChange={(v) => props.onChange && props.onChange(v)}
    />
  )
}
