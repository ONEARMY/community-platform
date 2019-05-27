import React from 'react'
import { IFieldProps } from './Fields'
import { LocationSearch } from '../LocationSearch/LocationSearch'

export const LocationSearchField = ({ input, meta, ...rest }: IFieldProps) => (
  <LocationSearch
    {...rest}
    onChange={location => {
      // as validation happens on blur also want to artificially trigger when values change
      // (no native blur event)
      input.onChange(location)
      input.onBlur()
    }}
  />
)
