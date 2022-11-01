import React from 'react'
import { Box } from 'theme-ui'

interface Props {
  children: React.ReactNode
  row: any
}

function TableHead({ children, row }: Props) {
  return (
    <Box
      data-cy="tableHead"
      sx={{
        ...row.style,
        textAlign: 'left',
        height: '3rem',
        mb: 2,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {children}
    </Box>
  )
}

export default TableHead
