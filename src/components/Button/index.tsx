import React, { DetailedHTMLProps } from 'react'

import Icon from 'src/components/Icons'

import { StyledButton, Label } from './elements'

// extend to allow any default button props (e.g. onClick) to also be passed
interface IBtnProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  icon?: string
  color?: string
  border?: boolean
}

export const Button = (props: IBtnProps) => (
  <StyledButton {...props}>
    {props.icon && <Icon glyph={props.icon} />}
    <Label>{props.children}</Label>
  </StyledButton>
)
