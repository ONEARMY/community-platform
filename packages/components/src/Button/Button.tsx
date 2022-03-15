import * as React from 'react'
import { Icon } from '../Icon/Icon'
import type { IGlyphs } from '../Icon/types'
import {
  Button as RebassButton,
  ButtonProps as RebassButtonProps,
} from 'rebass'
import styled from '@emotion/styled'

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

const small = (props: IBtnProps) =>
  props.small
    ? {
        padding: '4px 10px!important',
      }
    : null

const medium = (props: IBtnProps) =>
  props.medium
    ? {
        padding: '6px 12px!important',
      }
    : null

const large = (props: IBtnProps) =>
  props.large
    ? {
        padding: '8px 14px!important',
      }
    : null

const translateY = (props: IBtnProps) =>
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

export type BtnProps = IBtnProps & RebassButtonProps

const BaseButton = styled(RebassButton)`
  ${translateY}
  ${small}
  ${medium}
  ${large}
`

export const Button = (props: BtnProps) => (
  <BaseButton {...props}>
    {props.icon && <Icon glyph={props.icon} marginRight="4px" />}
    <span>{props.children}</span>
  </BaseButton>
)

Button.defaultProps = {
  type: 'button',
}
