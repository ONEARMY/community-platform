import React from 'react'
import { Flex, Box, FlexProps, SxProps } from 'rebass'
import theme from 'src/themes/styled.theme'
import { CSSObject } from '@styled-system/css'

interface IProps extends FlexProps {
  ignoreMaxWidth?: boolean
  customStyles?: CSSObject
}

const Main = (props: IProps) => (
  <Flex {...props} flexDirection="column">
    <Box
      width="100%"
      className="main-container"
      css={props.customStyles}
      sx={
        !props.ignoreMaxWidth
          ? {
              position: 'relative',
              maxWidth: theme.maxContainerWidth,
              px: [2, 3, 4],
              mx: 'auto',
              my: 0,
            }
          : {}
      }
    >
      {props.children}
    </Box>
  </Flex>
)

export default Main
