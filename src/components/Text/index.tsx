import * as React from 'react'
import styled from 'styled-components'
import {
  Text as RebassText,
  TextProps as RebassTextProps,
} from 'rebass/styled-components'
import theme from 'src/themes/styled.theme'

export interface ITextProps {
  uppercase?: boolean
  inline?: boolean
  regular?: boolean
  txtcenter?: boolean
  capitalize?: boolean
  bold?: boolean
  txtRight?: boolean

  large?: boolean
  medium?: boolean
  small?: boolean
  superSmall?: boolean

  // keyof colors returns full object prototype, include typeof for just named keys (i.e. color list)
  color?: keyof typeof theme.colors

  // clip forces text to fill max 1 line and add '...' for overflow
  clipped?: boolean
  preLine?: boolean
  tags?: boolean
  auxiliary?: boolean
  paragraph?: boolean
}

export const BaseText = styled(RebassText)`
  ${props =>
    props.inline &&
    `
    display: 'inline-block';
  `}

  ${props =>
    props.txtcenter &&
    `
    textAlign: 'center';
  `}

  ${props =>
    props.txtRight &&
    `
    textAlign: 'right';
  `}

  ${props =>
    props.superSmall &&
    `
    font-size: ${theme.fontSizes[0]};
  `}

  ${props =>
    props.small &&
    `
    font-size: ${theme.fontSizes[1]};
  `}

  ${props =>
    props.medium &&
    `
    font-size: ${theme.fontSizes[2]};
  `}

  ${props =>
    props.large &&
    `
    font-size: ${theme.fontSizes[3]};
  `}

  ${props =>
    props.regular &&
    `
    font-weight: 400;
  `}

  ${props =>
    props.bold &&
    `
    font-weight: 600;
  `}

  ${props =>
    props.uppercase &&
    `
    text-transform: uppercase;
  `}

  ${props =>
    props.capitalize &&
    `
    text-transform: capitalize;
  `}

  ${props =>
    props.tags &&
    `
    font-size: 12px;
    color: ${theme.colors.blue};
  `}

  ${props =>
    props.auxiliary &&
    `
    font-family: "Inter", Helvetica Neue, Arial, sans-serif;
    font-size: 12px;
    color: #686868;
  `}

  ${props =>
    props.paragraph &&
    `
    font-family: "Inter", Helvetica Neue, Arial, sans-serif;
    font-size: 16px;
    color: ${theme.colors.grey};
  `}

  ${props =>
    props.clipped &&
    `
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  `}

  ${props =>
    props.preLine &&
    `
     white-space: pre-line;
  `}
`

type TextProps = ITextProps & RebassTextProps

// TODO - incorporate custom css into rebass props to allow things like below to be passed
export const Text = (props: TextProps) => (
  <BaseText {...props}>{props.children}</BaseText>
)

export default Text
