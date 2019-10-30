import React from 'react'
import { Icon, IGlyphs } from 'src/components/Icons'
import {
  Button as RebassButton,
  ButtonProps as RebassButtonProps,
} from 'rebass'
import theme from 'src/themes/styled.theme'
import Text from 'src/components/Text'
import styled from 'styled-components'
import { IBtnProps } from './index'

// extend to allow any default button props (e.g. onClick) to also be passed
export interface IBtnProps extends React.ButtonHTMLAttributes<HTMLElement> {
  icon?: keyof IGlyphs
  disabled?: boolean
  translateY?: boolean
  small?: boolean
  medium?: boolean
  large?: boolean
}
export const small = (props: IBtnProps) =>
  props.small
    ? {
        padding: '8px 10px',
        fontSize: '12px',
      }
    : null

export const medium = (props: IBtnProps) =>
  props.medium
    ? {
        padding: '10px',
      }
    : null

export const large = (props: IBtnProps) =>
  props.large
    ? {
        padding: '10px',
      }
    : null

export const translateY = (props: IBtnProps) =>
  props.translateY
    ? {
        '&:hover': {
          transform: 'translateY(-5px)',
        },
        '&:focus': {
          outline: 'none',
        },
      }
    : null

type BtnProps = IBtnProps & RebassButtonProps

const BaseButton = styled(RebassButton)`
  ${translateY}
  ${small}
  ${medium}
  ${large}
`

export const Button = (props: BtnProps) => (
  <BaseButton {...props}>
    {props.icon && <Icon glyph={props.icon} marginRight="4px" />}
    <Text>{props.children}</Text>
  </BaseButton>
)

Button.defaultProps = {
  type: 'button',
  theme,
}
