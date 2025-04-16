import { ImageInput } from 'oa-components'
import { Text } from 'theme-ui'

import { FieldContainer } from './FieldContainer'

import type { FieldProps } from './types'

// Assign correct typing so that ImageInput props can also be passed down to child
// Note, partial as default onChange function provided
type IImageInputProps = Partial<React.ComponentProps<typeof ImageInput>>

interface IProps extends FieldProps, IImageInputProps {}

export const ImageInputField = (props: IProps) => {
  const { input, meta, 'data-cy': dataCy, dataTestId, ...rest } = props

  // as validation happens on blur also want to artificially trigger when values change
  // (no native blur event)
  const onFilesChange = (value) => {
    input.onChange(value)
    input.onBlur()
  }

  return (
    <FieldContainer
      style={{
        height: '100%',
        width: '100%',
        overflow: 'hidden',
      }}
      invalid={meta.touched && meta.error}
      data-cy={dataCy}
    >
      {meta.error && meta.touched && (
        <Text sx={{ fontSize: 1, color: 'error' }}>{meta.error}</Text>
      )}

      <ImageInput
        {...rest}
        dataTestId={dataTestId}
        value={input.value}
        onFilesChange={onFilesChange}
      />
    </FieldContainer>
  )
}
