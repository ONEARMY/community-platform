import { useState } from 'react'
import { Box, Flex } from 'theme-ui'

import { CommentList, CreateComment, DiscussionTitle } from '../'

import type { CommentItemProps as Comment } from '../CommentItem/CommentItem'

export interface IProps {
  comment: string
  comments: Comment[]
  handleEdit: (_id: string, comment: string) => Promise<void>
  handleEditRequest: () => Promise<void>
  handleDelete: (_id: string) => Promise<void>
  highlightedCommentId?: string
  maxLength: number
  onChange: (comment: string) => void
  onMoreComments: () => void
  onSubmit: (comment: string) => void
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
    highlightedCommentId,
    maxLength,
    onChange,
    onMoreComments,
    onSubmit,
    isLoggedIn,
    supportReplies: _supportReplies,
  } = props

  const [commentBeingRepliedTo, setCommentBeingRepliedTo] = useState<
    null | string
  >(null)
  const supportReplies = _supportReplies ?? false

  return (
    <>
      <DiscussionTitle length={comments.length} />

      <CommentList
        supportReplies={supportReplies}
        replyForm={(commentId) => {
          if (commentId !== commentBeingRepliedTo) {
            return <></>
          }

          return (
            <Box sx={{ py: 2 }}>
              <CreateComment
                maxLength={maxLength}
                comment={comment}
                onChange={onChange}
                onSubmit={onSubmit}
                buttonLabel="Send your reply"
                isLoggedIn={isLoggedIn}
              />
            </Box>
          )
        }}
        comments={comments}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
        handleEditRequest={handleEditRequest}
        highlightedCommentId={highlightedCommentId}
        onMoreComments={onMoreComments}
        setCommentBeingRepliedTo={(commentId) => {
          if (commentId === commentBeingRepliedTo) {
            setCommentBeingRepliedTo(null)
            return
          }
          setCommentBeingRepliedTo(commentId)
        }}
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
