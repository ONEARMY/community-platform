import { useEffect, useMemo, useRef, useState } from 'react'
import { observer } from 'mobx-react'
import {
  CommentDisplay,
  ConfirmModal,
  EditComment,
  Icon,
  Modal,
} from 'oa-components'
import { UserRole } from 'oa-shared'
import { useProfileStore } from 'src/stores/Profile/profile.store'
import { onUsefulClick } from 'src/utils/onUsefulClick'
import { Box, Flex, Text } from 'theme-ui'

import type { ContentType, Reply } from 'oa-shared'

const DELETED_COMMENT = 'The original comment got deleted'

export interface ICommentItemProps {
  comment: Reply
  onEdit: (id: number, comment: string) => void
  onDelete: (id: number) => void
}

export const CommentReply = observer(
  ({ comment, onEdit, onDelete }: ICommentItemProps) => {
    const commentRef = useRef<HTMLDivElement>()
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [usefulCount, setUsefulCount] = useState<number>(
      comment.voteCount ?? 0,
    )
    const [voted, setVoted] = useState<boolean>(false)

    const { profile: activeUser } = useProfileStore()

    const isEditable = useMemo(() => {
      return (
        activeUser?.username === comment.createdBy?.username ||
        activeUser?.roles?.includes(UserRole.ADMIN)
      )
    }, [activeUser, comment])

    useEffect(() => {
      setVoted(comment.hasVoted ?? false)
    }, [activeUser, comment])

    useEffect(() => {
      if (comment.highlighted) {
        commentRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      }
    }, [comment.highlighted])

    const item = 'ReplyItem'
    const loggedInUser = activeUser

    const configOnUsefulClick = {
      contentType: 'comment' as ContentType,
      contentId: comment.id,
      eventCategory: 'Comment',
      slug: `${comment}+${comment.id}`,
      setVoted,
      setUsefulCount,
      loggedInUser: loggedInUser,
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
      <Flex>
        <Box
          sx={{
            paddingTop: 1,
            paddingRight: 2,
          }}
        >
          <Icon glyph="reply-outline" />
        </Box>
        <Flex
          id={`comment:${comment.id}`}
          data-cy={isEditable ? `Own${item}` : item}
          sx={{ flexDirection: 'column', width: '100%' }}
        >
          <Flex sx={{ gap: 2 }} ref={commentRef as any}>
            {comment.deleted ? (
              <Box
                sx={{
                  marginBottom: 2,
                  border: `${comment.highlighted ? '2px dashed black' : 'none'}`,
                }}
                data-cy="deletedComment"
              >
                <Text sx={{ color: 'grey' }}>[{DELETED_COMMENT}]</Text>
              </Box>
            ) : (
              <CommentDisplay
                isEditable={isEditable}
                itemType={item}
                comment={comment}
                setShowDeleteModal={setShowDeleteModal}
                setShowEditModal={setShowEditModal}
                usefulButtonConfig={{
                  onUsefulClick: () =>
                    handleUsefulClick(voted ? 'delete' : 'add'),
                  hasUserVotedUseful: voted,
                  votedUsefulCount: usefulCount,
                  isLoggedIn: !!loggedInUser,
                }}
              />
            )}
          </Flex>

          <Modal width={600} isOpen={showEditModal}>
            <EditComment
              comment={comment.comment}
              handleSubmit={async (commentText) => {
                onEdit(comment.id, commentText)
                setShowEditModal(false)
              }}
              handleCancel={() => setShowEditModal(false)}
              isReply={true}
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
      </Flex>
    )
  },
)
