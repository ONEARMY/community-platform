import { useState } from 'react'
import { CreateComment } from 'oa-components'
import { Flex } from 'theme-ui'

import { trackEvent } from 'src/common/Analytics'
import { useCommonStores } from 'src/index'
import { MAX_COMMENT_LENGTH } from 'src/constants'
import { logger } from 'src/logger'
import { UserAvatar } from 'src/pages/common/UserAvatar/UserAvatar'

import type { CommentableModel, UserComment } from 'src/models'
import type { CommentableStore } from 'src/stores'

interface IProps {
  buttonLabel: string
  parent: CommentableModel
  store: CommentableStore
}

export const DiscussionAdd = (props: IProps) => {
  const { buttonLabel, parent, store } = props

  const [comment, setComment] = useState<UserComment['text']>('')
  const { stores } = useCommonStores()
  const loggedInUser = stores.userStore.activeUser
  const userAvatar = loggedInUser ? (
    <UserAvatar userName={loggedInUser.userName} />
  ) : undefined

  const onSubmit = async (comment: string) => {
    try {
      await store.addComment(comment)
      await stores.userNotificationsStore.triggerNotification(
        'new_comment',
        parent._createdBy,
        '/how-to/' + parent.slug,
      )

      setComment('')

      const info = {
        category: 'Comments',
        action: 'Submitted',
        label: parent.title,
      }
      trackEvent(info)
      logger.debug(info, 'comment submitted')
    } catch (err) {
      logger.error('Failed to submit comment', { err })
    }
  }

  return (
    <Flex
      sx={{
        alignItems: 'stretch',
        background: 'softblue',
        borderRadius: 2,
        flexDirection: 'column',
        gap: 3,
        padding: 3,
      }}
    >
      <CreateComment
        buttonLabel={buttonLabel}
        comment={comment}
        isLoggedIn={!!stores.userStore.activeUser}
        maxLength={MAX_COMMENT_LENGTH}
        onChange={setComment}
        onSubmit={onSubmit}
        userAvatar={userAvatar}
        sx={{
          marginLeft: [0, 2 * -1],
        }}
      />
    </Flex>
  )
}
