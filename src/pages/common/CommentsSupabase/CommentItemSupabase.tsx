import { useEffect, useMemo, useRef, useState } from 'react'
import { observer } from 'mobx-react'
import {
  ButtonShowReplies,
  CommentDisplay,
  ConfirmModal,
  EditComment,
  Modal,
} from 'oa-components'
import { UserRole } from 'oa-shared'
import { AuthWrapper, isUserAuthorized } from 'src/common/AuthWrapper'
import { FollowButtonAction } from 'src/common/FollowButtonAction'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { Card, Flex } from 'theme-ui'

import { CommentReply } from './CommentReplySupabase'
import { CreateCommentSupabase } from './CreateCommentSupabase'

import type { Comment, DiscussionContentTypes } from 'oa-shared'

export interface ICommentItemProps {
  comment: Comment
  onEdit: (id: number, comment: string) => void
  onDelete: (id: number) => void
  onReply: (reply: string) => void
  onEditReply: (id: number, reply: string) => void
  onDeleteReply: (id: number) => void
  sourceType: DiscussionContentTypes
}

export const CommentItemSupabase = observer((props: ICommentItemProps) => {
  const {
    comment,
    onEdit,
    onDelete,
    onReply,
    onEditReply,
    onDeleteReply,
    sourceType,
  } = props
  const commentRef = useRef<HTMLDivElement>()
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showReplies, setShowReplies] = useState(
    () => !!comment.replies?.some((x) => x.highlighted),
  )
  const {
    userStore: { activeUser },
  } = useCommonStores().stores

  const isEditable = useMemo(() => {
    return (
      activeUser?._id === comment.createdBy?.username ||
      activeUser?.userRoles?.includes(UserRole.ADMIN)
    )
  }, [activeUser])

  const item = 'CommentItem'
  const isBetaTester = isUserAuthorized(activeUser, UserRole.BETA_TESTER)

  useEffect(() => {
    if (comment.highlighted) {
      commentRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }, [comment.highlighted])

  return (
    <Flex
      id={`comment:${comment.id}`}
      data-cy={isEditable ? `OwnCommentItem` : 'CommentItem'}
      sx={{ flexDirection: 'column' }}
    >
      <Card
        sx={{ flexDirection: 'column', padding: 3, overflow: 'inherit' }}
        ref={commentRef as any}
        variant="borderless"
      >
        <CommentDisplay
          isEditable={isEditable}
          itemType={item}
          comment={comment}
          setShowDeleteModal={setShowDeleteModal}
          setShowEditModal={setShowEditModal}
          followButton={
            isBetaTester && (
              <AuthWrapper roleRequired={UserRole.BETA_TESTER}>
                <FollowButtonAction
                  contentType="comments"
                  iconFollow="discussionFollow"
                  iconUnfollow="discussionUnfollow"
                  item={comment}
                  labelFollow="Follow replies"
                  labelUnfollow="Unfollow replies"
                  sx={{ fontSize: 1 }}
                  variant="subtle"
                />
              </AuthWrapper>
            )
          }
          followButtonIcon={
            <AuthWrapper roleRequired={UserRole.BETA_TESTER}>
              <FollowButtonAction
                contentType="comments"
                item={comment}
                labelFollow="Follow replies"
                labelUnfollow="Unfollow replies"
                showIconOnly
                tooltipFollow="Follow new replies"
                tooltipUnfollow="Unfollow new replies"
                variant="subtle"
              />
            </AuthWrapper>
          }
        />

        <Flex
          sx={{
            alignItems: 'stretch',
            flexDirection: 'column',
            flex: 1,
            gap: 2,
            marginTop: 3,
          }}
        >
          {showReplies && (
            <>
              {comment.replies?.map((x) => (
                <CommentReply
                  key={x.id}
                  comment={x}
                  onEdit={(id: number, comment: string) =>
                    onEditReply(id, comment)
                  }
                  onDelete={(id: number) => onDeleteReply(id)}
                />
              ))}

              <CreateCommentSupabase
                onSubmit={(comment) => onReply(comment)}
                sourceType={sourceType}
                isReply
              />
            </>
          )}
          <ButtonShowReplies
            isShowReplies={showReplies}
            replies={(comment.replies || []) as any}
            setIsShowReplies={() => setShowReplies(!showReplies)}
          />
        </Flex>
      </Card>

      <Modal width={600} isOpen={showEditModal}>
        <EditComment
          comment={comment.comment}
          handleSubmit={async (commentText) => {
            onEdit(comment.id, commentText)
            setShowEditModal(false)
          }}
          handleCancel={() => setShowEditModal(false)}
          isReply={false}
        />
      </Modal>

      <ConfirmModal
        isOpen={showDeleteModal}
        message="Are you sure you want to delete this comment?"
        confirmButtonText="Delete"
        handleCancel={() => setShowDeleteModal(false)}
        handleConfirm={async () => {
          onDelete(comment.id)
          setShowDeleteModal(false)
        }}
      />
    </Flex>
  )
})
