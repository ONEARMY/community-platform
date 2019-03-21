import React from 'react'
import Icon from 'src/components/Icons'
import styled, { css } from 'styled-components'
import {
  Button as RebassButton,
  ButtonProps as RebassButtonProps,
} from 'rebass'

const baseStyles = css`
  min-height: 50px;
  border-radius: 5px;
  display: flex;
  flex: none;
  align-self: center;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  word-break: keep-all;
`
/* cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')}; */

export const BaseButton = styled(RebassButton)`
  ${baseStyles}
`

export const Label = styled.span`
  text-transform: uppercase;
  text-decoration: none;
  display: block;
  flex: 0 0 auto;
  line-height: inherit;
  color: inherit;
  align-self: center;
`

// extend to allow any default button props (e.g. onClick) to also be passed
export interface IBtnProps extends React.ButtonHTMLAttributes<HTMLElement> {
  icon?: string
}

interface IDisabledProp {
  disabled?: boolean
}

type BtnProps = IBtnProps & RebassButtonProps & IDisabledProp

const StyledButton = ({ children, ...props }) => (
  <BaseButton {...props}>{children}</BaseButton>
)

export const Button = (props: BtnProps) => (
  <StyledButton className="button" variant="primary" px={3} {...props}>
    {props.icon && <Icon glyph={props.icon} />}
    <Label>{props.children}</Label>
  </StyledButton>
)
