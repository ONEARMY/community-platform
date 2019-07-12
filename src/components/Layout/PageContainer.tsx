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

type InnerContainerProps = MaxWidthProps &
  SpaceProps &
  WidthProps & {
    ignoreMaxWidth?: boolean
  }

const InnerContainer = styled.div<InnerContainerProps>`
  ${space}
  ${width}
  ${p => (p.ignoreMaxWidth ? 'max-width: inherit;' : maxWidth)}
  margin: ${p => (p.ignoreMaxWidth ? 0 : undefined)};
  padding: ${p => (p.ignoreMaxWidth ? 0 : undefined)};
  min-height: calc(100vh - 156px);
  margin-bottom:0;
  padding-bottom: 32px;
  position: relative;
`
interface IProps extends FlexProps {
  ignoreMaxWidth?: boolean
}

const PageContainer = (props: IProps) => (
  <Flex {...props} bg={theme.colors.background}>
    <InnerContainer ignoreMaxWidth={props.ignoreMaxWidth}>
      {props.children} <VersionNumber />
    </InnerContainer>
  </Flex>
)

PageContainer.defaultProps = {
  className: 'page-container',
  justifyContent: 'center',
}
InnerContainer.defaultProps = {
  className: 'page-inner-container',
  maxWidth: theme.maxContainerWidth,
  width: 1,
  my: 4,
  px: '2em',
}

export default PageContainer
