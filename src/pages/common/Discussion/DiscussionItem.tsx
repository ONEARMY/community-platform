import { Flex } from 'theme-ui'
import { CommentItem } from 'oa-components'

import { trackEvent } from 'src/common/Analytics'
import { logger } from 'src/logger'
import { UserAvatar } from 'src/pages/common/UserAvatar/UserAvatar'

import type { CommentableModel, UserComment } from 'src/models'
import type { CommentableStore } from 'src/stores'

interface IProps {
  comment: UserComment
  parent: CommentableModel
  store: CommentableStore
}

export const DiscussionItem = ({ comment, parent, store }: IProps) => {
  const handleEditRequest = async () => {
    trackEvent({
      category: 'Comments',
      action: 'Edit existing comment',
      label: parent.title,
    })
  }

  const handleDelete = async (_id: string) => {
    await store.deleteComment(_id)
    trackEvent({
      category: 'Comments',
      action: 'Deleted',
      label: parent.title,
    })
    logger.debug(
      {
        category: 'Comments',
        action: 'Deleted',
        label: parent.title,
      },
      'comment deleted',
    )
  }

  const handleEdit = async (_id: string, comment: string) => {
    trackEvent({
      category: 'Comments',
      action: 'Update',
      label: parent.title,
    })
    logger.debug(
      {
        category: 'Comments',
        action: 'Update',
        label: parent.title,
      },
      'comment edited',
    )
    await store.editComment(_id, comment)
  }

  return (
    <Flex sx={{ flexDirection: 'row', alignItems: 'stretch', gap: 2 }}>
      <UserAvatar userName={comment.creatorName} />
      <Flex
        sx={{
          flexDirection: 'column',
          flexGrow: 1,
          gap: 3,
        }}
      >
        <CommentItem
          handleDelete={handleDelete}
          handleEdit={handleEdit}
          handleEditRequest={handleEditRequest}
          isPadding={false}
          {...comment}
        />
      </Flex>
    </Flex>
  )
}
