import type { FieldProps } from './types'
import { FileInput } from './FileInput/FileInput'

export const FileInputField = ({ input, ...rest }: FieldProps) => (
  <FileInput {...rest} onFilesChange={(files) => input.onChange(files)} />
)
