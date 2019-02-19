import styled, { css } from 'styled-components'
import { variant, color, space, width } from 'styled-system'

const baseStyles = css`
  text-transform: uppercase;
  text-decoration: none;
  height: 50px;
  border: none;
  border-radius: 5px;
  font-size: 0.8em;
  display: flex;
  flex: none;
  align-self: center;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  white-space: nowrap;
  word-break: keep-all;
  cursor: pointer;
  &:disabled {
    cursor: not-allowed;
    opacity: 0.3;
  }
`
const colorsVariant = variant({
  key: 'buttons',
})

export const StyledButton = styled.button`
  ${baseStyles}
  ${colorsVariant}
  ${space}
  ${width}
  ${color}
  `

StyledButton.defaultProps = {
  className: 'button',
  variant: 'primary',
}

export const Label = styled.span`
  display: block;
  flex: 0 0 auto;
  line-height: inherit;
  color: inherit;
  align-self: center;
`
