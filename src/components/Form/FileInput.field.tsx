import { IFieldProps } from './Fields'
import { FileInput } from '../FileInput/FileInput'

export const FileInputField = ({ input, meta, ...rest }: IFieldProps) => (
  <FileInput {...rest} onFilesChange={files => input.onChange(files)} />
)
