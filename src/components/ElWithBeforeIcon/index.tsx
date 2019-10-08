import React, { FunctionComponent } from 'react'
import { Box } from 'rebass'

interface IProps {
  IconUrl: JSX.Element
  height?: string
}

export const ElWithBeforeIcon: FunctionComponent<IProps> = ({
  IconUrl,
  height,
  children,
}) => (
  <Box
    mr={4}
    pl="30px"
    sx={{
      position: 'relative',
      '::before': {
        content: "''",
        backgroundImage: 'url(' + IconUrl + ')',
        width: '22px',
        height: height ? height : '22px',
        backgroundRepeat: 'no-repeat',
        position: 'absolute',
        left: '0',
        bottom: '50%',
        transform: 'translateY(50%)',
      },
    }}
  >
    {children}
  </Box>
)

export default ElWithBeforeIcon
