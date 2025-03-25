import { useEffect, useState } from 'react'
import { Form } from 'react-final-form'
import { useNavigate } from '@remix-run/react'
import { setIn } from 'final-form'
import { FormWrapper } from 'src/common/Form/FormWrapper'
import { UnsavedChangesDialog } from 'src/common/Form/UnsavedChangesDialog'
import { logger } from 'src/logger'
import { CategoryField } from 'src/pages/common/FormFields/Category.field'
import { TagsField } from 'src/pages/common/FormFields/Tags.field'
import { TitleField } from 'src/pages/common/FormFields/Title.field'
import { NewsPostingGuidelines } from 'src/pages/News/Content/Common/NewsPostingGuidelines'
import * as LABELS from 'src/pages/News/labels'
import { newsService } from 'src/services/newsService'
import { storageService } from 'src/services/storageService'
import { subscribersService } from 'src/services/subscribersService'
import { composeValidators, minValue, required } from 'src/utils/validators'
import { Alert } from 'theme-ui'

import { NEWS_MIN_TITLE_LENGTH } from '../../constants'
import { NewsBodyField, NewsImageField } from './FormFields'

import type { News, NewsFormData } from 'oa-shared'
import type { MainFormAction } from 'src/common/Form/types'

interface IProps {
  'data-testid'?: string
  news: News | null
  parentType: MainFormAction
}

export const NewsForm = (props: IProps) => {
  const { news, parentType } = props
  const navigate = useNavigate()
  const [initialValues, setInitialValues] = useState<NewsFormData>({
    body: '',
    category: null,
    existingHeroImage: null,
    heroImage: null,
    tags: [],
    title: '',
  })
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null)
  const [intentionalNavigation, setIntentionalNavigation] = useState(false)

  const id = news?.id || null

  useEffect(() => {
    if (!news) {
      return
    }

    setInitialValues({
      body: news.body,
      category: news.category
        ? {
            value: news.category.id?.toString(),
            label: news.category.name,
          }
        : null,
      existingHeroImage: news.heroImage,
      heroImage: null,
      tags: news.tagIds,
      title: news.title,
    })
  }, [news])

  const onSubmit = async (formValues: Partial<NewsFormData>) => {
    setSaveErrorMessage(null)

    try {
      const result = await newsService.upsert(id, {
        body: formValues.body!,
        category: formValues.category || null,
        heroImage: formValues.heroImage || null,
        existingHeroImage: initialValues.existingHeroImage || null,
        tags: formValues.tags,
        title: formValues.title!,
      })

      if (result) {
        setIntentionalNavigation(true)
        !id && (await subscribersService.add('news', result.id))
        navigate('/news/' + result.slug)
      }
    } catch (e) {
      if (e.cause && e.message) {
        setSaveErrorMessage(e.message)
      }
      logger.error(e)
    }
  }

  const imageUpload = async (imageFile) => {
    if (!imageFile) {
      return
    }
    try {
      const response = await storageService.imageUpload(id, 'news', imageFile)
      return response.publicUrl
    } catch (e) {
      if (e.cause && e.message) {
        setSaveErrorMessage(e.message)
      }
      logger.error(e)
    }
  }

  const removeExistingImage = () => {
    setInitialValues((prevState: NewsFormData) => {
      return {
        ...prevState,
        existingHeroImage: null,
        heroImage: null,
      }
    })
  }

  return (
    <Form
      data-testid={props['data-testid']}
      onSubmit={onSubmit}
      initialValues={initialValues}
      validate={(values) => {
        let errors = {}
        if (!values.body?.length) {
          errors = setIn(
            errors,
            'body',
            'Body field required. Gotta have something to say...',
          )
        }
        return errors
      }}
      render={({ dirty, submitting, submitSucceeded, handleSubmit, valid }) => {
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
        const validate = composeValidators(
          required,
          minValue(NEWS_MIN_TITLE_LENGTH),
        )

        return (
          <FormWrapper
            buttonLabel={LABELS.buttons[parentType]}
            contentType="news"
            guidelines={<NewsPostingGuidelines />}
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
            <NewsImageField
              existingHeroImage={initialValues.existingHeroImage}
              removeExistingImage={removeExistingImage}
            />
            <CategoryField type="news" />
            <TagsField title={LABELS.fields.tags.title} />
            <NewsBodyField imageUpload={imageUpload} />
          </FormWrapper>
        )
      }}
    />
  )
}
