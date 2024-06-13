import { createRef, useEffect, useState } from 'react'
import { Avatar, Box, Flex, Text } from 'theme-ui'

import { Button } from '../Button/Button'
import { ConfirmModal } from '../ConfirmModal/ConfirmModal'
import { EditComment } from '../EditComment/EditComment'
import { LinkifyText } from '../LinkifyText/LinkifyText'
import { Modal } from '../Modal/Modal'
import { Username } from '../Username/Username'

import type { IComment } from './types'

const SHORT_COMMENT = 129

export interface IProps {
  comment: IComment
  handleDelete?: (commentId: string) => Promise<void>
  handleEdit?: (commentId: string, newCommentText: string) => void
  handleEditRequest?: (commentId: string) => Promise<void>
  isReply: boolean
  showAvatar: boolean
}

const formatDate = (d: string | undefined): string => {
  if (!d) {
    return ''
  }
  return new Date(d).toLocaleDateString('en-GB').replace(/\//g, '-')
}

export const CommentItem = (props: IProps) => {
  const textRef = createRef<any>()
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [textHeight, setTextHeight] = useState(0)
  const [isShowMore, setShowMore] = useState(false)
  const {
    comment,
    handleDelete,
    handleEditRequest,
    handleEdit,
    isReply,
    showAvatar,
  } = props
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
  } = comment

  const user = {
    userName: creatorName,
    countryCode: creatorCountry,
    isVerified: !!isUserVerified,
    isSupporter: !!isUserSupporter,
  }

  const date = formatDate(_edited || _created)
  const maxHeight = isShowMore ? 'max-content' : '128px'

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
      data-cy="comment"
      sx={{ flexDirection: 'column' }}
    >
      <Flex sx={{ gap: 2 }}>
        {creatorImage && showAvatar && (
          <Box data-cy="commentAvatar" data-testid="commentAvatar">
            <Avatar
              src={creatorImage}
              sx={{
                objectFit: 'cover',
                width: ['30px', '50px'],
                height: ['30px', '50px'],
              }}
            />
          </Box>
        )}

        <Flex
          sx={{
            flexDirection: 'column',
            flex: 1,
          }}
        >
          <Flex
            sx={{
              alignItems: 'stretch',
              flexWrap: 'wrap',
              justifyContent: 'flex-start',
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
              {_edited && (
                <Text sx={{ fontSize: 0, color: 'grey' }}>(Edited)</Text>
              )}
              <Text sx={{ fontSize: 1 }}>{date}</Text>
            </Flex>

            {isEditable && (
              <Flex
                sx={{
                  flexGrow: 1,
                  gap: 2,
                  justifyContent: ['flex-start', 'flex-end'],
                  opacity: 0.5,
                  ':hover': { opacity: 1 },
                }}
              >
                <Button
                  data-cy="CommentItem: edit button"
                  variant="outline"
                  small={true}
                  icon="edit"
                  onClick={() => onEditRequest(_id)}
                >
                  edit
                </Button>
                <Button
                  data-cy="CommentItem: delete button"
                  variant={'outline'}
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
            sx={{
              fontFamily: 'body',
              lineHeight: 1.3,
              maxHeight,
              overflow: 'hidden',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              marginY: 2,
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

      <Modal width={600} isOpen={showEditModal}>
        <EditComment
          comment={text}
          handleSubmit={(commentText) => {
            handleEdit && handleEdit(_id, commentText)
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
        handleConfirm={() => {
          handleDelete && handleDelete(_id)
          setShowDeleteModal(false)
        }}
      />
    </Flex>
  )
}
