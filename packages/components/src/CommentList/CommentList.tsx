import { useEffect, useState } from 'react'
import { Box, Flex } from 'theme-ui'

import { Button, CommentItem } from '../'

import type { IComment } from '..'

const MAX_COMMENTS = 5

export interface IProps {
  supportReplies?: boolean
  comments: IComment[]
  handleEdit: (_id: string, comment: string) => Promise<void>
  handleEditRequest: () => Promise<void>
  handleDelete: (_id: string) => Promise<void>
  highlightedCommentId?: string
  onMoreComments: () => void
  setCommentBeingRepliedTo?: (commentId: string | null) => void
  replyForm?: (commentId: string) => JSX.Element
  currentDepth?: number
  maxDepth?: number
}

export const CommentList = (props: IProps) => {
  const {
    comments,
    handleEditRequest,
    handleDelete,
    highlightedCommentId,
    handleEdit,
    onMoreComments,
    replyForm,
    setCommentBeingRepliedTo,
    supportReplies = false,
    maxDepth = 9999,
    currentDepth = 0,
  } = props

  const hasRepliesEnabled = supportReplies && currentDepth < maxDepth

  const [moreComments, setMoreComments] = useState(1)
  const shownComments = moreComments * MAX_COMMENTS

  const handleMoreComments = () => {
    onMoreComments()
    setMoreComments(moreComments + 1)
  }

  const scrollIntoRelevantComment = (commentId: string) => {
    setTimeout(() => {
      // the delay is needed, otherwise the scroll is not happening in Firefox
      document
        .getElementById(`comment:${commentId}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 0)
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
            <CommentItem
              {...comment}
              handleCommentReply={handleCommentReply}
              isUserVerified={!!comment.isUserVerified}
              isEditable={!!comment.isEditable}
              handleEditRequest={handleEditRequest}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
            />
            {replyForm && replyForm(comment._id)}
            {comment.replies ? (
              <Box sx={{ pt: 4, pl: 4 }}>
                <CommentList
                  currentDepth={currentDepth + 1}
                  maxDepth={maxDepth}
                  comments={comment.replies}
                  supportReplies={hasRepliesEnabled}
                  handleEditRequest={handleEditRequest}
                  handleDelete={handleDelete}
                  handleEdit={handleEdit}
                  onMoreComments={handleMoreComments}
                  replyForm={replyForm}
                  setCommentBeingRepliedTo={setCommentBeingRepliedTo}
                />
              </Box>
            ) : null}
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
