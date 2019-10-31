import React from 'react'
import { ImageInput } from '../ImageInput/ImageInput'
import { IFieldProps } from './Fields'
import { FieldContainer, ErrorMessage } from './elements'

export const ImageInputField = ({
  input,
  meta,
  'data-cy': dataCy,
  ...rest
}: IFieldProps) => (
  <>
    <FieldContainer invalid={meta.touched && meta.error} data-cy={dataCy}>
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
    {meta.error && meta.touched && <ErrorMessage>{meta.error}</ErrorMessage>}
  </>
)
