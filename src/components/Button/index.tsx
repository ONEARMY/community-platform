import * as React from 'react';
import { Icon, IGlyphs } from 'src/components/Icons'
import {
  Button as RebassButton,
  ButtonProps as RebassButtonProps,
} from 'rebass/styled-components'
import Text from 'src/components/Text'
import styled from 'styled-components'

// extend to allow any default button props (e.g. onClick) to also be passed
export interface IBtnProps extends React.ButtonHTMLAttributes<HTMLElement> {
  icon?: keyof IGlyphs
  disabled?: boolean
  translateY?: boolean
  small?: boolean
  medium?: boolean
  large?: boolean
  hasText?: boolean
}
export const small = (props: IBtnProps) =>
  props.small
    ? {
        padding: '4px 10px!important',
      }
    : null

export const medium = (props: IBtnProps) =>
  props.medium
    ? {
        padding: '6px 12px!important',
      }
    : null

export const large = (props: IBtnProps) =>
  props.large
    ? {
        padding: '8px 14px!important',
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
}
