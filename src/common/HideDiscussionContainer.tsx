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
          return 'View 1 comment'
        default:
          return `View ${commentCount} comments`
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
        }}
        onClick={() => setViewComments((prev) => !prev)}
        backgroundColor={viewComments ? '#c2daf0' : '#e2edf7'}
        className={viewComments ? 'viewComments' : ''}
        data-cy={`HideDiscussionContainer: button ${
          !viewComments && 'open-comments'
        }`}
      >
        {buttonText}
      </Button>
      {viewComments && children}
    </Box>
  )
}
