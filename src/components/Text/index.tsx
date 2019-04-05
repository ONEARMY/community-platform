import * as React from 'react'
import styled from 'styled-components'
import { Text as RebassText, TextProps as RebassTextProps } from 'rebass'
import { colors } from 'src/themes/styled.theme'

import theme from 'src/themes/styled.theme'

export interface ITextProps {
  caps?: boolean
  regular?: boolean
  bold?: boolean
  large?: boolean
  medium?: boolean
  small?: boolean
  superSmall?: boolean
}

export const caps = props =>
  props.caps
    ? {
        textTransform: 'uppercase',
      }
    : null

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

export const BaseText = styled(RebassText)`
    ${caps}
    ${regular}
    ${bold}
    ${large}
    ${medium}
    ${small}
    ${superSmall}
`

type TextProps = ITextProps & RebassTextProps

export const Text = (props: TextProps) => (
  <BaseText {...props}>{props.children}</BaseText>
)

Text.defaultProps = {
  theme,
  color: colors.black,
  className: 'text',
}

export default Text
