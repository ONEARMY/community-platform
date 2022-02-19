import { useState } from 'react'
import ReactGA from 'react-ga'
import { Box, Flex } from 'rebass/styled-components'
import { useCommonStores } from 'src/index'
import { Button } from 'src/components/Button'
import { Comment } from 'src/components/Comment/Comment'
import { CommentTextArea } from 'src/components/Comment/CommentTextArea'
import { IComment } from 'src/models'
import styled from 'styled-components'
import { logger } from 'src/logger'

const MAX_COMMENTS = 5

interface IProps {
  comments?: IComment[]
  verifiedUsers?: { [user_id: string]: boolean }
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
export const HowToComments = ({ comments, verifiedUsers }: IProps) => {
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const { stores } = useCommonStores()
  const [moreComments, setMoreComments] = useState(1)

  async function onSubmit(comment: string) {
    try {
      const howto = stores.howtoStore.activeHowto
      setLoading(true)
      await stores.howtoStore.addComment(comment)
      if (howto) {
        await stores.userStore.triggerNotification(
          'new_comment',
          howto._createdBy,
          howto.slug,
        )
      }

      setLoading(false)
      setComment('')

      ReactGA.event({
        category: 'Comments',
        action: 'Submitted',
        label: stores.howtoStore.activeHowto?.title,
      })
      logger.debug(
        {
          category: 'Comments',
          action: 'Submitted',
          label: stores.howtoStore.activeHowto?.title,
        },
        'comment submitted',
      )
    } catch (err) {
      // Error: Comment could not be posted
      logger.error({ err }, 'failed to submit comment')
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
            .map(comment => (
              <Comment
                key={comment._id}
                verified={verifiedUsers?.[comment.creatorName] ? true : false}
                {...comment}
              />
            ))}
        {comments && comments.length > shownComments && (
          <Button
            width="max-content"
            variant="outline"
            onClick={() => {
              ReactGA.event({
                category: 'Comments',
                action: 'Show more',
                label: stores.howtoStore.activeHowto?.title,
              })
              return setMoreComments(moreComments + 1)
            }}
          >
            show more comments
          </Button>
        )}
      </Flex>
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
    </Flex>
  )
}
