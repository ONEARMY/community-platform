import { ImageInputV2 } from 'oa-components'
import { Text } from 'theme-ui'

import { FieldContainer } from './FieldContainer'

import type { FieldProps } from './types'

type IImageInputProps = Partial<React.ComponentProps<typeof ImageInputV2>>

interface IProps extends FieldProps, IImageInputProps {
  dataCy: string
}

export const ImageInputFieldV2 = (props: IProps) => {
  const { dataCy, meta, onFilesChange } = props

  return (
    <FieldContainer
      data-cy={dataCy}
      style={{
        height: '100%',
        width: '100%',
        overflow: 'hidden',
      }}
      invalid={meta.touched && meta.error}
    >
      {meta.error && meta.touched && (
        <Text sx={{ fontSize: 1, color: 'error' }}>{meta.error}</Text>
      )}

      <ImageInputV2
        existingImage={props.existingImage}
        onFilesChange={(file) => onFilesChange && onFilesChange(file)}
      />
    </FieldContainer>
  )
}
