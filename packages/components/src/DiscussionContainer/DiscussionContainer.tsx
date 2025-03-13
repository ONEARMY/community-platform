import { useMemo, useState } from 'react'
import { Flex } from 'theme-ui'

import { CommentList } from '../CommentList/CommentList'
import { CreateComment } from '../CreateComment/CreateComment'
import { DiscussionTitle } from '../DiscussionTitle/DiscussionTitle'
import { transformToTree } from './transformToStructuredComments'

import type { IComment } from '../CommentItem/types'

export interface IProps {
  comment: string
  comments: IComment[]
  handleDelete: (_id: string) => Promise<void>
  handleEdit: (_id: string, comment: string) => Promise<void>
  handleEditRequest: () => Promise<void>
  highlightedCommentId?: string
  isLoggedIn: boolean
  maxLength: number
  onChange: (comment: string) => void
  onMoreComments: () => void
  onSubmit: (comment: string) => void
  onSubmitReply: (_id: string, reply: string) => Promise<void>
  isSubmitting: boolean
  supportReplies?: boolean
}

export const DiscussionContainer = (props: IProps) => {
  const {
    comment,
    comments,
    handleDelete,
    handleEdit,
    handleEditRequest,
    onSubmitReply,
    highlightedCommentId,
    maxLength,
    onChange,
    onMoreComments,
    onSubmit,
    isLoggedIn,
    isSubmitting,
    supportReplies = false,
  } = props

  const [commentBeingRepliedTo, setCommentBeingRepliedTo] = useState<
    string | null
  >(null)
  const structuredComments = useMemo(
    () => transformToTree(comments),
    [comments],
  )

  const handleSetCommentBeingRepliedTo = (commentId: string | null): void => {
    if (commentId === commentBeingRepliedTo) {
      setCommentBeingRepliedTo(null)
      return
    }
    setCommentBeingRepliedTo(commentId)
  }

  return (
    <Flex sx={{ flexDirection: 'column', gap: 2 }}>
      <DiscussionTitle comments={comments} />

      <CommentList
        supportReplies={supportReplies}
        comments={structuredComments}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
        handleEditRequest={handleEditRequest}
        highlightedCommentId={highlightedCommentId}
        isLoggedIn={isLoggedIn}
        isReplies={false}
        maxLength={maxLength}
        onMoreComments={onMoreComments}
        onSubmitReply={onSubmitReply}
        setCommentBeingRepliedTo={handleSetCommentBeingRepliedTo}
      />

      <Flex
        sx={{
          alignItems: 'stretch',
          background: 'softblue',
          borderRadius: 2,
          flexDirection: 'column',
          paddingY: 3,
        }}
      >
        <CreateComment
          isLoading={isSubmitting}
          maxLength={maxLength}
          comment={comment}
          onChange={onChange}
          onSubmit={onSubmit}
          isLoggedIn={isLoggedIn}
        />
      </Flex>
    </Flex>
  )
}
