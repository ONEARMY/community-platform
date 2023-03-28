import styled from '@emotion/styled'
import { css } from '@emotion/react'
// TODO: Remove direct usage of Theme
import { preciousPlasticTheme } from 'oa-themes'
const theme = preciousPlasticTheme.styles

interface IFormElement {
  invalid?: boolean
  customChange?: (location) => void
}

const inputStyles = ({ invalid }: IFormElement) => css`
  border: 1px solid ${invalid ? theme.colors.error : 'transparent'};
  border-radius: 5px;
  font-family: 'Inter', Arial, sans-serif;
  font-size: ${theme.fontSizes[1] + 'px'};
  background: ${theme.colors.background};
  width: 100%;
  box-sizing: border-box;

  &:disabled {
    border: none;
    color: ${theme.colors.black};
  }

  &:focus {
    border-color: ${theme.colors.blue};
    outline: none;
  }
`

// generic container used for some custom component fields
export const FieldContainer = styled.div<IFormElement>`
  height: 100%;
  width: 100%;
  ${inputStyles};
  border: none;
  padding: 0;
`
