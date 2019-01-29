import styled, { css } from 'styled-components'
import Link from 'react-router-dom/Link'

const getBorder = ({ border }) => {
  if (border) {
    return `border: 1px solid black;`
  }

  return `border: none;`
}

const baseButton = css`
  text-transform: uppercase;
  text-decoration: none;
  height: 40px;
  background-color: white;
  ${props => getBorder(props)};
  border-radius: 5px;
  font-size: 0.8em;
  color: black;
  display: flex;
  flex: none;
  align-self: center;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  white-space: nowrap;
  word-break: keep-all;
  cursor: pointer;
`

export const StyledButton = styled.button`
  ${baseButton};
`

export const Label = styled.span`
  display: block;
  flex: 0 0 auto;
  line-height: inherit;
  color: inherit;
  align-self: center;
`
