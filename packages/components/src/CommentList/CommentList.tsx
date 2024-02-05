import { useEffect, useState } from 'react'
import { Box, Flex } from 'theme-ui'

import { Button, CommentContainer } from '../'

import type { IComment } from '..'

const MAX_COMMENTS = 5

export interface IProps {
  supportReplies?: boolean
  comments: IComment[]
  handleEdit: (_id: string, comment: string) => Promise<void>
  handleEditRequest: () => Promise<void>
  handleDelete: (_id: string) => Promise<void>
  highlightedCommentId?: string
  onMoreComments?: () => void
  setCommentBeingRepliedTo?: (commentId: string | null) => void
  replyForm?: (commentId: string) => JSX.Element
  currentDepth?: number
  maxDepth?: number
  canHaveReplies?: boolean
}

export const CommentList = (props: IProps) => {
  const {
    comments,
    highlightedCommentId,
    setCommentBeingRepliedTo,
    replyForm,
    handleEdit,
    handleDelete,
    handleEditRequest,
    supportReplies = false,
    maxDepth = 9999,
    currentDepth = 0,
    onMoreComments,
  } = props

  const hasRepliesEnabled = supportReplies && currentDepth < maxDepth

  const [moreComments, setMoreComments] = useState(1)
  const shownComments = moreComments * MAX_COMMENTS

  const scrollIntoRelevantComment = (commentId: string) => {
    setTimeout(() => {
      // the delay is needed, otherwise the scroll is not happening in Firefox
      document
        .getElementById(`comment:${commentId}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 0)
  }

  const handleMoreComments = () => {
    onMoreComments && onMoreComments()
    setMoreComments(moreComments + 1)
  }


  const handleCommentReply =
    hasRepliesEnabled && setCommentBeingRepliedTo
      ? setCommentBeingRepliedTo
      : undefined

  useEffect(() => {
    if (!highlightedCommentId) return

    const i = comments.findIndex((comment) =>
      highlightedCommentId.includes(comment._id),
    )
    if (i >= 0) {
      setMoreComments(Math.floor(i / MAX_COMMENTS) + 1)
      scrollIntoRelevantComment(highlightedCommentId)
    }
  }, [highlightedCommentId, comments])

  return (
    <Box
      mb={4}
      sx={{
        width: '100%',
        display: 'block',
      }}
    >
      {comments &&
        comments.slice(0, shownComments).map((comment) => (
          <Box
            key={comment._id}
            data-testid="CommentList: item"
            sx={{
              marginBottom: 4,
              border: `${
                highlightedCommentId === comment._id
                  ? '2px dashed black'
                  : 'none'
              }`,
              borderRadius: 1,
            }}
          >
            <CommentContainer
              comment={comment}
              handleCommentReply={handleCommentReply}
              handleEditRequest={handleEditRequest}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
              supportReplies={supportReplies}
              replyForm={replyForm && replyForm(comment._id)}
            />

          </Box>
        ))}

      {comments && comments.length > shownComments && (
        <Flex>
          <Button
            sx={{
              margin: '0 auto',
            }}
            variant="outline"
            onClick={handleMoreComments}
          >
            show more comments
          </Button>
        </Flex>
      )}
    </Box>
  )
}
