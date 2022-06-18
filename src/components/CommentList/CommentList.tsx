import { useEffect, useState } from 'react'
import ReactGA from 'react-ga4'
import { Box } from 'theme-ui'
import { Button, CommentItem } from 'oa-components'
import type { IComment } from 'src/models'

const MAX_COMMENTS = 5

export const CommentList: React.FC<{
  comments: any
  handleEdit: (_id: string, comment: string) => Promise<void>
  handleEditRequest: () => Promise<void>
  handleDelete: (_id: string) => Promise<void>
  articleTitle?: string
  commentToScrollTo: string
}> = ({
  articleTitle,
  comments,
  handleEditRequest,
  handleDelete,
  handleEdit,
  commentToScrollTo,
}) => {
  const [moreComments, setMoreComments] = useState(1)
  const shownComments = moreComments * MAX_COMMENTS

  const scrollIntoRelevantComment = (hash: string) => {
    setTimeout(() => {
      const section = document.querySelector(hash)
      // the delay is needed, otherwise the scroll is not happening in Firefox
      section?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 1300)
  }

  useEffect(() => {
    const i = comments.map((comment) => comment._id).indexOf(commentToScrollTo)
    if (i > 0) {
      setMoreComments(Math.floor(i / MAX_COMMENTS) + 1)
      scrollIntoRelevantComment('#comment_' + commentToScrollTo)
    }
  }, [commentToScrollTo])

  return (
    <Box
      mb={4}
      sx={{
        width: '100%',
        display: 'block',
      }}
    >
      {comments &&
        comments
          .slice(0, shownComments)
          .map((comment: IComment) => (
            <CommentItem
              key={comment._id}
              {...comment}
              isUserVerified={!!comment.userIsVerfied}
              isEditable={false}
              handleEditRequest={handleEditRequest}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
            />
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
