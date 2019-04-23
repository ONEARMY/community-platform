import * as React from 'react'

import styled from 'styled-components'
import { colors } from 'src/themes/styled.theme'
import Text, { ITextProps } from 'src/components/Text'
import { HeadingProps as RebassHeadingProps } from 'rebass'
import theme from 'src/themes/styled.theme'

export const large = props =>
  props.large ? { fontSize: props.theme.fontSizes[6] } : null

export const medium = props =>
  props.medium ? { fontSize: props.theme.fontSizes[5] } : null

export const small = props =>
  props.small ? { fontSize: props.theme.fontSizes[4] } : null

export const BaseHeading = styled(Text)`
  ${large}
  ${medium}
  ${small}
`
type IHeadingProps = ITextProps & RebassHeadingProps

const Heading = (props: IHeadingProps) => (
  <BaseHeading {...props}>{props.children}</BaseHeading>
)

Heading.defaultProps = {
  theme,
  className: 'heading',
  color: colors.black,
}

export default Heading
