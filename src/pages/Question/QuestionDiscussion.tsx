import { useEffect, useState } from 'react'
import { DiscussionContainer, Loader } from 'oa-components'
import { transformToUserComments } from 'src/common/transformToUserComments'
import { MAX_COMMENT_LENGTH } from 'src/constants'
import { logger } from 'src/logger'
import { useDiscussionStore } from 'src/stores/Discussions/discussions.store'
import { Card } from 'theme-ui'

import type { IDiscussion } from 'src/models'

interface IProps {
  questionDocId: string
  setTotalCommentsCount: (number) => void
}

export const QuestionDiscussion = (props: IProps) => {
  const [comment, setComment] = useState('')
  const [discussion, setDiscussion] = useState<IDiscussion | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { questionDocId, setTotalCommentsCount } = props

  const store = useDiscussionStore()
  const highlightedCommentId = window.location.hash.replace('#comment:', '')

  const transformComments = (discussion) => {
    const comments = transformToUserComments(
      discussion.comments,
      store.activeUser,
    )
    setTotalCommentsCount(comments.length)
    return setDiscussion({ ...discussion, comments })
  }

  useEffect(() => {
    const loadDiscussion = async () => {
      const discussion = await store.fetchOrCreateDiscussionBySource(
        questionDocId,
        'question',
      )
      if (!discussion) {
        return
      }
      transformComments(discussion)
      setIsLoading(false)
    }
    loadDiscussion()
  }, [questionDocId])

  const handleEdit = async (_id: string, comment: string) => {
    if (!discussion) return

    const updatedDiscussion = await store.editComment(discussion, _id, comment)
    logger.info({ _id, comment }, 'question comment edited')
    updatedDiscussion && transformComments(updatedDiscussion)
  }

  const handleEditRequest = async () => {
    logger.debug('Edit existing comment')
  }

  const handleDelete = async (_id: string) => {
    if (discussion) {
      const updatedDiscussion = await store.deleteComment(discussion, _id)
      logger.info({ _id }, 'question comment deleted')
      updatedDiscussion && transformComments(updatedDiscussion)
    }
  }

  const onSubmit = async (comment: string) => {
    if (!comment || !discussion) {
      return
    }

    const updatedDiscussion = await store.addComment(discussion, comment)
    if (updatedDiscussion) {
      transformComments(updatedDiscussion)
      setComment('')
    }
  }

  const handleSubmitReply = async (commentId: string, reply) => {
    if (!discussion) return

    const updatedDiscussion = await store.addComment(
      discussion,
      reply,
      commentId,
    )
    logger.info({ commentId, reply }, 'reply submitted')

    updatedDiscussion && transformComments(updatedDiscussion)
  }

  return (
    <Card
      sx={{
        marginTop: 5,
        padding: 4,
      }}
    >
      {isLoading ? (
        <Loader />
      ) : discussion ? (
        <DiscussionContainer
          supportReplies={true}
          comments={discussion.comments as any}
          maxLength={MAX_COMMENT_LENGTH}
          comment={comment}
          onChange={setComment}
          onMoreComments={() => {}}
          handleEdit={handleEdit}
          handleEditRequest={handleEditRequest}
          handleDelete={handleDelete}
          highlightedCommentId={highlightedCommentId}
          onSubmit={onSubmit}
          onSubmitReply={handleSubmitReply}
          isLoggedIn={!!store.activeUser}
        />
      ) : null}
    </Card>
  )
}
