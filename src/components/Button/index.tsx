import React from 'react'

import Icon from 'src/components/Icons'

import { StyledButton, Label } from './elements'

interface IBtnProps {
  icon?: string
  color?: string
  children?: any
  border?: boolean
}

export const Button = (props: IBtnProps) => (
  <StyledButton {...props}>
    {props.icon && <Icon glyph={props.icon} />}
    <Label>{props.children}</Label>
  </StyledButton>
)
