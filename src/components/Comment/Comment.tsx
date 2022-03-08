import React, { createRef, useEffect, useState } from 'react'
import { FaTrash, FaRegEdit } from 'react-icons/fa'
import { Flex } from 'rebass/styled-components'
import { IComment } from 'src/models'
import { CommentHeader } from './CommentHeader'
import { Text } from 'src/components/Text'
import { Modal } from '../Modal/Modal'
import { TextAreaField } from '../Form/Fields'
import { Field, Form } from 'react-final-form'
import { Button } from 'src/components/Button'
import { AuthWrapper } from '../Auth/AuthWrapper'
import { logger } from 'src/logger'

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
  const textRef = createRef<any>();
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
    setShowMore(!isShowMore);
  }

  return (
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
          overflow: "hidden",
          lineHeight: "1em",
          maxHeight: isShowMore ? "max-content" : "10em",
        }}
        ref={textRef}
      >
        {text}
      </Text>
      {textHeight > 160 &&
          <a 
            onClick={showMore}
            style={{
              color: "gray",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            {isShowMore ? 'Show less' : 'Show more'}
          </a>
      }
      <Flex ml="auto">
        <AuthWrapper roleRequired="admin" additionalAdmins={[_creatorId]}>
          <Text
            style={{
              cursor: 'pointer',
            }}
            mr={2}
            fontSize="12px"
            onClick={onEditRequest}
          >
            edit <FaRegEdit />
          </Text>
          <Text
            style={{
              cursor: 'pointer',
              alignItems: 'center',
            }}
            fontSize="12px"
            onClick={onDelete}
          >
            delete <FaTrash color="red" />
          </Text>
        </AuthWrapper>
      </Flex>

      {showEditModal && (
        <Modal width={600}>
          <Form
            onSubmit={values => {
              logger.debug(values)
            }}
            initialValues={{
              comment: text,
            }}
            render={({ handleSubmit, values }) => (
              <Flex
                as="form"
                flexDirection="column"
                p={2}
                onSubmit={handleSubmit}
              >
                <Text
                  as="label"
                  large
                  htmlFor="comment"
                  style={{ marginBottom: '6px' }}
                >
                  Edit comment
                </Text>
                <Field name="comment" id="comment" component={TextAreaField} />
                <Flex mt={4} ml="auto">
                  <Button
                    small
                    mr={4}
                    variant="secondary"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    small
                    onClick={() => {
                      handleEdit(_id, values.comment)
                      setShowEditModal(false)
                    }}
                  >
                    Edit
                  </Button>
                </Flex>
              </Flex>
            )}
          />
        </Modal>
      )}
    </Flex>
  )
}
