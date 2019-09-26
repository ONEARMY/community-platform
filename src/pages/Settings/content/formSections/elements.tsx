import styled from 'styled-components'
import { Field } from 'react-final-form'
import theme from 'src/themes/styled.theme'

export const Label = styled.label`
  margin: 0 5px;
  padding: 0 10px;
  border-radius: 5px;
  border: 1px solid ${theme.colors.grey};
  &:has(input:checked) {
    background-color: grey;
  }
  &:hover {
    background-color: ${theme.colors.grey};
    border: 1px solid ${theme.colors.blue};
  }
`

export const RadioInputWImg = styled(Field)`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  & + img {
    cursor: pointer;
  }
  &:checked + img {
    border: 2px solid ${theme.colors.blue};
  }
`
