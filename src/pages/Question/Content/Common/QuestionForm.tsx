import { useEffect, useState } from 'react'
import { Form } from 'react-final-form'
import { useNavigate } from '@remix-run/react'
import IconHeaderHowto from 'src/assets/images/header-section/howto-header-icon.svg'
import { FormWrapper } from 'src/common/Form/FormWrapper'
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
          <FormWrapper
            buttonLabel={LABELS.buttons[parentType]}
            guidelines={<QuestionPostingGuidelines />}
            handleSubmit={handleSubmit}
            heading={LABELS.headings[parentType]}
            icon={IconHeaderHowto}
            parentType={parentType}
            saveError={saveError}
            submitting={submitting}
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
