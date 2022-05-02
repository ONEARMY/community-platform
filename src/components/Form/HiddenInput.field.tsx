import type { IFieldProps } from './types'
import { Input } from './elements'

export const HiddenInputField = ({ input, meta, ...rest }: IFieldProps) => (
  <>
    <Input invalid={meta.error && meta.touched} {...input} {...rest} />
  </>
)
