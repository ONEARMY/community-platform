import * as React from 'react'
import styled from 'styled-components'
import { Text as RebassText, TextProps as RebassTextProps } from 'rebass'

import theme from 'src/themes/styled.theme'

export interface ITextProps {
  caps?: boolean
  regular?: boolean
  bold?: boolean
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

export const BaseText = styled(RebassText)`
    ${caps}
    ${regular}
    ${bold}
`

type TextProps = ITextProps & RebassTextProps

export const Text = (props: TextProps) => (
  <BaseText {...props}>{props.children}</BaseText>
)

Text.defaultProps = {
  theme,
}
