import { useState } from 'react'
import ReactGA from 'react-ga4'
import { Box } from 'theme-ui'
import { Button, CommentItem } from '../'

const MAX_COMMENTS = 5

export const CommentList: React.FC<{
  comments: UserComment[]
  handleEdit: (_id: string, comment: string) => Promise<void>
  handleEditRequest: () => Promise<void>
  handleDelete: (_id: string) => Promise<void>
  articleTitle?: string
}> = ({
  articleTitle,
  comments,
  handleEditRequest,
  handleDelete,
  handleEdit,
}) => {
  const [moreComments, setMoreComments] = useState(1)
  const shownComments = moreComments * MAX_COMMENTS
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
          .map((comment: any) => (
            <CommentItem
              key={comment._id}
              {...comment}
              isUserVerified={!!comment.userIsVerfied}
              isEditable={!!comment.isEditable}
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
