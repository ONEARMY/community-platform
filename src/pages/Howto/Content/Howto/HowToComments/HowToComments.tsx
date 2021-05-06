import React from 'react'
import { Flex } from 'rebass'
import { Button } from 'src/components/Button'
import { Comment } from 'src/components/Comment/Comment'
import { CommentTextArea } from 'src/components/Comment/CommentTextArea'

export interface IProps {}

export const HowToComments = () => {
  // TODO: Not pixel perfect centered...
  return (
    <Flex ml={[0, 0, 6]} mt={5} flexDirection="column" alignItems="center">
      <Flex width={2 / 3} mb={4} flexDirection="column" alignItems="center">
        <Comment />
        <Button width="max-content" variant="outline">
          show more comments
        </Button>
      </Flex>
      <CommentTextArea />
    </Flex>
  )
}
