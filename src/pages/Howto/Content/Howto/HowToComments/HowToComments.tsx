import React from 'react'
import { Flex } from 'rebass'
import { Button } from 'src/components/Button'
import { Comment } from 'src/components/Comment/Comment'
import { CommentTextArea } from 'src/components/Comment/CommentTextArea'

interface IComment {
  date: string
  userCountry: string
  userName: string
  comment: string
}

const COMMENTS: IComment[] = [
  {
    date: '00-00-0000',
    userCountry: 'de',
    userName: 'Max Mustermann',
    comment:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  },
]

const MAX_COMMENTS = 5

interface IProps {
  userName?: string
}

// TODO: Expect the comments as a prop from the HowTo
export const HowToComments = ({ userName }: IProps) => {
  // TODO: Not pixel perfect centered...
  return (
    <Flex ml={[0, 0, 6]} mt={5} flexDirection="column" alignItems="center">
      <Flex
        width={[4 / 5, 4 / 5, 2 / 3]}
        mb={4}
        flexDirection="column"
        alignItems="center"
      >
        {COMMENTS.slice(0, MAX_COMMENTS).map((props, id) => (
          <Comment key={id} {...props} />
        ))}
        <Button width="max-content" variant="outline">
          show more comments
        </Button>
      </Flex>
      <CommentTextArea userName={userName} />
    </Flex>
  )
}
