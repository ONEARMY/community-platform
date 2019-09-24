import React from 'react'
import { Flex, Box, FlexProps } from 'rebass'
import theme from 'src/themes/styled.theme'

interface IProps extends FlexProps {
  ignoreMaxWidth?: boolean
}

const Main = (props: IProps) => (
  <Flex {...props} flexDirection="column">
    <Box
      width="100%"
      className="main-container"
      sx={{
        position: 'relative',
        maxWidth: theme.maxContainerWidth,
        px: [2, 3, 4],
        mx: 'auto',
        my: 0,
      }}
    >
      {props.children}
    </Box>
  </Flex>
)

export default Main
