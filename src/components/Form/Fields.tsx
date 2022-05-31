import * as React from 'react'
import { Input } from 'theme-ui'
import type { FieldRenderProps } from 'react-final-form'

// any props can be passed to field and down to child component
// input and meta props come from react field render props and will be
// picked up by typing
type FieldProps = FieldRenderProps<any, any> & { children?: React.ReactNode }

export interface IFieldProps extends FieldProps {
  // additional fields intending to pass down
  disabled?: boolean
  children?: React.ReactNode
  'data-cy'?: string
  customOnBlur?: (event) => void
}

export const HiddenInputField = ({ input, meta, ...rest }: IFieldProps) => (
  <>
    <Input
      type="hidden"
      variant={meta.error && meta.touched ? 'error' : 'input'}
      {...input}
      {...rest}
    />
  </>
)
