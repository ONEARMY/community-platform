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
import { FollowButtonAction } from 'src/common/FollowButtonAction'
import { useProfileStore } from 'src/stores/Profile/profile.store'
import { onUsefulClick } from 'src/utils/onUsefulClick'
import { Card, Flex } from 'theme-ui'

import { CommentReply } from './CommentReplySupabase'
import { CreateCommentSupabase } from './CreateCommentSupabase'

import type { Comment, ContentType, DiscussionContentTypes } from 'oa-shared'

export interface ICommentItemProps {
  comment: Comment
  onEdit: (id: number, comment: string) => Promise<Response>
  onDelete: (id: number) => void
  onReply: (reply: string) => void
  onEditReply: (id: number, reply: string) => Promise<Response>
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
  const { profile } = useProfileStore()
  const [usefulCount, setUsefulCount] = useState<number>(comment.voteCount ?? 0)
  const [voted, setVoted] = useState<boolean>(false)

  const isEditable = useMemo(() => {
    return (
      profile?.username === comment.createdBy?.username ||
      profile?.roles?.includes(UserRole.ADMIN)
    )
  }, [profile])

  const item = 'CommentItem'

  useEffect(() => {
    setVoted(comment.hasVoted ?? false)
  }, [profile, comment])

  useEffect(() => {
    if (comment.highlighted) {
      commentRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }, [comment.highlighted])

  const configOnUsefulClick = {
    contentType: 'comment' as ContentType,
    contentId: comment.id,
    eventCategory: 'Comment',
    slug: `${comment}+${comment.id}`,
    setVoted,
    setUsefulCount,
    loggedInUser: profile,
  }

  const handleUsefulClick = async (
    vote: 'add' | 'delete',
    eventCategory = 'Comment',
  ) => {
    await onUsefulClick({
      vote,
      config: { ...configOnUsefulClick, eventCategory },
    })
  }

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
            <FollowButtonAction
              contentType="comments"
              iconFollow="discussionFollow"
              iconUnfollow="discussionUnfollow"
              itemId={comment.id}
              labelFollow="Follow replies"
              labelUnfollow="Unfollow replies"
              sx={{ fontSize: 1 }}
              variant="subtle"
            />
          }
          followButtonIcon={
            <FollowButtonAction
              contentType="comments"
              itemId={comment.id}
              labelFollow="Follow replies"
              labelUnfollow="Unfollow replies"
              showIconOnly
              tooltipFollow="Follow replies"
              tooltipUnfollow="Unfollow replies"
              variant="subtle"
              hideSubscribeIcon
            />
          }
          usefulButtonConfig={{
            onUsefulClick: () => handleUsefulClick(voted ? 'delete' : 'add'),
            hasUserVotedUseful: voted,
            votedUsefulCount: usefulCount,
            isLoggedIn: !!profile,
          }}
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
                  onEdit={async (id: number, comment: string) => {
                    return await onEditReply(id, comment)
                  }}
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
            return await onEdit(comment.id, commentText)
          }}
          setShowEditModal={setShowEditModal}
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
