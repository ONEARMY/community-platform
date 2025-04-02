import { useEffect, useState } from 'react'
import { Form } from 'react-final-form'
import { useNavigate } from '@remix-run/react'
import IconHeaderHowto from 'src/assets/images/header-section/howto-header-icon.svg'
import { FormWrapper } from 'src/common/Form/FormWrapper'
import { logger } from 'src/logger'
import { CategoryField } from 'src/pages/common/FormFields/Category.field'
import { TagsField } from 'src/pages/common/FormFields/Tags.field'
import { TitleField } from 'src/pages/common/FormFields/Title.field'
import { NewsPostingGuidelines } from 'src/pages/News/Content/Common'
import * as LABELS from 'src/pages/News/labels'
import { newsService } from 'src/services/newsService'
import { composeValidators, minValue, required } from 'src/utils/validators'

import { NEWS_MIN_TITLE_LENGTH } from '../../constants'
import { newsContentService } from '../../newsContent.service'
import { NewsBodyField, NewsImageField } from './FormFields'

import type { News, NewsFormData } from 'oa-shared'
import type { MainFormAction } from 'src/common/Form/types'

interface IProps {
  'data-testid'?: string
  news: News
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
  const [saveError, setSaveError] = useState<string | null>(null)
  const id = news?.id || null

  useEffect(() => {
    if (!news) {
      return
    }

    setInitialValues({
      title: news.title,
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
    })
  }, [news])

  const onSubmit = async (formValues: Partial<NewsFormData>) => {
    setSaveError(null)

    try {
      const result = await newsService.upsert(id, {
        title: formValues.title!,
        body: formValues.body!,
        tags: formValues.tags,
        category: formValues.category || null,
        heroImage: formValues.heroImage || null,
        existingHeroImage: initialValues.existingHeroImage || null,
      })

      if (result) {
        navigate('/news/' + result.slug)
      }
    } catch (e) {
      if (e.cause && e.message) {
        setSaveError(e.message)
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
      render={({ submitting, handleSubmit, valid }) => {
        return (
          <FormWrapper
            buttonLabel={LABELS.buttons[parentType]}
            guidelines={<NewsPostingGuidelines />}
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
              validate={composeValidators(
                required,
                minValue(NEWS_MIN_TITLE_LENGTH),
              )}
              title={LABELS.fields.title.title}
            />
            <NewsBodyField />
            <NewsImageField
              existingHeroImage={initialValues.existingHeroImage}
              removeExistingImage={removeExistingImage}
            />
            <CategoryField getCategories={newsContentService.getCategories} />
            <TagsField title={LABELS.fields.tags.title} />
          </FormWrapper>
        )
      }}
    />
  )
}
