import * as React from 'react'
import styled from 'styled-components'
import { Text as RebassText, TextProps as RebassTextProps } from 'rebass'
import { colors } from 'src/themes/styled.theme'

import theme from 'src/themes/styled.theme'

export interface ITextProps {
  caps?: boolean
  inline?: boolean
  regular?: boolean
  bold?: boolean
  large?: boolean
  medium?: boolean
  small?: boolean
  superSmall?: boolean
  // keyof colors returns full object prototype, include typeof for just named keys (i.e. color list)
  color?: keyof typeof colors
  // clip forces text to fill max 1 line and add '...' for overflow
  clip?: boolean
}

export const caps = props =>
  props.caps
    ? {
        textTransform: 'uppercase',
      }
    : null

export const inline = props =>
  props.inline ? { display: 'inline-block' } : null

export const regular = props =>
  props.regular ? { fontWeight: props.theme.regular } : null

export const bold = props =>
  props.bold ? { fontWeight: props.theme.bold } : null

export const large = props =>
  props.large ? { fontSize: props.theme.fontSizes[3] } : null

export const medium = props =>
  props.medium ? { fontSize: props.theme.fontSizes[2] } : null

export const small = props =>
  props.small ? { fontSize: props.theme.fontSizes[1] } : null

export const superSmall = props =>
  props.small ? { fontSize: props.theme.fontSizes[0] } : null

export const clip = props =>
  props.clip
    ? { whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }
    : null

export const BaseText = styled(RebassText)`
    ${inline}
    ${caps}
    ${regular}
    ${bold}
    ${large}
    ${medium}
    ${small}
    ${superSmall}
    ${clip}
`

type TextProps = ITextProps & RebassTextProps

export const Text = (props: TextProps) => (
  <BaseText color={colors[props.color ? props.color : 'black']} {...props}>
    {props.children}
  </BaseText>
)

Text.defaultProps = {
  theme,
  className: 'text',
}

export default Text
