import React from 'react'

import Icon from 'src/components/Icons'
import {
  ColorProps,
  SpaceProps,
  WidthProps,
  ButtonStyleProps,
} from 'styled-system'
import { BaseButton, Label } from './elements'

// extend to allow any default button props (e.g. onClick) to also be passed
export interface IBtnProps extends React.ButtonHTMLAttributes<HTMLElement> {
  icon?: string
}

const StyledButton = ({ children, ...props }) => (
  <BaseButton {...props}>{children}</BaseButton>
)

type disabledProp = { boolean? : false };

type BtnProps = IBtnProps &
  SpaceProps &
  WidthProps &
  ButtonStyleProps &
  ColorProps &
  disabledProp

export const Button = (props: BtnProps) => (
  <StyledButton px={3} {...props}>
    {props.icon && <Icon glyph={props.icon} />}
    <Label>{props.children}</Label>
  </StyledButton>
)

Button.defaultProps = {
  className: 'button',
  variant: 'primary',
}
