import { ElWithBeforeIcon, Button, FieldInput } from 'oa-components'
import { Form, Field } from 'react-final-form'
import { Box, Card, Flex, Heading, Label } from 'theme-ui'
import IconHeaderHowto from 'src/assets/images/header-section/howto-header-icon.svg'
import { PostingGuidelines } from '../Research/Content/Common'
import { composeValidators, minValue, required } from 'src/utils/validators'
import { useQuestionStore } from 'src/stores/Question/question.store'
import { logger } from 'src/logger'
import {
  QUESTION_MAX_DESCRIPTION_LENGTH,
  QUESTION_MAX_TITLE_LENGTH,
  QUESTION_MIN_TITLE_LENGTH,
} from './constants'

export const QuestionCreate = (props) => {
  const store = useQuestionStore()
  return (
    <Box sx={{ p: 7 }}>
      <Form
        onSubmit={async (v: any) => {
          try {
            const newDocument = await store.upsertQuestion(v)
            if (newDocument) {
              props.history.push('/question/' + newDocument.slug)
            }
          } catch (e) {
            logger.error(e)
          }
        }}
        render={({ submitting, handleSubmit }) => (
          <Flex mx={-2} bg={'inherit'} sx={{ flexWrap: 'wrap' }}>
            <Flex
              bg="inherit"
              px={2}
              sx={{ width: ['100%', '100%', `${(2 / 3) * 100}%`] }}
              mt={4}
            >
              <Box
                as="form"
                id="questionForm"
                sx={{ width: '100%' }}
                onSubmit={handleSubmit}
              >
                <Card sx={{ backgroundColor: 'softblue' }}>
                  <Flex px={3} py={2} sx={{ alignItems: 'center' }}>
                    <Heading>Ask your question</Heading>
                    <Box ml="15px">
                      <ElWithBeforeIcon icon={IconHeaderHowto} size={20} />
                    </Box>
                  </Flex>
                </Card>
                <Card mt={3} p={4}>
                  <Box mb={3}>
                    <Label htmlFor="title" sx={{ fontSize: 2, mb: 2 }}>
                      The Question
                    </Label>
                    <Field
                      name="title"
                      id="title"
                      validate={composeValidators(
                        required,
                        minValue(QUESTION_MIN_TITLE_LENGTH),
                      )}
                      component={FieldInput}
                      placeholder="How come … does not work?"
                      minLength={QUESTION_MIN_TITLE_LENGTH}
                      maxLength={QUESTION_MAX_TITLE_LENGTH}
                      showCharacterCount
                    />
                  </Box>

                  <Box mb={3}>
                    <Label htmlFor="description" sx={{ fontSize: 2, mb: 2 }}>
                      Give some more information
                    </Label>
                    <Field
                      name="description"
                      id="description"
                      label="Information"
                      validate={composeValidators(required)}
                      component={FieldInput}
                      placeholder="Introduce to your research question. Mention what you want to do, whats the goal what challenges you see, etc"
                      maxLength={QUESTION_MAX_DESCRIPTION_LENGTH}
                      showCharacterCount
                    />
                  </Box>
                </Card>
              </Box>
            </Flex>
            <Flex
              sx={{
                flexDirection: 'column',
                width: ['100%', '100%', `${100 / 3}%`],
                height: '100%',
              }}
              bg="inherit"
              px={2}
              mt={[0, 0, 4]}
            >
              <Box
                sx={{
                  top: 3,
                  maxWidth: ['inherit', 'inherit', '400px'],
                }}
              >
                <Box sx={{ display: ['none', 'none', 'block'] }}>
                  <PostingGuidelines />
                </Box>

                <Button
                  data-cy={'draft'}
                  // eslint-disable-next-line @typescript-eslint/no-empty-function
                  onClick={() => {}}
                  mt={[0, 0, 3]}
                  variant="secondary"
                  type="submit"
                  disabled={submitting}
                  sx={{ width: '100%', display: 'block' }}
                >
                  <span>Draft</span>
                </Button>

                <Button
                  large
                  data-cy={'submit'}
                  mt={3}
                  onClick={handleSubmit}
                  variant="primary"
                  type="submit"
                  disabled={submitting}
                  sx={{
                    width: '100%',
                    mb: ['40px', '40px', 0],
                    display: 'block',
                  }}
                >
                  Publish
                </Button>
              </Box>
            </Flex>
          </Flex>
        )}
      />
    </Box>
  )
}
