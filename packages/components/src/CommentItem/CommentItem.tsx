import { createRef, useEffect, useState } from 'react'
import { Flex, Text } from 'theme-ui'
import { Button } from '../Button/Button'
import { ConfirmModal } from '../ConfirmModal/ConfirmModal'
import { EditComment } from '../EditComment/EditComment'
import { LinkifyText } from '../LinkifyText/LinkifyText'
import { Modal } from '../Modal/Modal'
import { Username } from '../Username/Username'

export interface CommentItemProps {
  text: string
  isUserVerified?: boolean
  isEditable: boolean
  isPadding?: boolean
  creatorCountry?: string | null
  creatorName: string
  _id: string
  _edited?: string
  _created?: string
  handleEdit?: (commentId: string, newCommentText: string) => void
  handleDelete?: (commentId: string) => Promise<void>
  handleEditRequest?: (commentId: string) => Promise<void>
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
  const {
    creatorCountry,
    creatorName,
    isUserVerified,
    _id,
    _edited,
    _created,
    text,
    handleEditRequest,
    handleDelete,
    handleEdit,
    isEditable,
  } = props

  useEffect(() => {
    if (textRef.current) {
      setTextHeight(textRef.current.scrollHeight)
    }
  }, [text])

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
      sx={{
        alignItems: 'stretch',
        flexDirection: 'row',
      }}
    >
      <Flex
        bg={'white'}
        sx={{
          width: '100%',
          flexDirection: 'column',
          borderRadius: '5px',
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
              }}
              isVerified={!!isUserVerified}
            />
            {_edited && (
              <Text sx={{ fontSize: 0, color: 'grey' }}>(Edited)</Text>
            )}
            <Text sx={{ fontSize: 1 }}>{formatDate(_edited || _created)}</Text>
          </Flex>

          {isEditable && (
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
              <Button
                data-cy="CommentItem: edit button"
                variant="outline"
                small
                icon="edit"
                onClick={() => onEditRequest(_id)}
              >
                edit
              </Button>
              <Button
                data-cy="CommentItem: delete button"
                variant="outline"
                small
                icon="delete"
                onClick={() => setShowDeleteModal(true)}
              >
                delete
              </Button>
            </Flex>
          )}
        </Flex>
        <Flex
          sx={{
            alignItems: 'stretch',
            flexDirection: 'row',
          }}
        >
          <Text
            data-cy="comment-text"
            mt={2}
            mb={2}
            sx={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              overflow: 'hidden',
              maxHeight: isShowMore ? 'max-content' : '128px',
              fontFamily: 'body',
              lineHeight: 1.3,
            }}
            ref={textRef}
          >
            <LinkifyText>{text}</LinkifyText>
          </Text>
          {textHeight > 129 && (
            <a
              onClick={showMore}
              style={{
                color: 'gray',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            >
              {isShowMore ? 'Show less' : 'Show more'}
            </a>
          )}
        </Flex>

        <Modal width={600} isOpen={showEditModal}>
          <EditComment
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
          handleConfirm={() => handleDelete && handleDelete(_id)}
        />
      </Flex>
    </Flex>
  )
}
