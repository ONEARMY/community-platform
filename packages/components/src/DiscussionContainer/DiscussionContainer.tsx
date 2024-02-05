import { useMemo, useState } from 'react'
import { Box, Flex } from 'theme-ui'

import { CommentList, CreateComment, DiscussionTitle } from '../'
import { transformToTree } from './transformToStructuredComments'

import type { IComment } from '..'

export interface IProps {
  comment: string
  comments: IComment[]
  handleEdit: (_id: string, comment: string) => Promise<void>
  handleEditRequest: () => Promise<void>
  handleDelete: (_id: string) => Promise<void>
  highlightedCommentId?: string
  maxLength: number
  onChange: (comment: string) => void
  onMoreComments: () => void
  onSubmit: (comment: string) => void
  onSubmitReply?: (_id: string, comment: string) => Promise<void>
  isLoggedIn: boolean
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
    supportReplies = false,
  } = props

  const [commentBeingRepliedTo, setCommentBeingRepliedTo] = useState<
    null | string
  >(null)
  const structuredComments = useMemo(
    () => transformToTree(comments),
    [comments],
  )

  const reployForm = (commentId: string) => {
    if (commentId !== commentBeingRepliedTo) {
      return <></>
    }

    return (
      <Box
        sx={{
          background: 'softblue',
          borderRadius: 2,
          padding: 3,
          mt: 3,
        }}
      >
        <CreateComment
          maxLength={maxLength}
          comment={comment}
          onChange={onChange}
          onSubmit={() => {
            if (commentId && onSubmitReply) {
              onSubmitReply(commentId, comment)
            }
            setCommentBeingRepliedTo(null)
          }}
          buttonLabel="Send your reply"
          isLoggedIn={isLoggedIn}
        />
      </Box>
    )
  }

  const handleSetCommentBeingRepliedTo = (commentId: string | null): void => {
    if (commentId === commentBeingRepliedTo) {
      return setCommentBeingRepliedTo(null)
    }
    setCommentBeingRepliedTo(commentId)
  }

  return (
    <>
      <DiscussionTitle length={comments.length} />

      <CommentList
        currentDepth={0}
        maxDepth={1}
        supportReplies={supportReplies}
        replyForm={reployForm}
        comments={structuredComments}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
        handleEditRequest={handleEditRequest}
        highlightedCommentId={highlightedCommentId}
        onMoreComments={onMoreComments}
        setCommentBeingRepliedTo={handleSetCommentBeingRepliedTo}
      />

      <Flex
        sx={{
          alignItems: 'stretch',
          background: 'softblue',
          borderRadius: 2,
          flexDirection: 'column',
          padding: 3,
        }}
      >
        <CreateComment
          maxLength={maxLength}
          comment={comment}
          onChange={onChange}
          onSubmit={onSubmit}
          isLoggedIn={isLoggedIn}
        />
      </Flex>
    </>
  )
}
