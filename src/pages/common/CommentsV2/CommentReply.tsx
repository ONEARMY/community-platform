import { createRef, useEffect, useMemo, useState } from 'react'
import { compareDesc } from 'date-fns'
import { observer } from 'mobx-react'
import {
  Button,
  CommentAvatar,
  ConfirmModal,
  DisplayDate,
  EditComment,
  Icon,
  LinkifyText,
  Modal,
  Username,
} from 'oa-components'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { Box, Flex, Text } from 'theme-ui'

import type { Reply } from 'src/models/comment.model'

const SHORT_COMMENT = 129
const DELETED_COMMENT = 'The original comment got deleted'

export interface ICommentItemProps {
  comment: Reply
  onEdit: (id: number, comment: string) => void
  onDelete: (id: number) => void
}

export const CommentReply = observer(
  ({ comment, onEdit, onDelete }: ICommentItemProps) => {
    const textRef = createRef<any>()
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [textHeight, setTextHeight] = useState(0)
    const [isShowMore, setShowMore] = useState(false)
    const { userStore } = useCommonStores().stores

    const maxHeight = isShowMore ? 'max-content' : '128px'
    const isReply = !!comment.parentId
    const item = isReply ? 'ReplyItem' : 'CommentItem'
    const isEditable = useMemo(() => {
      if (!userStore.activeUser?._authID) {
        return false
      }

      return userStore.activeUser?._authID === comment.createdBy?.firebaseAuthId
    }, [userStore.activeUser?._authID, comment.createdBy?.firebaseAuthId])

    useEffect(() => {
      if (textRef.current) {
        setTextHeight(textRef.current.scrollHeight)
      }
    }, [textRef])

    const showMore = () => {
      setShowMore(!isShowMore)
    }

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
          <Flex sx={{ gap: 2 }}>
            {comment.deleted && (
              <Box sx={{ marginBottom: 2 }} data-cy="deletedComment">
                <Text sx={{ color: 'grey' }}>[{DELETED_COMMENT}]</Text>
              </Box>
            )}

            {!comment.deleted && (
              <Flex sx={{ gap: 2, flexGrow: 1 }}>
                <Box data-cy="commentAvatar" data-testid="commentAvatar">
                  <CommentAvatar
                    name={comment.createdBy?.name}
                    photoUrl={comment.createdBy?.photoUrl}
                  />
                </Box>

                <Flex
                  sx={{
                    flexDirection: 'column',
                    flex: 1,
                  }}
                >
                  <Flex
                    sx={{
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      flexDirection: ['column', 'row'],
                      gap: 2,
                    }}
                  >
                    <Flex
                      sx={{
                        alignItems: 'baseline',
                        gap: 2,
                        flexDirection: 'row',
                      }}
                    >
                      <Username
                        user={{
                          userName: comment.createdBy?.name || '',
                          countryCode: comment.createdBy?.country,
                          isVerified: comment.createdBy?.isVerified,
                          // TODO: isSupporter
                        }}
                      />
                      <Text sx={{ fontSize: 1, color: 'darkGrey' }}>
                        {comment.modifiedAt &&
                          compareDesc(comment.createdAt, comment.modifiedAt) >
                            0 &&
                          'Edited '}
                        <DisplayDate
                          date={comment.modifiedAt || comment.createdAt}
                        />
                      </Text>
                    </Flex>

                    {isEditable && (
                      <Flex
                        sx={{
                          alignItems: 'flex-end',
                          gap: 2,
                          paddingBottom: 2,
                        }}
                      >
                        <Button
                          type="button"
                          data-cy={`${item}: edit button`}
                          variant="subtle"
                          small={true}
                          icon="edit"
                          onClick={() => setShowEditModal(true)}
                        >
                          edit
                        </Button>
                        <Button
                          type="button"
                          data-cy={`${item}: delete button`}
                          variant="subtle"
                          small={true}
                          icon="delete"
                          onClick={() => setShowDeleteModal(true)}
                        >
                          delete
                        </Button>
                      </Flex>
                    )}
                  </Flex>
                  <Text
                    data-cy="comment-text"
                    data-testid="commentText"
                    sx={{
                      fontFamily: 'body',
                      lineHeight: 1.3,
                      maxHeight,
                      overflow: 'hidden',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      marginTop: 1,
                      marginBottom: 2,
                    }}
                    ref={textRef}
                  >
                    <LinkifyText>{comment.comment}</LinkifyText>
                  </Text>
                  {textHeight > SHORT_COMMENT && (
                    <a
                      onClick={showMore}
                      style={{
                        color: 'gray',
                        cursor: 'pointer',
                      }}
                    >
                      {isShowMore ? 'Show less' : 'Show more'}
                    </a>
                  )}
                </Flex>
              </Flex>
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
              isReply={isReply}
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
