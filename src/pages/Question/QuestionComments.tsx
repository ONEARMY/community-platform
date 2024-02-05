import { useEffect, useState } from 'react'
import { DiscussionContainer } from 'oa-components'
import { transformToUserComments } from 'src/common/transformToUserComments'
import { MAX_COMMENT_LENGTH } from 'src/constants'
import { logger } from 'src/logger'
import { useDiscussionStore } from 'src/stores/Discussions/discussions.store'
import { Card } from 'theme-ui'

import type { IDiscussion, IDiscussionComment, IUserPPDB } from 'src/models'

interface IProps {
  questionDocId: string
  comments: IDiscussionComment[]
  activeUser?: IUserPPDB | null
  onSubmit: (comment: string) => void
  commentsUpdated: (comments: IDiscussionComment[]) => void
}

export const QuestionComments = ({
  questionDocId,
  comments,
  activeUser,
  onSubmit,
  commentsUpdated,
}: IProps) => {
  const [comment, setComment] = useState('')
  const [discussionObject, setDiscussionObject] = useState<IDiscussion | null>(
    null,
  )
  const store = useDiscussionStore()

  useEffect(() => {
    const loadDiscussion = async () => {
      const obj = await store.fetchOrCreateDiscussionBySource(
        questionDocId,
        'question',
      )
      if (!obj) {
        return
      }
      setDiscussionObject(obj)
    }
    loadDiscussion()
  }, [questionDocId])

  const handleEdit = async (_id: string, comment: string) => {
    logger.info({ _id, comment }, 'question comment edited')
    if (discussionObject) {
      store.editComment(discussionObject, _id, comment)
    }
  }

  const handleEditRequest = async () => {
    logger.debug('Edit existing comment')
  }

  const handleDelete = async (_id: string) => {
    logger.debug({ _id }, 'question comment deleted')
    if (discussionObject) {
      const updatedObj = await store.deleteComment(discussionObject, _id)
      commentsUpdated &&
        commentsUpdated(
          transformToUserComments(updatedObj?.comments || [], activeUser),
        )
    }
  }

  const handleSubmitReply = async (commentId: string, reply) => {
    logger.info({ commentId, reply }, 'reply submitted')
    if (discussionObject) {
      const updatedObj = await store.addComment(
        discussionObject,
        reply,
        commentId,
      )
      commentsUpdated &&
        commentsUpdated(
          transformToUserComments(updatedObj?.comments || [], activeUser),
        )
    }
  }

  return (
    <Card
      sx={{
        marginTop: 5,
        padding: 4,
      }}
    >
      <DiscussionContainer
        canHaveReplies={true}
        comments={comments as any}
        maxLength={MAX_COMMENT_LENGTH}
        comment={comment}
        onChange={setComment}
        onMoreComments={() => {}}
        handleEdit={handleEdit}
        handleEditRequest={handleEditRequest}
        handleDelete={handleDelete}
        onSubmit={() => {
          onSubmit(comment)
          setComment('')
        }}
        onSubmitReply={handleSubmitReply}
        isLoggedIn={!!activeUser}
      />
    </Card>
  )
}
