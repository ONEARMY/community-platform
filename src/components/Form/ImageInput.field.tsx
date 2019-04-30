import React from 'react'
import { ImageInput } from '../ImageInput/ImageInput'
import { IFieldProps } from './Fields'
import { FieldContainer } from './elements'

export const ImageInputField = ({ input, meta, ...rest }: IFieldProps) => (
  <FieldContainer>
    <ImageInput {...rest} onFilesChange={files => input.onChange(files)} />
  </FieldContainer>
)
