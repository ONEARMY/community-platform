import styled, { css } from 'styled-components'
import DatePicker from 'react-datepicker'
interface IFormElement {
  invalid?: boolean
  customChange?: (location) => void
}
export const inputStyles = ({ invalid }: IFormElement) => css`
  border: 1px solid
    ${invalid ? props => props.theme.colors.error : 'transparent'};
  border-radius: 5px;
  font-family: 'Inter', Arial, sans-serif;
  font-size: ${props => props.theme.fontSizes[1] + 'px'};
  background: ${props => props.theme.colors.background};
  width: 100%;
  box-sizing: border-box;

  &:disabled {
    border: none;
    color: ${props => props.theme.colors.black};
  }

  &:focus {
    border-color: ${theme.colors.blue};
    outline: none;
  }
`

export const Input = styled.input<IFormElement>`
  ${inputStyles};
  height: 40px;
  padding: 10px;
`

export const BlackPlaceholderInput = styled.input<IFormElement>`
  ${inputStyles};
  height: 40px;
  padding: 10px;

  ::placeholder {
    color: black;
  }
`

export const StyledDatePicker = styled(DatePicker)`
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
  height: 100%;
  width: 100%;
  ${inputStyles};
  border: none;
  padding: 0;
`
export const ErrorMessage = styled.span`
  position: relative;
  color: ${props => props.theme.colors.error};
  font-size: ${props => props.theme.fontSizes[0]}px;
  height: ${props => props.theme.space[0]};
  margin: 5px;
`