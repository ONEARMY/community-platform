import React from 'react'
import { Flex } from 'rebass'
import { Button } from 'src/components/Button'
import { Comment } from 'src/components/Comment/Comment'
import { CommentTextArea } from 'src/components/Comment/CommentTextArea'
import { IComment } from 'src/models'

const MAX_COMMENTS = 5

interface IProps {
  userName?: string
  comments?: IComment[]
}

// TODO: Expect the comments as a prop from the HowTo
export const HowToComments = ({ userName, comments }: IProps) => {
  // TODO: Not pixel perfect centered...
  return (
    <Flex ml={[0, 0, 6]} mt={5} flexDirection="column" alignItems="center">
      <Flex
        width={[4 / 5, 4 / 5, 2 / 3]}
        mb={4}
        flexDirection="column"
        alignItems="center"
      >
        {comments &&
          comments
            .slice(0, MAX_COMMENTS)
            .map(comment => <Comment key={comment._id} {...comment} />)}
        {comments && comments.length && (
          <Button width="max-content" variant="outline">
            show more comments
          </Button>
        )}
      </Flex>
      <CommentTextArea userName={userName} />
    </Flex>
  )
}
