import React from 'react'
import styled from 'styled-components'
import {
  maxWidth,
  space,
  MaxWidthProps,
  SpaceProps,
  width,
  WidthProps,
} from 'styled-system'
import { Flex, FlexProps } from 'rebass'
import theme from 'src/themes/styled.theme'
import { VersionNumber } from '../VersionNumber/VersionNumber'

type InnerContainerProps = MaxWidthProps & SpaceProps & WidthProps

const InnerContainer = styled.div<InnerContainerProps>`
  ${space}
  ${width}
  ${maxWidth}
  min-height: calc(100vh - 156px);
  margin-bottom:0;
  padding-bottom: 32px;
  position: relative
`

const PageContainer = (props: FlexProps) => (
  <Flex {...props} bg={theme.colors.background}>
    <InnerContainer>
      {props.children} <VersionNumber />
    </InnerContainer>
  </Flex>
)

PageContainer.defaultProps = {
  className: 'page-container',
  justifyContent: 'center',
  px: '2em',
}
InnerContainer.defaultProps = {
  className: 'page-inner-container',
  maxWidth: theme.maxContainerWidth,
  width: 1,
  my: 4,
}

export default PageContainer
