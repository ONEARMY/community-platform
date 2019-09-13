import styled, { css } from 'styled-components'
import theme from 'src/themes/styled.theme'
interface IFormElement {
  invalid?: boolean
}
export const inputStyles = ({ invalid }: IFormElement) => css`
  border: 1px solid ${invalid ? theme.colors.error : theme.colors.black};
  border-radius: 5px;
  font-family: 'Inter', Arial, sans-serif;
  font-size: ${theme.fontSizes[1] + 'px'};
  background: ${theme.colors.background};
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 10px;

  &:disabled {
    border: none;
    color: ${theme.colors.black};
  }

  &:focus {
    border-color: #83ceeb;
    outline: none;
  }
`

export const Input = styled.input<IFormElement>`
  ${inputStyles};
  height: 40px;
  padding: 10px;
`

export const TextAreaStyled = styled.textarea<IFormElement>`
  ${inputStyles};
  padding: 10px;
  height: 150px;
`
export const TextAreaDisabled = styled.div`
  ${inputStyles};
  border: none;
`

// generic container used for some custom component fields
export const FieldContainer = styled.div<IFormElement>`
  width: 100%;
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
