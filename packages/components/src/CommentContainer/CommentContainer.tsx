import { useState } from 'react'
import { Box, Flex } from 'theme-ui'

import { ButtonShowReplies, CommentItem, CommentList, Icon } from '..'

import type { IComment } from '..'

export interface Props {
  comment: IComment
  handleCommentReply?: (commentId: string | null) => void
  handleDelete: (commentId: string) => Promise<void>
  handleEdit: (commentId: string, newCommentText: string) => void
  handleEditRequest: (commentId: string) => Promise<void>
  supportReplies: boolean
  replyForm: any
}

export const CommentContainer = (props: Props) => {
  const [isShowReplies, setIsShowReplies] = useState(false)
  const {
    comment,
    handleDelete,
    handleEditRequest,
    handleEdit,
    supportReplies,
    replyForm,
  } = props
  const { creatorName, replies } = comment

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
      />

      {supportReplies && !isShowReplies && repliesButton()}

      {supportReplies && replies && isShowReplies ? (
        <Flex
          sx={{
            alignItems: 'stretch',
            flexDirection: 'row',
          }}
        >
          <Box
            sx={{
              paddingTop: 4,
            }}
          >
            <Icon glyph="arrow-curved-bottom-right" />
          </Box>

          <Flex
            sx={{
              alignItems: 'stretch',
              flexDirection: 'column',
              flex: 1,
            }}
          >
            <CommentList
              comments={comment.replies || []}
              handleEditRequest={() => Promise.resolve()}
              handleDelete={() => Promise.resolve()}
              handleEdit={() => Promise.resolve()}
              supportReplies={false}
            />
            {replyForm()}
            {supportReplies && isShowReplies && repliesButton()}
          </Flex>
        </Flex>
      ) : null}
    </Box>
  )
}
