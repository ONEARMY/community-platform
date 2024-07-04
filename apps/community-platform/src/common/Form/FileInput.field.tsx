import { FileInput } from './FileInput/FileInput'

import type { FieldProps } from './types'

export const FileInputField = ({ input, ...rest }: FieldProps) => (
  <FileInput
    {...rest}
    onFilesChange={(files) => {
      input.onChange(files)
      input.onBlur()
    }}
  />
)
