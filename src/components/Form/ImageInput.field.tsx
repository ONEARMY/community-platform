import React from 'react'
import { ImageInput } from '../ImageInput/ImageInput'
import { IFieldProps } from './Fields'
import { FieldContainer, ErrorMessage } from './elements'

interface IExtendedFieldProps extends IFieldProps {
  // add additional onChange style method to respond more directly to value changes
  // without need for react-final-form listener
  customChange?: (location) => void
}

export const ImageInputField = ({
  input,
  meta,
  'data-cy': dataCy,
  customChange,
  ...rest
}: IExtendedFieldProps) => (
  <>
    <FieldContainer
      style={{ height: '100%', width: '100%', overflow: 'hidden' }}
      invalid={meta.touched && meta.error}
      data-cy={dataCy}
    >
      <ImageInput
        {...rest}
        // as validation happens on blur also want to artificially trigger when values change
        // (no native blur event)
        onFilesChange={file => {
          input.onChange(file)
          if (customChange) {
            customChange(file)
          }
          input.onBlur()
        }}
      />
    </FieldContainer>
    {meta.error && meta.touched && <ErrorMessage>{meta.error}</ErrorMessage>}
  </>
)
