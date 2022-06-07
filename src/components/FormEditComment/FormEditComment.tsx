import { Flex, Text } from 'theme-ui'
import { FieldTextarea, Button } from 'oa-components'
import { Field, Form } from 'react-final-form'
import { logger } from 'src/logger'

export const FormEditComment: React.FC<{
  comment: string
  handleCancel: () => void
  handleSubmit: (commentText: string) => void
}> = (props) => {
  const { comment } = props

  return (
    <Form
      onSubmit={(values) => {
        logger.debug(values)
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
          <Text as="label" sx={{ marginBottom: '6px', fontSize: 3 }}>
            Edit comment
          </Text>
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
              small
              onClick={() => {
                props?.handleSubmit(values.comment)
              }}
            >
              Edit
            </Button>
          </Flex>
        </Flex>
      )}
    />
  )
}

export default FormEditComment
