import { useContext, useEffect, useMemo, useState } from 'react'
import { Box, Button } from 'theme-ui'

import { CommentSectionSupabase } from './CommentSectionSupabase'
import { MultipleCommentSectionContext } from './MultipleCommentSectionWrapper'

import type { ContentType } from 'oa-shared'

type Props = {
  sourceId: number | string
  sourceType: ContentType
  authors: number[]
  open: boolean
  total: number
}

const CollapsableCommentSection = ({
  sourceId,
  sourceType,
  authors,
  open,
  total,
}: Props) => {
  const multipleSectionsContext = useContext(MultipleCommentSectionContext)
  const [isOpen, seIstOpen] = useState(() => open || false)

  const buttonText = useMemo(() => {
    if (!isOpen) {
      switch (total) {
        case 0:
          return 'Start a discussion'
        case 1:
          return 'View 1 comment'
        default:
          return `View ${total} comments`
      }
    }

    return 'Collapse Comments'
  }, [isOpen])

  useEffect(() => {
    if (multipleSectionsContext?.expandId === sourceId) {
      seIstOpen(true)
    }
  }, [multipleSectionsContext])

  return (
    <Box
      sx={{
        backgroundColor: isOpen ? '#e2edf7' : 'inherit',
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
          marginBottom: isOpen ? 2 : 0,
          '&:hover': { bg: '#ececec' },
        }}
        onClick={() => seIstOpen((prev) => !prev)}
        backgroundColor={isOpen ? '#c2daf0' : '#e2edf7'}
        className={isOpen ? 'viewComments' : ''}
        data-cy={`HideDiscussionContainer: button ${isOpen ? 'close-comments' : 'open-comments'} ${total !== 0 ? 'has-comments' : 'no-comments'}`}
      >
        {buttonText}
      </Button>
      {isOpen && (
        <CommentSectionSupabase
          sourceId={sourceId}
          sourceType={sourceType}
          authors={authors}
        />
      )}
    </Box>
  )
}

export default CollapsableCommentSection
