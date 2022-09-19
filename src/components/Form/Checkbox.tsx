import type { FieldProps } from './types'
import theme from 'src/themes/styled.theme'
import styled from '@emotion/styled'

const StyledLabel = styled.label`
  font-size: ${theme.fontSizes[2] + 'px'};
  cursor: pointer;
`
export const CheckboxInput = ({
  input,
  id,
  labelText,
  ...rest
}: FieldProps) => {
  return (
    <>
      <input id={id} type="checkbox" {...input} {...rest}></input>
      <StyledLabel htmlFor={id}>{labelText}</StyledLabel>
    </>
  )
}
