import { CommentList, CreateComment } from 'oa-components'
import { useState } from 'react'
import { MAX_COMMENT_LENGTH } from 'src/constants'
import { useCommonStores } from 'src/index'
import { logger } from 'src/logger'
import { Box, Flex } from 'theme-ui'

import type { UserComment } from 'src/models'
import { trackEvent } from 'src/common/Analytics'
interface IProps {
  comments: UserComment[]
}

// TODO: Expect the comments as a prop from the HowTo
export const HowToComments = ({ comments }: IProps) => {
  const [comment, setComment] = useState('')
  const { stores } = useCommonStores()

  const onSubmit = async (comment: string) => {
    try {
      const howto = stores.howtoStore.activeHowto
      await stores.howtoStore.addComment(comment)
      if (howto) {
        await stores.userNotificationsStore.triggerNotification(
          'new_comment',
          howto._createdBy,
          '/how-to/' + howto.slug,
        )
      }

      setComment('')

      trackEvent({
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
      logger.error('Failed to submit comment', { err })
    }
  }

  const handleEditRequest = async () => {
    trackEvent({
      category: 'Comments',
      action: 'Edit existing comment',
      label: stores.howtoStore.activeHowto?.title,
    })
  }

  const handleDelete = async (_id: string) => {
    await stores.howtoStore.deleteComment(_id)
    trackEvent({
      category: 'Comments',
      action: 'Deleted',
      label: stores.howtoStore.activeHowto?.title,
    })
    logger.debug(
      {
        category: 'Comments',
        action: 'Deleted',
        label: stores.howtoStore.activeHowto?.title,
      },
      'comment deleted',
    )
  }

  const handleEdit = async (_id: string, comment: string) => {
    trackEvent({
      category: 'Comments',
      action: 'Update',
      label: stores.howtoStore.activeHowto?.title,
    })
    logger.debug(
      {
        category: 'Comments',
        action: 'Update',
        label: stores.howtoStore.activeHowto?.title,
      },
      'comment edited',
    )
    await stores.howtoStore.editComment(_id, comment)
  }

  return (
    <Flex
      mt={5}
      sx={{ flexDirection: 'column', alignItems: 'center' }}
      data-cy="howto-comments"
    >
      <Flex
        mb={4}
        sx={{
          width: [`100%`, `${(4 / 5) * 100}%`, `${(2 / 3) * 100}%`],
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <CommentList
          articleTitle={stores.howtoStore.activeHowto?.title}
          comments={comments}
          handleEdit={handleEdit}
          handleEditRequest={handleEditRequest}
          handleDelete={handleDelete}
          highlightedCommentId={window.location.hash.replace('#comment:', '')}
          trackEvent={trackEvent}
        />
      </Flex>
      <Box
        sx={{
          width: ['100%', `${(4 / 5) * 100}%`, `${(2 / 3) * 100}%`],
        }}
      >
        <CreateComment
          maxLength={MAX_COMMENT_LENGTH}
          comment={comment}
          onChange={setComment}
          onSubmit={onSubmit}
          isLoggedIn={!!stores.userStore.activeUser}
          sx={{
            marginLeft: [0, 2 * -1],
          }}
        />
      </Box>
    </Flex>
  )
}
