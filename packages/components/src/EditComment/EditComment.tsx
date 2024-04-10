import { Field, Form } from 'react-final-form'
import { Flex, Label } from 'theme-ui'

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
  return (
    <Form
      onSubmit={() => {
        // do nothing
      }}
      initialValues={{
        comment,
      }}
      render={({ handleSubmit, values }) => (
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
          <Field name="comment" id="comment" component={FieldTextarea} />
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
              type={'submit'}
              aria-label="Save changes"
              small
              onClick={() => {
                props?.handleSubmit(values.comment)
              }}
            >
              Save
            </Button>
          </Flex>
        </Flex>
      )}
    />
  )
}
