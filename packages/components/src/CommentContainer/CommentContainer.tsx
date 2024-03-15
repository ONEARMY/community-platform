import { useState } from 'react'
import { Box, Flex } from 'theme-ui'

import {
  ButtonShowReplies,
  CommentItem,
  CommentList,
  CreateReply,
  Icon,
} from '..'

import type { IComment } from '..'

export interface Props {
  comment: IComment
  handleCommentReply?: (commentId: string | null) => void
  handleDelete: (_id: string) => Promise<void>
  handleEdit: (_id: string, comment: string) => Promise<void>
  handleEditRequest: () => Promise<void>
  isLoggedIn: boolean
  isReplies?: boolean
  onSubmitReply?: (_id: string, reply: string) => Promise<void>
  maxLength: number
  supportReplies: boolean
}

export const CommentContainer = (props: Props) => {
  const [isShowReplies, setIsShowReplies] = useState(false)
  const {
    comment,
    handleDelete,
    handleEditRequest,
    handleEdit,
    supportReplies,
    isLoggedIn,
    isReplies,
    maxLength,
    onSubmitReply,
  } = props
  const { _id, creatorName, replies } = comment

  const replyArrow = () => {
    return (
      <Box sx={{ paddingTop: 4 }}>
        <Icon glyph="arrow-curved-bottom-right" />
      </Box>
    )
  }

  const repliesButton = () => {
    return (
      <ButtonShowReplies
        creatorName={creatorName}
        isShowReplies={isShowReplies}
        replies={replies || []}
        setIsShowReplies={() => setIsShowReplies(!isShowReplies)}
      />
    )
  }

  const createReply = () => {
    if (onSubmitReply) {
      return (
        <CreateReply
          commentId={_id}
          isLoggedIn={isLoggedIn}
          maxLength={maxLength}
          onSubmit={onSubmitReply}
        />
      )
    }
  }

  return (
    <Box
      sx={{
        backgroundColor: 'white',
        borderRadius: 1,
        padding: 3,
      }}
    >
      <CommentItem
        comment={comment}
        handleEditRequest={handleEditRequest}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
        isReply={isReplies ? true : false}
      />

      {supportReplies && !isShowReplies && repliesButton()}

      {supportReplies && isShowReplies ? (
        <Flex
          sx={{
            alignItems: 'stretch',
            flexDirection: 'row',
          }}
        >
          {replies && replyArrow()}

          <Flex
            sx={{
              alignItems: 'stretch',
              flexDirection: 'column',
              flex: 1,
            }}
          >
            <CommentList
              comments={replies || []}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
              handleEditRequest={handleEditRequest}
              isLoggedIn={isLoggedIn}
              isReplies={true}
              maxLength={maxLength}
              supportReplies={false}
            />

            {createReply()}

            {repliesButton()}
          </Flex>
        </Flex>
      ) : null}
    </Box>
  )
}
