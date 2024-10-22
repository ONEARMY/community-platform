import { useEffect, useState } from 'react'
import { Box, Flex } from 'theme-ui'

import { Button } from '../Button/Button'
import { ButtonShowReplies } from '../ButtonShowReplies/ButtonShowReplies'
import { CommentItem } from '../CommentItem/CommentItem'
import { CreateReply } from '../CreateReply/CreateReply'
import { nonDeletedCommentsCount } from '../DiscussionTitle/DiscussionTitle'
import { Icon } from '../Icon/Icon'

import type { IComment } from '../CommentItem/types'

const MAX_COMMENTS = 10

interface IPropsShared {
  handleDelete: (_id: string) => Promise<void>
  handleEdit: (_id: string, comment: string) => Promise<void>
  handleEditRequest: () => Promise<void>
  isLoggedIn: boolean
  isReplies: boolean
  maxLength: number
  onSubmitReply?: (_id: string, reply: string) => Promise<void>
}

export interface IPropsCommentContainer extends IPropsShared {
  comment: IComment
  handleCommentReply?: (commentId: string | null) => void
  supportReplies: boolean
}

export interface IPropsCommentList extends IPropsShared {
  supportReplies?: boolean
  comments: IComment[]
  highlightedCommentId?: string
  onMoreComments?: () => void
  setCommentBeingRepliedTo?: (commentId: string | null) => void
}

export const CommentContainer = (props: IPropsCommentContainer) => {
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
  const { _id, _deleted, replies } = comment

  const replyArrow = () => {
    return (
      <Box
        sx={{
          paddingTop: 1,
          paddingRight: 2,
        }}
      >
        <Icon glyph="arrow-curved-bottom-right" />
      </Box>
    )
  }

  const repliesButton = () => {
    return (
      <ButtonShowReplies
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

  if (_deleted && (!replies || nonDeletedCommentsCount(replies) === 0)) {
    return null
  }

  return (
    <Box
      sx={{
        backgroundColor: 'white',
        borderRadius: 1,
        padding: isReplies ? 0 : 2,
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

            {!_deleted && createReply()}

            {repliesButton()}
          </Flex>
        </Flex>
      ) : null}
    </Box>
  )
}

export const CommentList = (props: IPropsCommentList) => {
  const {
    comments,
    handleDelete,
    handleEdit,
    handleEditRequest,
    highlightedCommentId,
    isLoggedIn,
    isReplies,
    maxLength,
    onMoreComments,
    onSubmitReply,
    supportReplies = false,
  } = props

  const [moreComments, setMoreComments] = useState(1)
  const shownComments = moreComments * MAX_COMMENTS

  const scrollIntoRelevantComment = (commentId: string) => {
    setTimeout(() => {
      // the delay is needed, otherwise the scroll is not happening in Firefox
      document
        .getElementById(`comment:${commentId}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 0)
  }

  const handleMoreComments = () => {
    onMoreComments && onMoreComments()
    setMoreComments(moreComments + 1)
  }

  useEffect(() => {
    if (!highlightedCommentId) return

    const i = comments.findIndex((comment) =>
      highlightedCommentId.includes(comment._id),
    )
    if (i >= 0) {
      setMoreComments(Math.floor(i / MAX_COMMENTS) + 1)
      scrollIntoRelevantComment(highlightedCommentId)
    }
  }, [highlightedCommentId, comments])

  return (
    <Flex
      sx={{
        gap: 2,
        flexDirection: 'column',
      }}
    >
      {comments &&
        comments.slice(0, shownComments).map((comment) => (
          <Box
            key={comment._id}
            data-testid="CommentList: item"
            sx={{
              border: `${
                highlightedCommentId === comment._id
                  ? '2px dashed black'
                  : 'none'
              }`,
              borderRadius: 1,
            }}
          >
            <CommentContainer
              comment={comment}
              handleEditRequest={handleEditRequest}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
              isLoggedIn={isLoggedIn}
              isReplies={isReplies}
              maxLength={maxLength}
              onSubmitReply={onSubmitReply}
              supportReplies={supportReplies}
            />
          </Box>
        ))}

      {comments && comments.length > shownComments && (
        <Flex>
          <Button
            type="button"
            sx={{ margin: '0 auto' }}
            variant="outline"
            onClick={handleMoreComments}
          >
            show more comments
          </Button>
        </Flex>
      )}
    </Flex>
  )
}
