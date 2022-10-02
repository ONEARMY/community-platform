import type { ReactNode } from 'react'
import type { FieldRenderProps } from 'react-final-form'

// any props can be passed to field and down to child component
// input and meta props come from react field render props and will be
// picked up by typing
export type FieldProps = FieldRenderProps<any, any> & {
  disabled?: boolean
  children?: ReactNode
  'data-cy'?: string
  customOnBlur?: (event: any) => void
}
