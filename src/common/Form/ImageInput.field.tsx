import * as React from 'react'
import { Text } from 'theme-ui'
import { ImageInput } from './ImageInput/ImageInput'
import { FieldContainer } from './FieldContainer'
import type { FieldProps } from './types'

// Assign correct typing so that ImageInput props can also be passed down to child
// Note, partial as default onChange function provided
type IImageInputProps = Partial<React.ComponentProps<typeof ImageInput>>

interface IExtendedFieldProps extends FieldProps, IImageInputProps {
  // add additional onChange style method to respond more directly to value changes
  // without need for react-final-form listener
  customChange?: (value) => void
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
      style={{
        height: '100%',
        width: '100%',
        overflow: 'hidden',
      }}
      invalid={meta.touched && meta.error}
      data-cy={dataCy}
    >
      <ImageInput
        {...rest}
        value={input.value}
        // as validation happens on blur also want to artificially trigger when values change
        // (no native blur event)
        onFilesChange={(value) => {
          input.onChange(value)
          if (customChange) {
            customChange(value)
          }
          input.onBlur()
        }}
      />
    </FieldContainer>
    {meta.error && meta.touched && (
      <Text sx={{ fontSize: 0, margin: 1, color: 'error' }}>{meta.error}</Text>
    )}
  </>
)
