import { createRef, useEffect, useState } from 'react'
import { Box, Flex, Text } from 'theme-ui'
import { Button } from '../Button/Button'
import { ConfirmModal } from '../ConfirmModal/ConfirmModal'
import { EditComment } from '../EditComment/EditComment'
import { LinkifyText } from '../LinkifyText/LinkifyText'
import { Modal } from '../Modal/Modal'
import { Username } from '../Username/Username'
import { CreateComment } from '../CreateComment/CreateComment'

export interface CommentItemProps {
  text: string
  isUserVerified?: boolean
  isEditable: boolean
  creatorCountry?: string | null
  creatorName: string
  _id: string
  _edited?: string
  _created?: string
  replies?: any[]
  handleEdit?: (commentId: string, newCommentText: string) => Promise<void>
  handleDelete?: (commentId: string) => Promise<void>
  handleEditRequest?: (commentId: string) => Promise<void>
  handleReply?: (commentId: string, replyComment: string) => Promise<void>
  handleShowReplies?: () => void
  isLoggedIn?: boolean
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
  const [isShowReplies, setShowReplies] = useState(false)
  const [replyToComment, setToReply] = useState(false)
  const [replyComment, setReplyComment] = useState('')
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
    handleReply,
    isEditable,
    isLoggedIn,
    replies,
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

  const openReply = () => {
    setToReply(!replyToComment)
    setShowReplies(true)
  }

  const secondaryBtnStyle = {
    color: 'gray',
    cursor: 'pointer',
    fontSize: '14px',
  }

  const onSubmitReply = async (comment: string) => {
    if (handleReply) handleReply(_id, comment)
    setReplyComment('')
  }

  return (
    <>
      <Box id={`comment:${_id}`} data-cy="comment">
        <Flex
          p="3"
          bg={'white'}
          sx={{
            width: '100%',
            flexDirection: 'column',
            borderRadius: '5px',
          }}
        >
          <Flex
            sx={{ justifyContent: 'space-between', alignItems: 'baseline' }}
          >
            <Username
              user={{
                userName: creatorName,
                countryCode: creatorCountry,
              }}
              isVerified={!!isUserVerified}
            />
            <Flex sx={{ alignItems: 'center' }}>
              <>
                {_edited && (
                  <Text sx={{ fontSize: 0, color: 'grey' }} mr={2}>
                    (Edited)
                  </Text>
                )}
                <Text sx={{ fontSize: 1 }}>
                  {formatDate(_edited || _created)}
                </Text>
              </>
            </Flex>
          </Flex>
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
          <Flex mb={3}>
            {textHeight > 129 && (
              <a onClick={showMore} style={{ ...secondaryBtnStyle }}>
                {isShowMore ? 'Show less' : 'Show more'}
              </a>
            )}
            {replies && replies.length > 0 && (
              <a
                onClick={() =>
                  props.handleShowReplies && props.handleShowReplies()
                }
                style={
                  textHeight > 129
                    ? {
                        ...secondaryBtnStyle,
                        marginLeft: '10px',
                      }
                    : { ...secondaryBtnStyle }
                }
              >
                {replies.length === 1 ? '1 reply' : `${replies.length} replies`}
              </a>
            )}
            {handleReply && (
              <a
                onClick={openReply}
                style={{
                  ...secondaryBtnStyle,
                  marginLeft: 'auto',
                }}
              >
                reply
              </a>
            )}
          </Flex>
          <Flex ml="auto">
            {isEditable && (
              <>
                <Button
                  data-cy="CommentItem: edit button"
                  variant={'outline'}
                  small={true}
                  icon={'edit'}
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
                  ml={2}
                >
                  delete
                </Button>
              </>
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
      </Box>
      {replyToComment && handleReply && (
        <Box mb={3} ml={6}>
          <CreateComment
            maxLength={3000}
            comment={replyComment}
            onChange={setReplyComment}
            onSubmit={onSubmitReply}
            isLoggedIn={!!isLoggedIn}
            isReply={true}
          />
        </Box>
      )}
    </>
  )
}
