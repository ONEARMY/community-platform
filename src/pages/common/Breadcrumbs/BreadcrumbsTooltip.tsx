import React, { useState } from 'react'
import { Box } from 'theme-ui'

export const BreadcrumbsTooltip = ({ children, text }) => {
  const [visible, setVisible] = useState(false)

  const showTooltip = () => setVisible(true)
  const hideTooltip = () => setVisible(false)

  return (
    <Box
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      sx={{ position: 'relative', display: 'inline-block' }}
    >
      {children}
      {visible && (
        <Box
          sx={{
            position: 'absolute',
            padding: '3px',
            borderRadius: '5px',
            color: 'dimgray',
            backgroundColor: '#e2edf7',
            border: '1px solid #ababac',
            fontSize: '15px'
          }}
        >
          {text}
        </Box>
      )}
    </Box>
  )
}
