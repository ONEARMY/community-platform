import { useState } from 'react'
import ReactGA from 'react-ga4'
import { Box, Flex } from 'theme-ui'
import { useCommonStores } from 'src/index'
import { CreateComment, CommentList } from 'oa-components'
import type { UserComment } from 'src/models'
import { logger } from 'src/logger'
import { MAX_COMMENT_LENGTH } from 'src/constants'

interface IProps {
  comments: UserComment[]
}

// TODO: Expect the comments as a prop from the HowTo
export const HowToComments = ({ comments }: IProps) => {
  const [comment, setComment] = useState('')
  const { stores } = useCommonStores()

  async function onSubmit(comment: string) {
    try {
      const howto = stores.howtoStore.activeHowto
      await stores.howtoStore.addComment(comment)
      if (howto) {
        await stores.userStore.triggerNotification(
          'new_comment',
          howto._createdBy,
          '/how-to/' + howto.slug,
        )
      }

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

  async function handleEditRequest() {
    ReactGA.event({
      category: 'Comments',
      action: 'Edit existing comment',
      label: stores.howtoStore.activeHowto?.title,
    })
  }

  async function handleDelete(_id: string) {
    const confirmation = window.confirm(
      'Are you sure you want to delete this comment?',
    )
    if (confirmation) {
      await stores.howtoStore.deleteComment(_id)
      ReactGA.event({
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
  }

  async function handleEdit(_id: string, comment: string) {
    ReactGA.event({
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
      ml={[0, 0, 6]}
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
        />
      </Flex>
      <Box
        sx={{
          width: ['100%', `calc(${(2 / 3) * 100}%)`],
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
