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

type EmptyObj = Record<never, never>

export type IStepErrorsList = (INestedErrorList | EmptyObj)[]

export interface INestedErrorList {
  [key: string]: string
}

export interface ITopLevelErrorsList {
  [key: string]: string | IStepErrorsList
}

interface Label {
  title: string
  description?: string
  error?: string
  placeholder?: string
}

export interface ILabels {
  [key: string]: Label
}

export interface IErrorsListSet {
  errors: ITopLevelErrorsList
  keys: string[]
  labels: ILabels
  title?: string
}
