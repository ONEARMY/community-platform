import React, { useState } from 'react'
import { Flex } from 'rebass'
import { useCommonStores } from 'src'
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
  const { stores } = useCommonStores()
  const [moreComments, setMoreComments] = useState(1)

  async function onSubmit(comment: string) {
    await stores.howtoStore.addComment(comment)
  }

  const shownComments = moreComments * MAX_COMMENTS

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
            .slice(0, shownComments)
            .map(comment => <Comment key={comment._id} {...comment} />)}
        {comments && comments.length > shownComments && (
          <Button
            width="max-content"
            variant="outline"
            onClick={() => setMoreComments(moreComments + 1)}
          >
            show more comments
          </Button>
        )}
      </Flex>
      <CommentTextArea userName={userName} onSubmit={onSubmit} />
    </Flex>
  )
}
