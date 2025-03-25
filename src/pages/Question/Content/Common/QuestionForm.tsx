import { useEffect, useState } from 'react'
import { Form } from 'react-final-form'
import { useNavigate } from '@remix-run/react'
import { FormWrapper } from 'src/common/Form/FormWrapper'
import { UnsavedChangesDialog } from 'src/common/Form/UnsavedChangesDialog'
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
import { subscribersService } from 'src/services/subscribersService'
import {
  composeValidators,
  endsWithQuestionMark,
  minValue,
  required,
  setAllowDraftSaveFalse,
} from 'src/utils/validators'
import { Alert } from 'theme-ui'

import { QUESTION_MAX_IMAGES, QUESTION_MIN_TITLE_LENGTH } from '../../constants'

import type { Question, QuestionFormData } from 'oa-shared'
import type { MainFormAction } from 'src/common/Form/types'

interface IProps {
  'data-testid'?: string
  question: Question | null
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
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null)
  const [intentionalNavigation, setIntentionalNavigation] = useState(false)
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
    setSaveErrorMessage(null)

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
        setIntentionalNavigation(true)
        !id && (await subscribersService.add('questions', result.id))
        navigate('/questions/' + result.slug)
      }
    } catch (e) {
      if (e.cause && e.message) {
        setSaveErrorMessage(e.message)
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
      render={({
        dirty,
        submitting,
        submitSucceeded,
        handleSubmit,
        valid,
        values,
      }) => {
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

        const saveError = saveErrorMessage && (
          <Alert variant="failure" sx={{ mt: 3 }}>
            {saveErrorMessage}
          </Alert>
        )
        const unsavedChangesDialog = (
          <UnsavedChangesDialog
            hasChanges={dirty && !submitSucceeded && !intentionalNavigation}
          />
        )

        return (
          <FormWrapper
            buttonLabel={LABELS.buttons[parentType]}
            contentType="questions"
            guidelines={<QuestionPostingGuidelines />}
            handleSubmit={handleSubmit}
            heading={LABELS.headings[parentType]}
            saveError={saveError}
            submitting={submitting}
            unsavedChangesDialog={unsavedChangesDialog}
            valid={valid}
          >
            <TitleField
              placeholder={LABELS.fields.title.placeholder}
              validate={validate}
              title={LABELS.fields.title.title}
            />
            <QuestionDescriptionField />
            <QuestionImagesField
              inputsAvailable={numberOfImageInputsAvailable}
              existingImages={initialValues.existingImages}
              removeExistingImage={removeExistingImage}
            />
            <CategoryField type="questions" />
            <TagsField title={LABELS.fields.tags.title} />
          </FormWrapper>
        )
      }}
    />
  )
}
