import React, { createRef, useEffect, useState } from 'react'
import { Box, Flex } from 'rebass'
import { IComment } from 'src/models'
import { CommentHeader } from './CommentHeader'
import { Text } from 'src/components/Text'
import { Modal } from '../Modal/Modal'
import { Button } from 'oa-components'
import { AuthWrapper } from '../Auth/AuthWrapper'
import FormEditComment from '../FormEditComment/FormEditComment'

export interface IProps extends IComment {
  handleEditRequest
  handleDelete
  handleEdit
}

export const Comment: React.FC<IProps> = ({
  _creatorId,
  text,
  _id,
  handleEditRequest,
  handleDelete,
  handleEdit,
  ...props
}) => {
  const textRef = createRef<any>()
  const [showEditModal, setShowEditModal] = useState(false)
  const [textHeight, setTextHeight] = useState(0)
  const [isShowMore, setShowMore] = useState(false)

  const onEditRequest = () => {
    handleEditRequest()
    return setShowEditModal(true)
  }

  const onDelete = () => {
    handleDelete(_id)
  }

  useEffect(() => {
    if (textRef.current) {
      setTextHeight(textRef.current.scrollHeight)
    }
  }, [])

  const showMore = () => {
    setShowMore(!isShowMore)
  }

  return (
    <Box>
      <Flex
        flexDirection="column"
        p="3"
        bg={'white'}
        width="100%"
        mb={4}
        style={{ borderRadius: '5px' }}
      >
        <CommentHeader {...props} />
        <Text
          my={2}
          style={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            overflow: 'hidden',
            lineHeight: '1em',
            maxHeight: isShowMore ? 'max-content' : '10em',
          }}
          ref={textRef}
        >
          {text}
        </Text>
        {textHeight > 160 && (
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
        <Flex ml="auto">
          <AuthWrapper roleRequired="admin" additionalAdmins={[_creatorId]}>
            <Button
              variant={'outline'}
              small={true}
              icon={'edit'}
              onClick={onEditRequest}
            >
              edit
            </Button>
            <Button
              variant={'outline'}
              small={true}
              icon="delete"
              onClick={onDelete}
              ml={2}
            >
              delete
            </Button>
          </AuthWrapper>
        </Flex>

        {showEditModal && (
          <Modal width={600}>
            <FormEditComment
              comment={text}
              handleSubmit={commentText => {
                handleEdit(_id, commentText)
                setShowEditModal(false)
              }}
              handleCancel={() => setShowEditModal(false)}
            />
          </Modal>
        )}
      </Flex>
    </Box>
  )
}
