import * as React from 'react'
import styled from 'styled-components'
import { Text as RebassText, TextProps as RebassTextProps } from 'rebass'
import theme from 'src/themes/styled.theme'

export interface ITextProps {
  uppercase?: boolean
  inline?: boolean
  regular?: boolean
  txtcenter?: boolean
  txtleft?: boolean
  txtright?: boolean
  capitalize?: boolean
  bold?: boolean

  large?: boolean
  medium?: boolean
  small?: boolean
  superSmall?: boolean
  // keyof colors returns full object prototype, include typeof for just named keys (i.e. color list)
  color?: keyof typeof theme.colors
  // clip forces text to fill max 1 line and add '...' for overflow
  clipped?: boolean
  preLine?: boolean

  heroTitle?: boolean
  cardTitle?: boolean
  stepTitle?: boolean
  subTitle?: boolean
  dateTitle?: boolean
  litleTitle?: boolean
  metaTitle?: boolean
  tags?: boolean
  auxiliary?: boolean
  paragraph?: boolean
}

export const uppercase = props =>
  props.uppercase
    ? {
        textTransform: 'uppercase',
      }
    : null

export const inline = (props: ITextProps) =>
  props.inline ? { display: 'inline-block' } : null

export const txtcenter = (props: ITextProps) =>
  props.txtcenter ? { textAlign: 'center' } : null

export const txtleft = (props: ITextProps) =>
  props.txtleft ? { textAlign: 'left' } : null

export const txtright = (props: ITextProps) =>
  props.txtright ? { textAlign: 'right' } : null

export const capitalize = (props: ITextProps) =>
  props.txtright ? { textTransform: 'capitalize' } : null

export const regular = (props: ITextProps) =>
  props.regular ? { fontWeight: 400 } : null

export const bold = (props: ITextProps) =>
  props.bold ? { fontWeight: 600 } : null

export const large = (props: ITextProps) =>
  props.large ? { fontSize: theme.fontSizes[3] } : null

export const heroTitle = (props: ITextProps) =>
  props.heroTitle ? { fontSize: '32px', fontWeight: 700 } : null

export const cardTitle = (props: ITextProps) =>
  props.cardTitle ? { fontSize: '22px', fontWeight: 700, color: 'black' } : null

export const stepTitle = (props: ITextProps) =>
  props.stepTitle ? { fontSize: '32px' } : null

export const subTitle = (props: ITextProps) =>
  props.subTitle ? { fontSize: '32px' } : null

export const dateTitle = (props: ITextProps) =>
  props.dateTitle ? { fontSize: '24px', fontWeight: 700 } : null

export const litleTitle = (props: ITextProps) =>
  props.litleTitle ? { fontSize: '32px' } : null

export const metaTitle = (props: ITextProps) =>
  props.metaTitle ? { fontSize: '32px' } : null

export const tags = (props: ITextProps) =>
  props.tags ? { fontSize: '12px', color: '#83ceeb' } : null

export const auxiliary = (props: ITextProps) =>
  props.auxiliary
    ? {
        fontFamily: '"Inter", Helvetica Neue, Arial, sans-serif;',
        fontSize: '12px',
        color: '#686868',
      }
    : null

export const paragraph = (props: ITextProps) =>
  props.paragraph
    ? {
        fontFamily: '"Inter", Helvetica Neue, Arial, sans-serif;',
        fontSize: '16px',
        color: '#61646b',
      }
    : null

export const medium = (props: ITextProps) =>
  props.medium ? { fontSize: theme.fontSizes[2] } : null

export const small = (props: ITextProps) =>
  props.small ? { fontSize: theme.fontSizes[1] } : null

export const superSmall = (props: ITextProps) =>
  props.superSmall ? { fontSize: theme.fontSizes[0] } : null

export const clipped = (props: ITextProps) =>
  props.clipped
    ? { whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }
    : null

export const preLine = (props: ITextProps) =>
  props.preLine ? { whiteSpace: 'pre-line' } : null

export const BaseText = styled(RebassText)`
    ${inline}
    ${uppercase}
    ${regular}
    ${bold}
	${txtcenter}
	${txtleft}
	${txtright}
	${capitalize}
    ${large}
    ${medium}
    ${small}
    ${superSmall}
    ${clipped}
	${preLine}
	${heroTitle}
	${cardTitle}
	${stepTitle}
	${subTitle}
	${dateTitle}
	${litleTitle}
	${metaTitle}
	${tags}
	${auxiliary}
	${paragraph}
`

type TextProps = ITextProps & RebassTextProps

// TODO - incorporate custom css into rebass props to allow things like below to be passed
export const Text = (props: TextProps) => (
  <BaseText {...props}>{props.children}</BaseText>
)

export default Text
