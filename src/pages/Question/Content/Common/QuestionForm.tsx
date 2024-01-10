import { Field, Form } from 'react-final-form'
import { useNavigate } from 'react-router-dom'
import { Button, ElWithBeforeIcon, FieldInput } from 'oa-components'
import IconHeaderHowto from 'src/assets/images/header-section/howto-header-icon.svg'
import { TagsSelectField } from 'src/common/Form/TagsSelect.field'
import { logger } from 'src/logger'
import { IModerationStatus, type IQuestion } from 'src/models'
import {
  QUESTION_MAX_DESCRIPTION_LENGTH,
  QUESTION_MAX_TITLE_LENGTH,
  QUESTION_MIN_TITLE_LENGTH,
} from 'src/pages/Question/constants'
import { PostingGuidelines } from 'src/pages/Question/Content/Common'
import * as LABELS from 'src/pages/Question/labels'
import { useQuestionStore } from 'src/stores/Question/question.store'
import { COMPARISONS } from 'src/utils/comparisons'
import {
  composeValidators,
  draftValidationWrapper,
  minValue,
  required,
  setAllowDraftSaveFalse,
  setAllowDraftSaveTrue,
} from 'src/utils/validators'
import { Box, Card, Flex, Heading, Label } from 'theme-ui'

import { CategoriesSelect } from '../../../Howto/Category/CategoriesSelect'

interface IProps {
  'data-testid'?: string
  formValues?: any
  parentType: 'create' | 'edit'
}

export const QuestionForm = (props: IProps) => {
  const navigate = useNavigate()
  const store = useQuestionStore()
  const publishButtonText =
    props.formValues?.moderation === IModerationStatus.DRAFT
      ? LABELS.buttons.create
      : LABELS.buttons[props.parentType]
  const draftButtonText =
    props.formValues?.moderation === IModerationStatus.DRAFT
      ? LABELS.buttons.draft.update
      : LABELS.buttons.draft.create

  const headingText = LABELS.headings[props.parentType]

  return (
    <Form
      data-testid={props['data-testid']}
      onSubmit={async (formValues: Partial<IQuestion.FormInput>) => {
        formValues.moderation = formValues.allowDraftSave
          ? IModerationStatus.DRAFT
          : IModerationStatus.ACCEPTED
        try {
          const newDocument = await store.upsertQuestion(
            formValues as IQuestion.FormInput,
          )
          if (newDocument) {
            navigate('/questions/' + newDocument.slug)
          }
        } catch (e) {
          logger.error(e)
        }
      }}
      mutators={{ setAllowDraftSaveFalse, setAllowDraftSaveTrue }}
      initialValues={props.formValues}
      render={({ submitting, handleSubmit, form }) => (
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
                  <Heading>{headingText}</Heading>
                  <Box ml="15px">
                    <ElWithBeforeIcon icon={IconHeaderHowto} size={20} />
                  </Box>
                </Flex>
              </Card>
              <Box sx={{ mt: '20px', display: ['block', 'block', 'none'] }}>
                <PostingGuidelines />
              </Box>
              <Card mt={3} p={4} sx={{ overflow: 'visible' }}>
                <Box mb={3}>
                  <Label htmlFor="title" sx={{ fontSize: 2, mb: 2 }}>
                    {LABELS.overview.question.title}
                  </Label>
                  <Field
                    name="title"
                    id="title"
                    validate={composeValidators(
                      required,
                      minValue(QUESTION_MIN_TITLE_LENGTH),
                    )}
                    component={FieldInput}
                    placeholder={LABELS.overview.question.placeholder}
                    minLength={QUESTION_MIN_TITLE_LENGTH}
                    maxLength={QUESTION_MAX_TITLE_LENGTH}
                    showCharacterCount
                  />
                </Box>

                <Box mb={3}>
                  <Label htmlFor="description" sx={{ fontSize: 2, mb: 2 }}>
                    {LABELS.overview.description.title}
                  </Label>
                  <Field
                    name="description"
                    id="description"
                    label="Information"
                    validate={(value, allValues) =>
                      draftValidationWrapper(value, allValues, required)
                    }
                    component={FieldInput}
                    placeholder={LABELS.overview.description.title}
                    maxLength={QUESTION_MAX_DESCRIPTION_LENGTH}
                    showCharacterCount
                  />
                </Box>

                <Box mb={3}>
                  <Label htmlFor="categories" sx={{ fontSize: 2, mb: 2 }}>
                    Which categories fit your question?
                  </Label>
                  <Field
                    name="questionCategory"
                    render={({ input, ...rest }) => (
                      <CategoriesSelect
                        {...rest}
                        isForm={true}
                        onChange={input.onChange}
                        value={input.value}
                        placeholder="Select category"
                        type="question"
                      />
                    )}
                  />
                </Box>

                <Box sx={{ flexDirection: 'column' }} mb={3}>
                  <Label htmlFor="tags" sx={{ fontSize: 2, mb: 2 }}>
                    {LABELS.overview.tags.title}
                  </Label>
                  <Field
                    name="tags"
                    component={TagsSelectField}
                    category="question"
                    isEqual={COMPARISONS.tags}
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
                data-testid="draft"
                mt={[0, 0, 3]}
                variant="secondary"
                type="submit"
                disabled={submitting}
                onClick={(event) => {
                  form.mutators.setAllowDraftSaveTrue()
                  handleSubmit(event)
                }}
                sx={{ width: '100%', display: 'block' }}
              >
                <span>{draftButtonText}</span>
              </Button>
              <Button
                large
                data-cy={'submit'}
                mt={3}
                variant="primary"
                type="submit"
                disabled={submitting}
                onClick={(event) => {
                  form.mutators.setAllowDraftSaveFalse()
                  handleSubmit(event)
                }}
                sx={{
                  width: '100%',
                  mb: ['40px', '40px', 0],
                  display: 'block',
                }}
              >
                {publishButtonText}
              </Button>
            </Box>
          </Flex>
        </Flex>
      )}
    />
  )
}
