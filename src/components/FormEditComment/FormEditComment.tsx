import { Flex } from 'theme-ui'
import { Text } from 'src/components/Text'
import { TextAreaField } from '../Form/Fields'
import { Field, Form } from 'react-final-form'
import { Button } from 'oa-components'
import { logger } from 'src/logger'

export const FormEditComment: React.FC<{
  comment: string
  handleCancel: () => void
  handleSubmit: (commentText: string) => void
}> = props => {
  const { comment } = props
  return (
    <Form
      onSubmit={values => {
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
          <Text
            as="label"
            large
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
