import React from 'react'
import { IFieldProps } from './Fields'
import { LocationSearch } from '../LocationSearch/LocationSearch'

export const LocationSearchField = ({ input, meta, ...rest }: IFieldProps) => (
  <LocationSearch
    {...rest}
    onChange={location => {
      input.onChange(location)
    }}
  />
)
