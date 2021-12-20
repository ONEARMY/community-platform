import React, { useState } from 'react'
import { FaTrash, FaRegEdit } from 'react-icons/fa'
import { Flex } from 'rebass/styled-components'
import { useCommonStores } from 'src/index'
import { IComment } from 'src/models'
import { CommentHeader } from './CommentHeader'
import { Text } from 'src/components/Text'
import { Modal } from '../Modal/Modal'
import { TextAreaField } from '../Form/Fields'
import { Field, Form } from 'react-final-form'
import { Button } from 'src/components/Button'
import { AuthWrapper } from '../Auth/AuthWrapper'
import { logger } from 'src/logger'

export interface IProps extends IComment {}

export const Comment: React.FC<IProps> = ({
  _creatorId,
  text,
  _id,
  ...props
}) => {
  const { stores } = useCommonStores()
  const [showEditModal, setShowEditModal] = useState(false)

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
      <Text my={2} style={{ whiteSpace: 'pre-wrap' }}>
        {text}
      </Text>

      <Flex ml="auto">
        <AuthWrapper roleRequired="admin" additionalAdmins={[_creatorId]}>
          <Text
            style={{
              cursor: 'pointer',
            }}
            mr={2}
            fontSize="12px"
            onClick={async () => setShowEditModal(true)}
          >
            edit <FaRegEdit />
          </Text>
          <Text
            style={{
              cursor: 'pointer',
              alignItems: 'center',
            }}
            fontSize="12px"
            onClick={async () => {
              const confirmation = window.confirm(
                'Are you sure you want to delete this comment?',
              )
              if (confirmation) {
                await stores.howtoStore.deleteComment(_id)
              }
            }}
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
                    onClick={async () => {
                      await stores.howtoStore.editComment(_id, values.comment)
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
