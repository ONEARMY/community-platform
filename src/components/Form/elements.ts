import styled, { css } from 'styled-components'
import theme from 'src/themes/styled.theme'

export const inputStyles = css`
  border: 1px solid #dce4e5;
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

export const Input = styled.input`
  ${inputStyles};
  height: 40px;
  padding: 10px;
`

export const TextAreaStyled = styled.textarea`
  ${inputStyles};
  padding: 10px;
  height: 150px;
`
export const TextAreaDisabled = styled.div`
  ${inputStyles};
  border: none;
`

// generic container used for some custom component fields
export const FieldContainer = styled.div`
  width: 100%;
`
