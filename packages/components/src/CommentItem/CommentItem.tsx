import { createRef, useEffect, useState } from 'react'
import { Box, Flex, Text } from 'theme-ui'

import { Button } from '../Button/Button'
import { ConfirmModal } from '../ConfirmModal/ConfirmModal'
import { EditComment } from '../EditComment/EditComment'
import { LinkifyText } from '../LinkifyText/LinkifyText'
import { Modal } from '../Modal/Modal'
import { Username } from '../Username/Username'

import type { IComment } from './types'

const SHORT_COMMENT = 129

export interface CommentItemProps {
  comment: IComment
  handleDelete?: (commentId: string) => Promise<void>
  handleEdit?: (commentId: string, newCommentText: string) => void
  handleEditRequest?: (commentId: string) => Promise<void>
  isReply: boolean
}

const formatDate = (d: string | undefined): string => {
  if (!d) {
    return ''
  }
  return new Date(d).toLocaleDateString('en-GB').replace(/\//g, '-')
}

export const CommentItem = (props: CommentItemProps) => {
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
    isUserVerified,
    isUserSupporter,
    isEditable,
    _created,
    _edited,
    _id,
  } = comment

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
    <Box id={`comment:${_id}`} data-cy="comment">
      <Flex
        sx={{
          flexDirection: 'column',
        }}
      >
        <Flex
          sx={{
            alignItems: 'stretch',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
          }}
        >
          <Flex sx={{ alignItems: 'baseline', gap: 2 }}>
            <Username
              user={{
                userName: creatorName,
                countryCode: creatorCountry,
                isVerified: !!isUserVerified,
                isSupporter: !!isUserSupporter,
              }}
            />
            {_edited && (
              <Text sx={{ fontSize: 0, color: 'grey' }}>(Edited)</Text>
            )}
            <Text sx={{ fontSize: 1 }}>{date}</Text>
          </Flex>

          <Flex
            sx={{
              flexGrow: 1,
              gap: 2,
              justifyContent: ['flex-start', 'flex-start', 'flex-end'],
              opacity: 0.5,
              width: ['100%', 'auto'],
              ':hover': { opacity: 1 },
            }}
          >
            {isEditable && (
              <>
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
              </>
            )}
          </Flex>
        </Flex>
        <Text
          data-cy="comment-text"
          mt={2}
          mb={2}
          sx={{
            fontFamily: 'body',
            lineHeight: 1.3,
            maxHeight,
            overflow: 'hidden',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
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
              fontSize: '14px',
            }}
          >
            {isShowMore ? 'Show less' : 'Show more'}
          </a>
        )}

        <Modal width={600} isOpen={showEditModal}>
          <EditComment
            isReply={isReply}
            comment={text}
            handleSubmit={(commentText) => {
              handleEdit && handleEdit(_id, commentText)
              setShowEditModal(false)
            }}
            handleCancel={() => setShowEditModal(false)}
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
    </Box>
  )
}
