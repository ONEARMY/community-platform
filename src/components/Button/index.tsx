import React from 'react'

import Icon from 'src/components/Icons'

import { StyledButton, Label } from './elements'

interface IBtnProps {
  size?: 'small' | 'regular' | 'big'
  icon?: string
  color?: string
  children?: any
}

export const Button = (props: IBtnProps) => (
  <StyledButton {...props}>
    {props.icon && <Icon glyph={props.icon} />}
    <Label>{props.children}</Label>
  </StyledButton>
)
