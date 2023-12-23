import { CommentList } from 'oa-components'
import { Box } from 'theme-ui'

import type { IDiscussionComment } from 'src/models'

interface IProps {
  comments: IDiscussionComment[]
}

export const QuestionComments = ({ comments }: IProps) => {
  return (
    <>
      {
        <Box mt={5}>
          <CommentList comments={comments} />
        </Box>
      }
    </>
  )
}
