import React from 'react'
import styled from 'styled-components'
import { maxWidth, space, MaxWidthProps, SpaceProps } from 'styled-system'
import { Flex, FlexProps } from 'rebass'
import { maxContainerWidth } from 'src/themes/styled.theme'

type InnerContainerProps = MaxWidthProps & SpaceProps

const InnerContainer = styled.div<InnerContainerProps>`
  ${space}
  ${maxWidth}
`

const PageContainer = (props: FlexProps) => (
  <Flex {...props}>
    <InnerContainer>{props.children}</InnerContainer>
  </Flex>
)

PageContainer.defaultProps = {
  className: 'page-container',
  justifyContent: 'center',
  px: '2em',
  width: 1,
}
InnerContainer.defaultProps = {
  className: 'page-inner-container',
  maxWidth: maxContainerWidth,
  my: 4,
}

export default PageContainer
