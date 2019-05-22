import React from 'react'
import { IFieldProps } from './Fields'
import { FieldContainer } from './elements'
import { LocationSearch } from '../LocationSearch/LocationSearch'

export const ImageInputField = ({ input, meta, ...rest }: IFieldProps) => (
  <FieldContainer>
    <LocationSearch
      {...rest}
      onChange={location => {
        input.onChange(location)
      }}
    />
  </FieldContainer>
)
