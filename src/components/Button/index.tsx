import React from 'react'
import { Icon, IGlyphs } from 'src/components/Icons'
import {
  Button as RebassButton,
  ButtonProps as RebassButtonProps,
} from 'rebass'
import theme from 'src/themes/styled.theme'
import Text from 'src/components/Text'
import styled from 'styled-components'

// extend to allow any default button props (e.g. onClick) to also be passed
export interface IBtnProps extends React.ButtonHTMLAttributes<HTMLElement> {
  icon?: keyof IGlyphs
  disabled?: boolean
  litleBtn?: boolean
  mediumBtn?: boolean
  bigBtn?: boolean
  translateY?: boolean
}

export const litleBtn = (props: IBtnProps) =>
  props.litleBtn ? { padding: '8px 10px', fontSize: '12px' } : null

export const mediumBtn = (props: IBtnProps) =>
  props.mediumBtn ? { padding: '10px' } : null

export const bigBtn = (props: IBtnProps) =>
  props.bigBtn ? { padding: '15px' } : null

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

const BaseButton = styled(RebassButton)`
  ${litleBtn}
  ${mediumBtn}
  ${bigBtn}
  ${translateY}
`

type BtnProps = IBtnProps & RebassButtonProps

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
