import { useEffect, useState } from 'react'
import { Form } from 'react-final-form'
import { useNavigate } from '@remix-run/react'
import { Button, ElWithBeforeIcon } from 'oa-components'
import IconHeaderHowto from 'src/assets/images/header-section/howto-header-icon.svg'
import { logger } from 'src/logger'
import {
  CategoryField,
  TagsField,
  TitleField,
} from 'src/pages/common/FormFields'
import { QuestionPostingGuidelines } from 'src/pages/Question/Content/Common'
import {
  QuestionDescriptionField,
  QuestionImagesField,
} from 'src/pages/Question/Content/Common/FormFields'
import * as LABELS from 'src/pages/Question/labels'
import { questionService } from 'src/services/questionService'
import {
  composeValidators,
  endsWithQuestionMark,
  minValue,
  required,
  setAllowDraftSaveFalse,
} from 'src/utils/validators'
import { Alert, Box, Card, Flex, Heading } from 'theme-ui'

import { QUESTION_MAX_IMAGES, QUESTION_MIN_TITLE_LENGTH } from '../../constants'
import { questionContentService } from '../../questionContent.service'

import type { Question, QuestionFormData } from 'oa-shared'
import type { MainFormAction } from 'src/common/Form/types'

interface IProps {
  'data-testid'?: string
  question: Question
  parentType: MainFormAction
}

export const QuestionForm = (props: IProps) => {
  const { question, parentType } = props
  const navigate = useNavigate()
  const [initialValues, setInitialValues] = useState<QuestionFormData>({
    title: '',
    description: '',
    existingImages: [],
    category: null,
    tags: [],
    images: [],
  })
  const [saveError, setSaveError] = useState<string | null>(null)
  const id = question?.id || null

  useEffect(() => {
    if (!question) {
      return
    }

    setInitialValues({
      title: question.title,
      description: question.description,
      existingImages: question.images,
      category: question.category
        ? {
            value: question.category.id?.toString(),
            label: question.category.name,
          }
        : null,
      tags: question.tagIds,
      images: null,
    })
  }, [question])

  const onSubmit = async (formValues: Partial<QuestionFormData>) => {
    setSaveError(null)

    try {
      const result = await questionService.upsert(id, {
        title: formValues.title!,
        description: formValues.description!,
        tags: formValues.tags,
        category: formValues.category || null,
        images: formValues.images || null,
        existingImages: initialValues.existingImages || null,
      })

      if (result) {
        navigate('/questions/' + result.slug)
      }
    } catch (e) {
      if (e.cause && e.message) {
        setSaveError(e.message)
      }
      logger.error(e)
    }
  }

  const removeExistingImage = (index: number) => {
    setInitialValues((prevState: QuestionFormData) => {
      return {
        ...prevState,
        existingImages:
          prevState.existingImages?.filter((_, i) => i !== index) ?? null,
      }
    })
  }

  return (
    <Form
      data-testid={props['data-testid']}
      onSubmit={onSubmit}
      mutators={{ setAllowDraftSaveFalse }}
      initialValues={initialValues}
      render={({ submitting, handleSubmit, valid, values }) => {
        const numberOfImageInputsAvailable = (values as any)?.images
          ? Math.min(
              (values as any).images.filter((x) => !!x).length + 1,
              QUESTION_MAX_IMAGES,
            )
          : 1
        const validate = composeValidators(
          required,
          minValue(QUESTION_MIN_TITLE_LENGTH),
          endsWithQuestionMark(),
        )

        return (
          <Flex sx={{ flexWrap: 'wrap', backgroundColor: 'inherit', mx: -2 }}>
            <Flex
              sx={{
                backgroundColor: 'inherit',
                px: 2,
                mt: 4,
                width: ['100%', '100%', `${(2 / 3) * 100}%`],
              }}
            >
              <Box
                as="form"
                id="questionForm"
                sx={{ width: '100%' }}
                onSubmit={handleSubmit}
              >
                <Card sx={{ backgroundColor: 'softblue' }}>
                  <Flex
                    data-cy={`question-${parentType}-title`}
                    sx={{ alignItems: 'center', paddingX: 3, paddingY: 2 }}
                  >
                    <Heading as="h1">{LABELS.headings[parentType]}</Heading>
                    <Box ml="15px">
                      <ElWithBeforeIcon icon={IconHeaderHowto} size={20} />
                    </Box>
                  </Flex>
                </Card>
                <Box sx={{ mt: '20px', display: ['block', 'block', 'none'] }}>
                  <QuestionPostingGuidelines />
                </Box>
                <Card sx={{ marginTop: 4, padding: 4, overflow: 'visible' }}>
                  <TitleField validate={validate} />
                  <QuestionDescriptionField />
                  <QuestionImagesField
                    inputsAvailable={numberOfImageInputsAvailable}
                    existingImages={initialValues.existingImages}
                    removeExistingImage={removeExistingImage}
                  />
                  <CategoryField
                    getCategories={questionContentService.getCategories}
                  />
                  <TagsField />
                </Card>
              </Box>
            </Flex>
            <Flex
              sx={{
                flexDirection: 'column',
                width: ['100%', '100%', `${100 / 3}%`],
                height: '100%',
                px: 2,
                backgroundColor: 'inherit',
                mt: [0, 0, 4],
              }}
            >
              <Box
                sx={{
                  top: 3,
                  maxWidth: ['inherit', 'inherit', '400px'],
                }}
              >
                <Box sx={{ display: ['none', 'none', 'block'] }}>
                  <QuestionPostingGuidelines />
                </Box>
                <Button
                  large
                  data-cy="submit"
                  variant="primary"
                  type="submit"
                  disabled={submitting || !valid}
                  onClick={handleSubmit}
                  sx={{
                    mt: 3,
                    width: '100%',
                    mb: ['40px', '40px', 0],
                    display: 'block',
                  }}
                >
                  {LABELS.buttons[parentType]}
                </Button>
                {saveError && (
                  <Alert variant="failure" sx={{ mt: 3 }}>
                    {saveError}
                  </Alert>
                )}
              </Box>
            </Flex>
          </Flex>
        )
      }}
    />
  )
}
