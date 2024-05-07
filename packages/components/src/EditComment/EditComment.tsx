import { Field, Form } from 'react-final-form'
import { Flex, Label } from 'theme-ui'
import { object, string } from 'yup'

import { Button } from '../Button/Button'
import { FieldTextarea } from '../FieldTextarea/FieldTextarea'

export interface IProps {
  comment: string
  handleCancel: () => void
  handleSubmit: (commentText: string) => void
  isReply: boolean
}

export const EditComment = (props: IProps) => {
  const { comment, isReply } = props

  const validationSchema = object({
    comment: string().required('Make sure this field is filled correctly'),
  })

  const required = (value: string) =>
    value && value.trim() ? undefined : 'Comment cannot be blank'

  const handleFormSubmit = (comment: string) => {
    if (comment.trim()) {
      props?.handleSubmit(comment)
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
      validate={async (values: any) => {
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
      }}
      render={({ invalid, handleSubmit, values }) => {
        const disabled = invalid
        return (
          <Flex
            as="form"
            sx={{
              flexDirection: 'column',
            }}
            p={2}
            onSubmit={handleSubmit}
          >
            <Label
              as="label"
              htmlFor="comment"
              sx={{ marginBottom: '6px', fontSize: 3 }}
            >
              Edit {isReply ? 'Reply' : 'Comment'}
            </Label>
            <Field
              component={FieldTextarea}
              data-cy="edit-comment"
              id="comment"
              validate={required}
              name="comment"
            />
            <Flex mt={4} ml="auto">
              <Button
                small
                mr={4}
                variant="secondary"
                onClick={() => props?.handleCancel()}
              >
                Cancel
              </Button>
              <Button
                data-cy="edit-comment-submit"
                type={'submit'}
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
