import React from 'react'
import styled from 'styled-components'
import {
  BorderRadiusProps,
  flexWrap,
  flexDirection,
  flexBasis,
  flex,
  alignItems,
  alignContent,
  alignSelf,
  justifyContent,
  justifySelf,
  order,
} from 'styled-system'
import { FlexProps } from 'rebass'
import { BoxContainer } from './BoxContainer'

type ContainerProps = FlexProps & BorderRadiusProps

const ExtendedFlexContainer = styled(BoxContainer)`
  ${flex}
  ${flexWrap}
  ${flexDirection}
  ${flexBasis}
  ${alignItems}
  ${alignContent}
  ${alignSelf}
  ${justifyContent}
  ${justifySelf}
  ${order}
`

export const FlexContainer = (props: ContainerProps) => (
  <ExtendedFlexContainer {...props}>{props.children}</ExtendedFlexContainer>
)

// Default styling container props
FlexContainer.defaultProps = {
  className: 'flex-container',
  display: 'flex',
}
