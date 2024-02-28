import { useState } from 'react'
import { DiscussionContainer } from 'oa-components'
import { trackEvent } from 'src/common/Analytics'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { MAX_COMMENT_LENGTH } from 'src/constants'
import { logger } from 'src/logger'
import { Card, Flex } from 'theme-ui'

import type { UserComment } from 'src/models'

interface IProps {
  comments: UserComment[]
}

export const HowToComments = ({ comments }: IProps) => {
  const [comment, setComment] = useState('')
  const { stores } = useCommonStores()

  const category = 'Comments'
  const highlightedCommentId = window.location.hash.replace('#comment:', '')
  const label = stores.howtoStore.activeHowto?.title
  const isLoggedIn = !!stores.userStore.activeUser

  const onSubmit = async (comment: string) => {
    try {
      await stores.howtoStore.addComment(comment)
      setComment('')

      const action = 'Submitted'
      trackEvent({ action, category, label })
      logger.debug({ action, category, label }, 'comment submitted')
    } catch (err) {
      logger.error('Failed to submit comment', { err })
    }
  }

  const handleEditRequest = async () => {
    const action = 'Edit existing comment'
    trackEvent({ action, category, label })
  }

  const handleDelete = async (_id: string) => {
    await stores.howtoStore.deleteComment(_id)

    const action = 'Deleted'
    trackEvent({ action, category, label })
    logger.debug({ action, category, label }, 'comment deleted')
  }

  const handleEdit = async (_id: string, comment: string) => {
    await stores.howtoStore.editComment(_id, comment)

    const action = 'Update'
    trackEvent({ action, category, label })
    logger.debug({ action, category, label }, 'comment edited')
  }

  const onMoreComments = () => {
    const action = 'Show more'
    trackEvent({ action, category, label })
  }

  return (
    <Flex
      mt={5}
      sx={{ flexDirection: 'column', alignItems: 'center' }}
      data-cy="howto-comments"
    >
      <Flex
        sx={{
          alignItems: 'stretch',
          flexDirection: 'column',
          marginBottom: [2, 2, 4],
          width: ['100%', '100%', `90%`, `${(2 / 3) * 100}%`],
        }}
      >
        <Card sx={{ gap: 2, padding: 3 }}>
          <DiscussionContainer
            comments={comments}
            handleEdit={handleEdit}
            handleEditRequest={handleEditRequest}
            handleDelete={handleDelete}
            highlightedCommentId={highlightedCommentId}
            maxLength={MAX_COMMENT_LENGTH}
            comment={comment}
            onChange={setComment}
            onMoreComments={onMoreComments}
            onSubmit={onSubmit}
            isLoggedIn={isLoggedIn}
          />
        </Card>
      </Flex>
    </Flex>
  )
}
