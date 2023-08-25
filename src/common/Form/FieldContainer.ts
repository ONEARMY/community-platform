import styled from '@emotion/styled'
import { css } from '@emotion/react'

interface IFormElement {
  invalid?: boolean
  customChange?: (location) => void
}

const inputStyles = ({ invalid }: IFormElement) => css`
  border-width: 1px;
  border-style: solid;
  border-color: ${invalid ? 'error' : 'transparent'};
  border-radius: 5px;
  font-family: 'Inter', Arial, sans-serif;
  font-size: 12px;
  background-color: background;
  width: 100%;
  box-sizing: border-box;

  &:disabled {
    border: none;
    color: black;
  }

  &:focus {
    border-color: blue;
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
