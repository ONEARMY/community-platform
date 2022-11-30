import { useEffect, useState } from 'react'
import ReactGA from 'react-ga4'
import { Box } from 'theme-ui'
import { Button, CommentItem } from '../'
import type { CommentItemProps as Comment } from '../CommentItem/CommentItem'
const MAX_COMMENTS = 5

export const CommentList: React.FC<{
  comments: Comment[]
  handleEdit: (_id: string, comment: string) => Promise<void>
  handleEditRequest: () => Promise<void>
  handleDelete: (_id: string) => Promise<void>
  highlightedCommentId?: string
  articleTitle?: string
}> = ({
  articleTitle,
  comments,
  handleEditRequest,
  handleDelete,
  highlightedCommentId,
  handleEdit,
}) => {
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

  useEffect(() => {
    if (!highlightedCommentId) return

    const i = comments.findIndex((comment) =>
      highlightedCommentId.includes(comment._id),
    )
    console.log(`Found highlighted comment:`, i)
    if (i > 0) {
      setMoreComments(Math.floor(i / MAX_COMMENTS) + 1)
      scrollIntoRelevantComment(highlightedCommentId)
    }
  }, [highlightedCommentId])

  return (
    <Box
      mb={4}
      sx={{
        width: '100%',
        display: 'block',
      }}
    >
      {comments &&
        comments.slice(0, shownComments).map((comment: Comment) => (
          <Box
            key={comment._id}
            sx={{
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
          </Box>
        ))}
      {comments && comments.length > shownComments && (
        <Button
          sx={{ width: 'max-content', margin: '0 auto' }}
          variant="outline"
          onClick={() => {
            ReactGA.event({
              category: 'Comments',
              action: 'Show more',
              label: articleTitle,
            })
            return setMoreComments(moreComments + 1)
          }}
        >
          show more comments
        </Button>
      )}
    </Box>
  )
}
