import { ElWithBeforeIcon, Button, FieldInput } from 'oa-components'
import { Form, Field } from 'react-final-form'
import { Box, Card, Flex, Heading, Label } from 'theme-ui'
import IconHeaderHowto from 'src/assets/images/header-section/howto-header-icon.svg'
import { PostingGuidelines } from '../Research/Content/Common'
import { composeValidators, required } from 'src/utils/validators'
import { useQuestionStore } from 'src/stores/Question/question.store'

export const QuestionCreate = () => {
  const store = useQuestionStore()
  return (
    <Box sx={{ p: 7 }}>
      <Form
        onSubmit={(v: any) => {
          store.upsertQuestion(v)
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
                <Card>
                  <Label htmlFor="title">The Question</Label>
                  <Field
                    name="title"
                    id="title"
                    validate={composeValidators(required)}
                    component={FieldInput}
                    placeholder="How come … does not work?"
                  />

                  <Label htmlFor="description">
                    Give some more information
                  </Label>
                  <Field
                    name="description"
                    id="description"
                    label="Information"
                    validate={composeValidators(required)}
                    component={FieldInput}
                    placeholder="Introduce to your research question. Mention what you want to do, whats the goal what challenges you see, etc"
                  />
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
