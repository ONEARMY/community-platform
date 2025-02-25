import React, { useMemo, useState } from 'react'
import { Button } from 'oa-components'
import { Box } from 'theme-ui'

interface IProps {
  commentCount: number
  children: React.ReactNode | React.ReactNode[]
  showComments?: boolean
}

export const HideDiscussionContainer = ({
  children,
  commentCount,
  showComments,
}: IProps) => {
  const [viewComments, setViewComments] = useState(() => showComments || false)

  const buttonText = useMemo(() => {
    if (!viewComments) {
      switch (commentCount) {
        case 0:
          return 'Start a discussion'
        case 1:
          return 'View 1 Comment'
        default:
          return `View ${commentCount} Comments`
      }
    }

    return 'Collapse Comments'
  }, [viewComments])

  return (
    <Box
      sx={{
        backgroundColor: viewComments ? '#e2edf7' : 'inherit',
        borderTop: '2px solid #111',
        padding: 2,
        transition: 'background-color 120ms ease-out',
      }}
    >
      <Button
        type="button"
        variant="subtle"
        sx={{
          fontSize: '14px',
          width: '100%',
          textAlign: 'center',
          display: 'block',
          marginBottom: viewComments ? 2 : 0,
          '&:hover': { bg: '#ececec' },
        }}
        onClick={() => setViewComments((prev) => !prev)}
        backgroundColor={viewComments ? '#c2daf0' : '#e2edf7'}
        className={viewComments ? 'viewComments' : ''}
        data-cy={`HideDiscussionContainer: button ${viewComments ? 'close-comments' : 'open-comments'} ${commentCount !== 0 ? 'has-comments' : 'no-comments'}`}
      >
        {buttonText}
      </Button>
      {viewComments && children}
    </Box>
  )
}
