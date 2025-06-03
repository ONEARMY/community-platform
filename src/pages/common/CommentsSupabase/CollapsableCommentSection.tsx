import { useContext, useEffect, useMemo, useState } from 'react'
import { type ResearchUpdate, UserRole } from 'oa-shared'
import { AuthWrapper } from 'src/common/AuthWrapper'
import { FollowButtonAction } from 'src/common/FollowButtonAction'
import { Box, Button } from 'theme-ui'

import { CommentSectionSupabase } from './CommentSectionSupabase'
import { MultipleCommentSectionContext } from './MultipleCommentSectionWrapper'

type Props = {
  authors: number[]
  open: boolean
  total: number
  researchUpdate: ResearchUpdate
}

const CollapsableCommentSection = (props: Props) => {
  const { authors, open, total, researchUpdate } = props

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
    if (multipleSectionsContext?.expandId === researchUpdate.id) {
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
        data-cy="HideDiscussionContainer:button"
      >
        {buttonText}
      </Button>
      {isOpen && (
        <CommentSectionSupabase
          sourceId={researchUpdate.id}
          sourceType="research_update"
          authors={authors}
          followButton={
            <AuthWrapper roleRequired={UserRole.BETA_TESTER}>
              <FollowButtonAction
                contentType="research_update"
                item={researchUpdate}
              />
            </AuthWrapper>
          }
        />
      )}
    </Box>
  )
}

export default CollapsableCommentSection
