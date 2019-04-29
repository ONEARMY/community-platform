import React from 'react'
import { ImageInput } from '../ImageInput/ImageInput'

export const ImageInputField = ({ input, meta, ...rest }) => (
  <ImageInput {...rest} onInputChange={files => input.onInputChange(files)} />
)
