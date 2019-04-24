import * as React from 'react'
import { TextAreaStyled, Input, SelectStyled } from './elements'

export const InputField = ({ input, meta, label, ...rest }: any) => (
  <>
    <Input {...input} {...rest} />
    {meta.error && meta.touched && <span>{meta.error}</span>}
  </>
)

export const TextAreaField = ({ input, meta, label, ...rest }: any) => (
  <>
    <TextAreaStyled {...input} {...rest} />
    {meta.error && meta.touched && <span>{meta.error}</span>}
  </>
)

export const SelectField = ({ input, meta, label, ...rest }: any) => (
  <>
    <SelectStyled {...input} {...rest} />
    {meta.error && meta.touched && <span>{meta.error}</span>}
  </>
)
