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
  clipped?: boolean
}

export const caps = props =>
  props.caps
    ? {
        textTransform: 'uppercase',
      }
    : null

export const inline = (props: ITextProps) =>
  props.inline ? { display: 'inline-block' } : null

export const regular = (props: ITextProps) =>
  props.regular ? { fontWeight: theme.regular } : null

export const bold = (props: ITextProps) =>
  props.bold ? { fontWeight: theme.bold } : null

export const large = (props: ITextProps) =>
  props.large ? { fontSize: theme.fontSizes[3] } : null

export const medium = (props: ITextProps) =>
  props.medium ? { fontSize: theme.fontSizes[2] } : null

export const small = (props: ITextProps) =>
  props.small ? { fontSize: theme.fontSizes[1] } : null

export const superSmall = (props: ITextProps) =>
  props.small ? { fontSize: theme.fontSizes[0] } : null

export const clipped = (props: ITextProps) =>
  props.clipped
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
    ${clipped}
`

type TextProps = ITextProps & RebassTextProps

// TODO - incorporate custom css into rebass props to allow things like below to be passed
export const Text = (props: TextProps) => (
  <BaseText color={_getTextColor(props)} {...props}>
    {props.children}
  </BaseText>
)

Text.defaultProps = {
  theme,
  className: 'text',
}

function _getTextColor(props: TextProps) {
  if (props.color) {
    return props.color
  } else {
    return 'black'
  }
}

export default Text
