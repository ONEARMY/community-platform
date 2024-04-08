import { useEffect, useState } from 'react'
import { Box, Flex } from 'theme-ui'

import { Button } from '../Button/Button'
import { CommentContainer } from '../CommentContainer/CommentContainer'

import type { IComment } from '../CommentItem/types'

const MAX_COMMENTS = 5

export interface IProps {
  supportReplies?: boolean
  comments: IComment[]
  handleDelete: (_id: string) => Promise<void>
  handleEdit: (_id: string, comment: string) => Promise<void>
  handleEditRequest: () => Promise<void>
  highlightedCommentId?: string
  isLoggedIn: boolean
  maxLength: number
  isReplies: boolean
  onMoreComments?: () => void
  onSubmitReply?: (_id: string, reply: string) => Promise<void>
  setCommentBeingRepliedTo?: (commentId: string | null) => void
}

export const CommentList = (props: IProps) => {
  const {
    comments,
    handleDelete,
    handleEdit,
    handleEditRequest,
    highlightedCommentId,
    isLoggedIn,
    isReplies,
    maxLength,
    onMoreComments,
    onSubmitReply,
    supportReplies = false,
  } = props

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
              handleEditRequest={handleEditRequest}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
              isLoggedIn={isLoggedIn}
              isReplies={isReplies}
              maxLength={maxLength}
              onSubmitReply={onSubmitReply}
              supportReplies={supportReplies}
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
