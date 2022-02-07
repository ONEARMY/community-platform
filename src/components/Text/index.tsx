import {
  Text as RebassText,
  TextProps as RebassTextProps,
} from 'rebass/styled-components'
import theme from 'src/themes/styled.theme'
import styled from 'styled-components'

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
  color?: string
  // clip forces text to fill max 1 line and add '...' for overflow
  clipped?: boolean
  preLine?: boolean
  tags?: boolean
  auxiliary?: boolean
  paragraph?: boolean
  highlight?: boolean
  critical?: boolean
  dashed?: boolean
  cropBottomRight?: boolean
  theme?: any;
}

export const uppercase = props =>
  props.uppercase
    ? {
        textTransform: 'uppercase',
      }
    : null

export const capitalize = props =>
  props.capitalize
    ? {
        textTransform: 'capitalize',
      }
    : null

export const inline = (props: ITextProps) =>
  props.inline ? { display: 'inline-block' } : null

export const txtcenter = (props: ITextProps) =>
  props.txtcenter ? { textAlign: 'center' } : null

export const txtRight = (props: ITextProps) =>
  props.txtRight ? { textAlign: 'right' } : null

export const regular = (props: ITextProps) =>
  props.regular ? { fontWeight: 400 } : null

export const bold = (props: ITextProps) =>
  props.bold ? { fontWeight: 600 } : null

export const large = (props: ITextProps) =>
  props.large ? { fontSize: theme.fontSizes[3] } : null

export const tags = (props: ITextProps) =>
  props.tags ? { fontSize: '12px', color: theme.colors.blue } : null

export const auxiliary = (props: ITextProps) =>
  props.auxiliary ? theme.typography.auxiliary : null

export const paragraph = (props: ITextProps) =>
  props.paragraph ? theme.typography.paragraph : null

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

export const highlight = (props: ITextProps) =>
  props.highlight
    ? {
        background: theme.colors.yellow.base,
        padding: '7px',
        borderRadius: '5px',
      }
    : null
export const critical = (props: ITextProps) =>
  props.critical
    ? {
        color: theme.colors.red,
      }
    : null
export const dashed = (props: ITextProps) =>
  props.dashed
    ? {
        border: '1px dashed',
      }
    : null
export const cropBottomRight = (props: ITextProps) =>
  props.cropBottomRight
    ? {
        borderBottomRightRadius: '8px',
      }
    : null

// any export to fix: https://github.com/microsoft/TypeScript/issues/37597
export const BaseText = styled(RebassText as any)`
  ${inline}
  ${uppercase as any}
  ${capitalize as any}
  ${regular}
  ${bold}
	${txtcenter as any}
  ${large}
  ${medium}
  ${small}
  ${superSmall}
  ${clipped as any}
	${preLine as any}
	${tags}
	${auxiliary}
	${paragraph}
  ${txtRight as any}
  ${highlight}
  ${critical}
  ${dashed}
  ${cropBottomRight}
`

type TextProps = ITextProps & RebassTextProps

// TODO - incorporate custom css into rebass props to allow things like below to be passed
export const Text = (props: TextProps) => (
  <BaseText {...(props as any)}>{props.children}</BaseText>
)

export default Text
