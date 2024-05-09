import { useEffect, useState } from 'react'
import { DiscussionContainer, Loader } from 'oa-components'
import { transformToUserComments } from 'src/common/transformToUserComments'
import { MAX_COMMENT_LENGTH } from 'src/constants'
import { logger } from 'src/logger'
import { Card } from 'theme-ui'

import { useCommonStores } from './hooks/useCommonStores'

import type { IDiscussion } from 'src/models'

interface IProps {
  sourceType: IDiscussion['sourceType']
  sourceId: string
  setTotalCommentsCount: (number) => void
}

export const DiscussionWrapper = (props: IProps) => {
  const [comment, setComment] = useState('')
  const [discussion, setDiscussion] = useState<IDiscussion | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { sourceType, setTotalCommentsCount, sourceId } = props

  const { discussionStore } = useCommonStores().stores
  const highlightedCommentId = window.location.hash.replace('#comment:', '')

  const transformComments = (discussion) => {
    const comments = transformToUserComments(
      discussion.comments,
      discussionStore.activeUser,
    )
    setTotalCommentsCount(comments.length)
    return setDiscussion({ ...discussion, comments })
  }

  useEffect(() => {
    const loadDiscussion = async () => {
      const discussion = await discussionStore.fetchOrCreateDiscussionBySource(
        sourceId,
        sourceType,
      )
      if (!discussion) {
        return
      }
      transformComments(discussion)
      setIsLoading(false)
    }
    loadDiscussion()
  }, [sourceId])

  const handleEdit = async (_id: string, comment: string) => {
    if (!discussion) return

    const updatedDiscussion = await discussionStore.editComment(
      discussion,
      _id,
      comment,
    )
    logger.info({ _id, comment }, `${sourceType} comment edited`)
    updatedDiscussion && transformComments(updatedDiscussion)
  }

  const handleEditRequest = async () => {
    logger.debug('Edit existing comment')
  }

  const handleDelete = async (_id: string) => {
    if (discussion) {
      const updatedDiscussion = await discussionStore.deleteComment(
        discussion,
        _id,
      )
      logger.info({ _id }, `${sourceType} comment deleted`)
      updatedDiscussion && transformComments(updatedDiscussion)
    }
  }

  const onSubmit = async (comment: string) => {
    if (!comment || !discussion) {
      return
    }

    const updatedDiscussion = await discussionStore.addComment(
      discussion,
      comment,
    )
    if (updatedDiscussion) {
      transformComments(updatedDiscussion)
      setComment('')
    }
  }

  const handleSubmitReply = async (commentId: string, reply) => {
    if (!discussion) return

    const updatedDiscussion = await discussionStore.addComment(
      discussion,
      reply,
      commentId,
    )
    logger.info({ commentId, reply }, `${sourceType} reply submitted`)

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
          isLoggedIn={!!discussionStore.activeUser}
        />
      ) : null}
    </Card>
  )
}
