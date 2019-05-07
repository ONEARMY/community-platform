import React from 'react'
import styled from 'styled-components'
import {
  borderRadius,
  BorderRadiusProps,
  display,
  DisplayProps,
  width,
  WidthProps,
  height,
  HeightProps,
} from 'styled-system'
import { Box, BoxProps } from 'rebass'

type ContainerProps = BoxProps &
  BorderRadiusProps &
  DisplayProps &
  WidthProps &
  HeightProps

const ExtendedBoxContainer = styled(Box)`
  ${display}
  ${borderRadius}
  ${width}
  ${height}
`

export const BoxContainer = (props: ContainerProps) => (
  <ExtendedBoxContainer {...props}>{props.children}</ExtendedBoxContainer>
)

// Default styling container props
BoxContainer.defaultProps = {
  className: 'box-container',
  width: 1,
  borderRadius: 1,
  bg: 'white',
  p: 4,
}
