import { useEffect, useState } from 'react'
import { DiscussionContainer, Loader } from 'oa-components'
import { transformToUserComments } from 'src/common/transformToUserComments'
import { MAX_COMMENT_LENGTH } from 'src/constants'
import { logger } from 'src/logger'

import { useCommonStores } from './hooks/useCommonStores'
import { HideDiscussionContainer } from './HideDiscussionContainer'

import type { IDiscussion } from 'src/models'

interface IProps {
  sourceType: IDiscussion['sourceType']
  sourceId: string
  setTotalCommentsCount: (number) => void
  canHideComments?: boolean
  showComments?: boolean
}

export const DiscussionWrapper = (props: IProps) => {
  const {
    canHideComments,
    sourceType,
    setTotalCommentsCount,
    sourceId,
    showComments,
  } = props

  const [comment, setComment] = useState('')
  const [discussion, setDiscussion] = useState<IDiscussion | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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

  const discussionProps = {
    supportReplies: true,
    comments: discussion && (discussion.comments as any),
    maxLength: MAX_COMMENT_LENGTH,
    comment,
    onChange: setComment,
    onMoreComments: () => {},
    handleEdit,
    handleEditRequest,
    handleDelete,
    highlightedCommentId,
    onSubmit,
    onSubmitReply: handleSubmitReply,
    isLoggedIn: discussionStore?.activeUser
      ? !!discussionStore.activeUser
      : false,
  }

  return (
    <>
      {isLoading && <Loader />}
      {discussion && canHideComments && (
        <HideDiscussionContainer
          commentCount={discussion.comments.length}
          showComments={showComments}
        >
          <DiscussionContainer {...discussionProps} />
        </HideDiscussionContainer>
      )}
      {discussion && !canHideComments && (
        <DiscussionContainer {...discussionProps} />
      )}
    </>
  )
}
