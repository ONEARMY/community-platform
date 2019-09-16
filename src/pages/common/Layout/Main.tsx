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
import { Flex, Box, FlexProps } from 'rebass'
import theme from 'src/themes/styled.theme'

type InnerContainerProps = MaxWidthProps &
  SpaceProps &
  WidthProps & {
    ignoreMaxWidth?: boolean
  }

const InnerContainer = styled(Box)<InnerContainerProps>`
  ${props => (props.ignoreMaxWidth ? 'max-width: inherit;' : maxWidth)}
  margin: ${p => (p.ignoreMaxWidth ? 0 : undefined)};
  padding: ${p => (p.ignoreMaxWidth ? 0 : undefined)};
  position: relative;
  height: 100%;
`
interface IProps extends FlexProps {
  ignoreMaxWidth?: boolean
}

const Main = (props: IProps) => (
  <Flex {...props} flexDirection="column">
    <InnerContainer ignoreMaxWidth={props.ignoreMaxWidth}>
      {props.children}
    </InnerContainer>
  </Flex>
)

InnerContainer.defaultProps = {
  maxWidth: theme.maxContainerWidth,
  width: 1,
  mx: 'auto',
  my: 0,
  px: [2, 3, 4],
}

export default Main
