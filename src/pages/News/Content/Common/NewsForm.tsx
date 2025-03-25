import { useEffect, useState } from 'react'
import { Form } from 'react-final-form'
import { useNavigate } from '@remix-run/react'
import { Button, ElWithBeforeIcon } from 'oa-components'
import IconHeaderHowto from 'src/assets/images/header-section/howto-header-icon.svg'
import { logger } from 'src/logger'
import { CategoryField } from 'src/pages/common/FormFields/Category.field'
import { TagsField } from 'src/pages/common/FormFields/Tags.field'
import { TitleField } from 'src/pages/common/FormFields/Title.field'
import { NewsPostingGuidelines } from 'src/pages/News/Content/Common'
import * as LABELS from 'src/pages/News/labels'
import { newsService } from 'src/services/newsService'
import { composeValidators, minValue, required } from 'src/utils/validators'
import { Alert, Box, Card, Flex, Heading } from 'theme-ui'

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
      existingHeroImage: news.heroImage,
      category: news.category
        ? {
            value: news.category.id?.toString(),
            label: news.category.name,
          }
        : null,
      tags: news.tagIds,
      heroImage: null,
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
      }
    })
  }

  return (
    <Form
      data-testid={props['data-testid']}
      onSubmit={onSubmit}
      initialValues={initialValues}
      render={({ submitting, handleSubmit, valid }) => {
        console.log(initialValues)
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
                id="newsForm"
                sx={{ width: '100%' }}
                onSubmit={handleSubmit}
              >
                <Card sx={{ backgroundColor: 'softblue' }}>
                  <Flex
                    data-cy={`news-${parentType}-title`}
                    sx={{ alignItems: 'center', paddingX: 3, paddingY: 2 }}
                  >
                    <Heading as="h1">{LABELS.headings[parentType]}</Heading>
                    <Box ml="15px">
                      <ElWithBeforeIcon icon={IconHeaderHowto} size={20} />
                    </Box>
                  </Flex>
                </Card>
                <Box sx={{ mt: '20px', display: ['block', 'block', 'none'] }}>
                  <NewsPostingGuidelines />
                </Box>
                <Card sx={{ marginTop: 4, padding: 4, overflow: 'visible' }}>
                  <TitleField
                    validate={composeValidators(
                      required,
                      minValue(NEWS_MIN_TITLE_LENGTH),
                    )}
                  />
                  <NewsBodyField />
                  <NewsImageField
                    existingHeroImage={initialValues.existingHeroImage}
                    removeExistingImage={removeExistingImage}
                  />
                  <CategoryField
                    getCategories={newsContentService.getCategories}
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
                  <NewsPostingGuidelines />
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
