import React, { useState } from 'react'
import { Box, Flex } from 'rebass/styled-components'
import { useCommonStores } from 'src/index'
import { AuthWrapper } from 'src/components/Auth/AuthWrapper'
import { Button } from 'src/components/Button'
import { Comment } from 'src/components/Comment/Comment'
import { CommentTextArea } from 'src/components/Comment/CommentTextArea'
import { IComment } from 'src/models'
import styled from 'styled-components'

const MAX_COMMENTS = 5

interface IProps {
  comments?: IComment[]
}

const BoxStyled = styled(Box)`
  position: relative;
  border-radius: 5px;
`

const ButtonStyled = styled(Button)`
  float: right;
  margin-top: 1em !important;
`

// TODO: Expect the comments as a prop from the HowTo
export const HowToComments = ({ comments }: IProps) => {
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const { stores } = useCommonStores()
  const [moreComments, setMoreComments] = useState(1)

  async function onSubmit(comment: string) {
    try {
      setLoading(true)
      await stores.howtoStore.addComment(comment)
      setLoading(false)
      setComment('')
    } catch (err) {
      // Error: Comment could not be posted
    }
  }

  const shownComments = moreComments * MAX_COMMENTS

  return (
    <Flex
      ml={[0, 0, 6]}
      mt={5}
      flexDirection="column"
      alignItems="center"
      data-cy="howto-comments"
    >
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
      <AuthWrapper
        roleRequired="beta-tester"
        fallback="You must be a Beta Tester to add a comment"
      >
        <BoxStyled width={2 / 3}>
          <CommentTextArea
            data-cy="comment-text-area"
            comment={comment}
            onChange={setComment}
            loading={loading}
          />
          <ButtonStyled
            data-cy="comment-submit"
            disabled={!Boolean(comment.trim()) || loading}
            variant="primary"
            onClick={() => onSubmit(comment)}
          >
            Comment
          </ButtonStyled>
        </BoxStyled>
      </AuthWrapper>
    </Flex>
  )
}
