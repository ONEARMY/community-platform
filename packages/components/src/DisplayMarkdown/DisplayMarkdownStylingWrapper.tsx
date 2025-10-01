import { Box } from 'theme-ui'

import type { ThemeUIStyleObject } from 'theme-ui'

export interface IProps {
  children: React.ReactNode
  sx?: ThemeUIStyleObject | undefined
}

export const DisplayMarkdownStylingWrapper = ({ children, sx }: IProps) => {
  return (
    <Box
      sx={{
        alignSelf: 'stretch',
        fontFamily: 'body',
        blockquote: {
          borderLeft: '3px solid',
          paddingTop: '1px',
          paddingBottom: '1px',
          paddingLeft: 2,
          margin: 0,
        },
        lineHeight: 1.5,
        a: {
          color: 'primary',
          textDecoration: 'underline',
          '&:hover': { textDecoration: 'none' },
        },
        h3: { fontSize: 2 },
        h4: { fontSize: 2 },
        h5: { fontSize: 2 },
        h6: { fontSize: 2 },
        ...sx,
      }}
    >
      {children}
    </Box>
  )
}
