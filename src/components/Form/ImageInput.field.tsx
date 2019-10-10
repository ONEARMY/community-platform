import React from 'react'
import { ImageInput } from '../ImageInput/ImageInput'
import { IFieldProps } from './Fields'
import { FieldContainer, ErrorMessage } from './elements'

export const ImageInputField = ({ input, meta, ...rest }: IFieldProps) => (
  <>
    <FieldContainer invalid={meta.touched && meta.error}>
      <ImageInput
        {...rest}
        // as validation happens on blur also want to artificially trigger when values change
        // (no native blur event)
        onFilesChange={file => {
          console.log('UPLOADED', file)
          input.onChange(file)
          input.onBlur()
        }}
      />
    </FieldContainer>
    {meta.error && meta.touched && <ErrorMessage>{meta.error}</ErrorMessage>}
  </>
)
