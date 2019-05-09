import React from 'react'
import { ImageInput } from '../ImageInput/ImageInput'
import { IFieldProps } from './Fields'
import { FieldContainer } from './elements'

export const ImageInputField = ({ input, meta, ...rest }: IFieldProps) => (
  <FieldContainer>
    <ImageInput
      {...rest}
      // as validation happens on blur also want to artificially trigger when values change
      // (no native blur event)
      onFilesChange={files => {
        input.onChange(files)
        input.onBlur()
      }}
    />
  </FieldContainer>
)
