import React from 'react'
import { Icon, IGlyphs } from 'src/components/Icons'
import styled from 'styled-components'
import {
  Button as RebassButton,
  ButtonProps as RebassButtonProps,
} from 'rebass'

import theme, { ButtonVariants } from 'src/themes/styled.theme'
import Text from 'src/components/Text'

export const BaseButton = styled(RebassButton)`
  min-height: ${props => props.theme.buttons.height};
  border-radius: ${props => props.theme.radii[1] + 'px'};
  display: flex;
  flex: none;
  align-self: center;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  word-break: keep-all;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
`
export const Label = styled(Text)`
  color: inherit;
`

// extend to allow any default button props (e.g. onClick) to also be passed
export interface IBtnProps extends React.ButtonHTMLAttributes<HTMLElement> {
  icon?: keyof IGlyphs
  disabled?: boolean
  variant?: ButtonVariants
}

type BtnProps = IBtnProps & RebassButtonProps

export const Button = (props: BtnProps) => (
  <BaseButton {...props}>
    <span style={{ marginRight: '8px' }}>
      {props.icon && <Icon glyph={props.icon} />}
    </span>
    <Label caps regular pl={'5px'}>
      {props.children}
    </Label>
  </BaseButton>
)

Button.defaultProps = {
  className: 'button',
  variant: 'primary',
  theme,
}
