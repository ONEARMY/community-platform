import * as React from 'react'
import styled from 'styled-components'
import theme from 'src/themes/styled.theme'
import Text, { ITextProps } from 'src/components/Text'
import { HeadingProps as RebassHeadingProps } from 'rebass/styled-components'

export const large = (props: ITextProps) =>
  props.large ? { fontSize: theme.fontSizes[6] } : null
export const medium = (props: ITextProps) =>
  props.medium ? { fontSize: theme.fontSizes[5] } : null
export const small = (props: ITextProps) =>
  props.small ? { fontSize: theme.fontSizes[4] } : null

export const BaseHeading = styled(Text)`
    ${large}
    ${medium}
    ${small}`

type IHeadingProps = ITextProps & RebassHeadingProps

const Heading = (props: IHeadingProps) => (
  <BaseHeading {...(props as any)}>{props.children}</BaseHeading>
)

Heading.defaultProps = {
  theme,
}

export default Heading
