import { useEffect, useState } from 'react'
import { Box, Flex } from 'theme-ui'

import { Button, CommentItem } from '../'

import type { CommentItemProps as Comment } from '../CommentItem/CommentItem'

export type CommentWithReplies = Comment & { replies?: Comment[] }

const MAX_COMMENTS = 5

export interface IProps {
  comments: CommentWithReplies[]
  handleEdit: (_id: string, comment: string) => Promise<void>
  handleEditRequest: () => Promise<void>
  handleDelete: (_id: string) => Promise<void>
  highlightedCommentId?: string
  onMoreComments: () => void
}

export const CommentList = (props: IProps) => {
  const {
    comments,
    handleEditRequest,
    handleDelete,
    highlightedCommentId,
    handleEdit,
    onMoreComments,
  } = props
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
              isUserVerified={!!comment.isUserVerified}
              isEditable={!!comment.isEditable}
              handleEditRequest={handleEditRequest}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
            />
            {comment.replies ? (
              <Box sx={{ pt: 4, pl: 4 }}>
                <CommentList
                  comments={comment.replies}
                  handleEditRequest={handleEditRequest}
                  handleDelete={handleDelete}
                  handleEdit={handleEdit}
                  onMoreComments={handleMoreComments}
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
