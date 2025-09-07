import { useState } from 'react'
import { Field, Form } from 'react-final-form'
import { Flex, Label } from 'theme-ui'
import { object, string } from 'yup'

import { Banner } from '../Banner/Banner'
import { Button } from '../Button/Button'
import { FieldTextarea } from '../FieldTextarea/FieldTextarea'

export interface IProps {
  comment: string
  handleCancel: () => void
  handleSubmit: (commentText: string) => Promise<Response>
  isReply: boolean
  setShowEditModal: any
}

export const EditComment = (props: IProps) => {
  const { comment, isReply, setShowEditModal } = props

  const [error, setError] = useState<string | undefined>(undefined)

  const validationSchema = object({
    comment: string().required('Make sure this field is filled correctly'),
  })

  const required = (value: string) =>
    value?.trim() ? undefined : 'Comment cannot be blank'

  const handleFormSubmit = async (comment: string) => {
    if (!comment?.trim()) {
      return
    }

    const response = await props.handleSubmit(comment)

    if (response.ok) {
      setShowEditModal(false)
    } else {
      setError(response.statusText)
    }
  }

  const validateEditedComment = async (values: any) => {
    try {
      await validationSchema.validate(values, { abortEarly: false })
    } catch (err: any) {
      return err.inner.reduce(
        (acc: any, error: any) => ({
          ...acc,
          [error.path]: error.message,
        }),
        {},
      )
    }
  }

  return (
    <Form
      onSubmit={() => {
        // do nothing
      }}
      initialValues={{
        comment,
      }}
      validate={validateEditedComment}
      data-cy="EditCommentForm"
      render={({ invalid, handleSubmit, values }) => {
        const disabled = invalid

        return (
          <Flex
            as="form"
            sx={{
              flexDirection: 'column',
              padding: 2,
              gap: 2,
            }}
            onSubmit={handleSubmit}
          >
            <Label
              as="label"
              htmlFor="comment"
              sx={{ marginBottom: '6px', fontSize: 3 }}
            >
              Edit {isReply ? 'Reply' : 'Comment'}
            </Label>

            {error && <Banner variant="failure">{error}</Banner>}

            <Field
              component={FieldTextarea}
              data-cy="edit-comment"
              id="comment"
              validate={required}
              name="comment"
              rows={2}
              sx={{ padding: 1 }}
            />
            <Flex mt={4} ml="auto">
              <Button
                type="button"
                small
                mr={4}
                variant="secondary"
                onClick={() => props?.handleCancel()}
              >
                Cancel
              </Button>
              <Button
                data-cy="edit-comment-submit"
                data-testid="edit-comment-submit"
                type="submit"
                aria-label="Save changes"
                small
                disabled={disabled}
                onClick={() => {
                  handleFormSubmit(values.comment)
                }}
              >
                Save
              </Button>
            </Flex>
          </Flex>
        )
      }}
    />
  )
}
