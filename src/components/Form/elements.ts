import styled, { css } from 'styled-components'
import theme from 'src/themes/styled.theme'

interface IFormElement {
  invalid?: boolean
}

export const inputStyles = ({ invalid }: IFormElement) => css`
  border: 1px solid ${invalid ? theme.colors.error : theme.colors.black};
  border-radius: 4px;
  font-size: ${theme.fontSizes[2] + 'px'};
  background: white;
  width: 100%;
  margin: ${theme.space[2] + 'px'} 0;
  padding: 10px;
  box-sizing: border-box;
  &:disabled {
    border: none;
    color: ${theme.colors.black};
  }
`

export const Input = styled.input<IFormElement>`
  ${inputStyles};
  height: 40px;
`

export const TextAreaStyled = styled.textarea<IFormElement>`
  ${inputStyles};
  height: 150px;
  font-family: inherit;
`
export const TextAreaDisabled = styled.div`
  ${inputStyles};
  border: none;
`

// generic container used for some custom component fields
export const FieldContainer = styled.div<IFormElement>`
  ${inputStyles};
  border: 'none';
  padding: 0;
`
export const ErrorMessage = styled.span`
  position: relative;
  bottom: ${theme.space[2]}px;
  color: ${theme.colors.error};
  font-size: ${theme.fontSizes[0]}px;
  height: ${theme.space[0]};
`
