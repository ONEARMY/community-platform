import { createRef, useEffect, useState } from 'react'
import { Avatar, Box, Flex, Text } from 'theme-ui'

import defaultProfileImage from '../../assets/images/default_member.svg'
import { Button } from '../Button/Button'
import { ConfirmModal } from '../ConfirmModal/ConfirmModal'
import { DisplayDate } from '../DisplayDate/DisplayDate'
import { EditComment } from '../EditComment/EditComment'
import { LinkifyText } from '../LinkifyText/LinkifyText'
import { Modal } from '../Modal/Modal'
import { Username } from '../Username/Username'

import type { IComment } from './types'

const SHORT_COMMENT = 129
const DELETED_COMMENT = 'The original comment got deleted'

export interface IProps {
  comment: IComment
  handleDelete?: (commentId: string) => Promise<void>
  handleEdit: (commentId: string, newCommentText: string) => void
  handleEditRequest?: (commentId: string) => Promise<void>
  isReply: boolean
}

export const CommentItem = (props: IProps) => {
  const textRef = createRef<any>()
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [textHeight, setTextHeight] = useState(0)
  const [isShowMore, setShowMore] = useState(false)
  const { comment, handleDelete, handleEditRequest, handleEdit, isReply } =
    props
  const {
    text,
    creatorName,
    creatorCountry,
    creatorImage,
    isUserVerified,
    isUserSupporter,
    isEditable,
    _created,
    _edited,
    _id,
    _deleted,
  } = comment

  const user = {
    userName: creatorName,
    countryCode: creatorCountry,
    isVerified: !!isUserVerified,
    isSupporter: !!isUserSupporter,
  }

  const maxHeight = isShowMore ? 'max-content' : '128px'
  const item = isReply ? 'ReplyItem' : 'CommentItem'

  useEffect(() => {
    if (textRef.current) {
      setTextHeight(textRef.current.scrollHeight)
    }
  }, [textRef])

  const showMore = () => {
    setShowMore(!isShowMore)
  }

  const onEditRequest = (_id: string) => {
    if (handleEditRequest) {
      handleEditRequest(_id)
      return setShowEditModal(true)
    }
  }

  return (
    <Flex
      id={`comment:${_id}`}
      data-cy={isEditable ? `Own${item}` : item}
      sx={{ flexDirection: 'column' }}
    >
      <Flex sx={{ gap: 2 }}>
        {_deleted && (
          <Box sx={{ marginBottom: 2 }} data-cy="deletedComment">
            <Text sx={{ color: 'grey' }}>[{DELETED_COMMENT}]</Text>
          </Box>
        )}

        {!_deleted && (
          <Flex sx={{ gap: 2, flexGrow: 1 }}>
            <Box data-cy="commentAvatar" data-testid="commentAvatar">
              <Avatar
                data-cy="commentAvatarImage"
                src={creatorImage ?? defaultProfileImage}
                sx={{
                  objectFit: 'cover',
                  width: ['30px', '50px'],
                  height: ['30px', '50px'],
                }}
                alt={
                  creatorName
                    ? `Avatar of ${creatorName}`
                    : 'Avatar of comment author'
                }
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
                  <Username user={user} />
                  <Text sx={{ fontSize: 1, color: 'darkGrey' }}>
                    <DisplayDate
                      createdAt={_created || ''}
                      modifiedAt={_edited}
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
                      onClick={() => onEditRequest(_id)}
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
                <LinkifyText>{text}</LinkifyText>
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
          comment={text}
          handleSubmit={async (commentText) => {
            await handleEdit(_id, commentText)
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
          handleDelete && (await handleDelete(_id))
          setShowDeleteModal(false)
        }}
      />
    </Flex>
  )
}
