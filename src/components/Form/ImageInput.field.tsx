import React from 'react'
import { ImageInput } from '../ImageInput/ImageInput'
import { IFieldProps } from './Fields'

export const ImageInputField = ({ input, meta, ...rest }: IFieldProps) => (
  <ImageInput {...rest} onFilesChange={files => input.onChange(files)} />
)
