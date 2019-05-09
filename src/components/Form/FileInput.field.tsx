import React from 'react'
import { IFieldProps } from './Fields'
import { FileInput } from '../FileInput/FileInput'
import { FieldContainer } from './elements'

export const FileInputField = ({ input, meta, ...rest }: IFieldProps) => (
  <FieldContainer>
    <FileInput {...rest} onFilesChange={files => input.onChange(files)} />
  </FieldContainer>
)
