import styled from 'styled-components'
import { Field } from 'react-final-form'
import theme from 'src/themes/styled.theme'

export const Label = styled.label`
  margin: 10px;
  /* padding: 0 10px; */
  &:has(input:checked) {
    background-color: grey;
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
