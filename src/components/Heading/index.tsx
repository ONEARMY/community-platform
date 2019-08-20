import * as React from 'react'
import styled from 'styled-components'
import theme from 'src/themes/styled.theme'
import Text, { ITextProps } from 'src/components/Text'
import { HeadingProps as RebassHeadingProps } from 'rebass'

export const BaseHeading = styled(Text)``

type IHeadingProps = ITextProps & RebassHeadingProps

const Heading = (props: IHeadingProps) => (
  <BaseHeading {...props}>{props.children}</BaseHeading>
)

Heading.defaultProps = {
  theme,
}

export default Heading
