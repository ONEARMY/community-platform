import { useState } from 'react'
import styled from '@emotion/styled'
import { Button, DiscussionContainer } from 'oa-components'
import { trackEvent } from 'src/common/Analytics'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { MAX_COMMENT_LENGTH } from 'src/constants'
import { logger } from 'src/logger'
import { useResearchStore } from 'src/stores/Research/research.store'
import { Box, Flex } from 'theme-ui'

import type { IResearch, UserComment } from 'src/models'

interface IProps {
  comments: UserComment[]
  update: IResearch.UpdateDB
  updateIndex: number
  showComments?: boolean
}

const BoxMain = styled(Box)`
  padding-bottom: 15px;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 20px;
  margin-top: 20px;
  transition: background-color 120ms ease-out;
  border-top: 1px solid #111;
`

export const getResearchCommentId = (s: string) =>
  s.replace(/#update-\d+-comment:/, '')

export const ResearchComments = (props: IProps) => {
  const { comments, update, showComments } = props
  const [comment, setComment] = useState('')
  const researchStore = useResearchStore()
  const [viewComments, setViewComments] = useState(!!showComments)
  const { stores } = useCommonStores()

  const category = 'Comments'
  const highlightedCommentId = getResearchCommentId(window.location.hash)
  const label = researchStore.activeResearchItem?.title
  const isLoggedIn = !!stores.userStore.activeUser

  const onSubmit = async (comment: string) => {
    try {
      await researchStore.addComment(comment, update as IResearch.Update)
      setComment('')

      const action = 'Submitted'
      trackEvent({ action, category, label })
      logger.debug({ action, category, label }, 'comment submitted')
    } catch (err) {
      logger.error(`Failed to set comment`, { err })
    }
  }

  const handleSubmitReply = async (parentCommentId: string, reply: string) => {
    try {
      await researchStore.addComment(
        reply,
        update as IResearch.Update,
        parentCommentId,
      )
      setComment('')

      const action = 'Submitted reply'
      trackEvent({ action, category, label })
      logger.debug({ action, category, label }, 'reply submitted')
    } catch (err) {
      logger.error(`Failed to set reply`, { err })
    }
  }

  const handleEditRequest = async () => {
    const action = 'Edit existing comment'
    trackEvent({ action, category, label })
  }

  const handleDelete = async (_id: string) => {
    await researchStore.deleteComment(_id, update as IResearch.Update)

    const action = 'Deleted'
    trackEvent({ category, action, label })
    logger.debug({ action, category, label }, 'comment deleted')
  }

  const handleEdit = async (_id: string, comment: string) => {
    await researchStore.editComment(_id, comment, update)

    const action = 'Update'
    trackEvent({ action, category, label })
    logger.debug({ action, category, label }, 'comment edited')
  }

  const onButtonClick = () => {
    setViewComments(!viewComments)
  }

  const onMoreComments = () => {
    const action = 'Show more'
    trackEvent({ action, category, label })
  }

  const setButtonText = () => {
    let text = ''
    if (!viewComments) {
      if (comments && comments.length > 0) {
        text =
          comments.length === 1
            ? `View 1 Comment`
            : `View ${comments.length} Comments`
      } else {
        text = 'Start a discussion'
      }
    } else {
      text = 'Collapse Comments'
    }
    return text
  }

  return (
    <BoxMain backgroundColor={viewComments ? '#e2edf7' : 'inherit'}>
      <Button
        variant="subtle"
        sx={{
          fontSize: '14px',
          width: '100%',
          textAlign: 'center',
          display: 'block',
        }}
        onClick={onButtonClick}
        backgroundColor={viewComments ? '#c2daf0' : '#e2edf7'}
        className={viewComments ? 'viewComments' : ''}
        data-cy={
          !viewComments
            ? 'ResearchComments: button open-comments'
            : 'ResearchComments: button'
        }
      >
        <>{setButtonText()}</>
      </Button>
      {viewComments && (
        <Flex
          data-cy="update-comments"
          sx={{
            alignItems: 'stretch',
            flexDirection: 'column',
            marginTop: 5,
          }}
        >
          <DiscussionContainer
            supportReplies={true}
            comment={comment}
            comments={comments}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            handleEditRequest={handleEditRequest}
            highlightedCommentId={highlightedCommentId}
            isLoggedIn={isLoggedIn}
            maxLength={MAX_COMMENT_LENGTH}
            onChange={setComment}
            onMoreComments={onMoreComments}
            onSubmit={onSubmit}
            onSubmitReply={handleSubmitReply}
          />
        </Flex>
      )}
    </BoxMain>
  )
}
