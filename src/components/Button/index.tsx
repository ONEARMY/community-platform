import React from 'react'
import { Icon, IGlyphs } from 'src/components/Icons'
import {
  Button as RebassButton,
  ButtonProps as RebassButtonProps,
} from 'rebass'
import { ButtonVariants } from 'src/themes/preciousplastic/buttons'
import theme from 'src/themes/styled.preciousplastic'
import Text from 'src/components/Text'
import { fonts } from 'src/themes/preciousplastic/fonts'

// extend to allow any default button props (e.g. onClick) to also be passed
export interface IBtnProps extends React.ButtonHTMLAttributes<HTMLElement> {
  icon?: keyof IGlyphs
  disabled?: boolean
  variant?: ButtonVariants
}

type BtnProps = IBtnProps & RebassButtonProps

export const Button = (props: BtnProps) => (
  <RebassButton {...props}>
    {props.icon && <Icon glyph={props.icon} marginRight="4px" />}
    <Text>{props.children}</Text>
  </RebassButton>
)

Button.defaultProps = {
  type: 'button',
  theme,
}
