import React from 'react'
import styled from 'styled-components'
import { borderRadius, BorderRadiusProps } from 'styled-system'
import { Flex, FlexProps } from 'rebass'

type ContainerProps = FlexProps & BorderRadiusProps

const ExtendedFlexContainer = styled(Flex)`
  ${borderRadius}
`

export const FlexContainer = (props: ContainerProps) => (
  <ExtendedFlexContainer {...props}>{props.children}</ExtendedFlexContainer>
)

// Default styling container props
FlexContainer.defaultProps = {
  className: 'FlexContainer',
  width: 1,
  borderRadius: 1,
  bg: 'white',
  p: 4,
}
