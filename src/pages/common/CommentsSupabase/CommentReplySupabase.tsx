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
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { Box, Flex, Text } from 'theme-ui'

import type { Reply } from 'oa-shared'

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

    const { userStore } = useCommonStores().stores
    const { activeUser } = userStore

    const isEditable = useMemo(() => {
      return (
        activeUser?._authID === comment.createdBy?.firebaseAuthId ||
        activeUser?._id === comment.createdBy?.username ||
        activeUser?.userRoles?.includes(UserRole.ADMIN) ||
        activeUser?.userRoles?.includes(UserRole.SUPER_ADMIN)
      )
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

    return (
      <Flex>
        <Box
          sx={{
            paddingTop: 1,
            paddingRight: 2,
          }}
        >
          <Icon glyph="arrow-curved-bottom-right" />
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
