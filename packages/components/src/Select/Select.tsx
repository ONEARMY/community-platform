import ReactSelect from 'react-select'
import { useTheme } from '@emotion/react'

import { DropdownIndicator } from './DropdownIndicator'
import { Option } from './Option'

import type {
  OptionsOrGroups,
  Props as ReactSelectProps,
  StylesConfig,
} from 'react-select'

type IOption = {
  label: string
  value: string
}

export interface Props extends ReactSelectProps {
  options: OptionsOrGroups<any, any>
  value?: any
  onChange?: (arg: any) => void
  placeholder?: string
  isMulti?: boolean
  isClearable?: boolean
  getOptionLabel?: any
  getOptionValue?: any
  defaultValue?: IOption
  variant?: 'form' | 'icons' | 'tabs'
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
      cursor: 'pointer',
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
      backgroundColor: state.isFocused
        ? theme.colors.white
        : theme.colors.background,
      boxShadow: 'none',
      cursor: 'pointer',
      color: theme.colors.black,
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
      cursor: 'pointer',
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
    option: (provided, state) => ({
      ...provided,
      color: theme.colors.black,
      backgroundColor: state.isFocused
        ? theme.colors.softblue
        : theme.colors.white,
      cursor: 'pointer',
      boxShadow: 'none',
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
      classNamePrefix={'data-cy'}
      components={{ DropdownIndicator, Option }}
      defaultValue={props.defaultValue}
      getOptionLabel={props.getOptionLabel && props.getOptionLabel}
      getOptionValue={props.getOptionValue && props.getOptionValue}
      isClearable={!!props.isClearable}
      isMulti={!!props.isMulti}
      placeholder={props.placeholder}
      styles={props.variant === 'form' ? SelectStyles : FilterStyles}
      options={options}
      onChange={(v) => props.onChange && props.onChange(v)}
      value={props.value}
      onInputChange={props.onInputChange}
    />
  )
}
