import { useEffect, useState } from 'react'
import { Field, Form } from 'react-final-form'
import { useNavigate } from 'react-router'
import arrayMutators from 'final-form-arrays'
import {
  Button,
  ElWithBeforeIcon,
  FieldInput,
  FieldTextarea,
  ResearchEditorOverview,
} from 'oa-components'
import { researchStatusOptions } from 'oa-shared'
import IconHeaderHowto from 'src/assets/images/header-section/howto-header-icon.svg'
import { SelectField } from 'src/common/Form/Select.field'
import { TagsSelectFieldV2 } from 'src/common/Form/TagsSelectFieldV2'
import { UnsavedChangesDialog } from 'src/common/Form/UnsavedChangesDialog'
import {
  ResearchErrors,
  ResearchPostingGuidelines,
} from 'src/pages/Research/Content/Common'
import { COMPARISONS } from 'src/utils/comparisons'
import {
  composeValidators,
  draftValidationWrapper,
  minValue,
  required,
  validateTitle,
} from 'src/utils/validators'
import { Box, Card, Flex, Heading, Label } from 'theme-ui'

import { UserNameSelect } from '../../../common/UserNameSelect/UserNameSelect'
import {
  RESEARCH_MAX_LENGTH,
  RESEARCH_TITLE_MAX_LENGTH,
  RESEARCH_TITLE_MIN_LENGTH,
} from '../../constants'
import { buttons, headings, overview } from '../../labels'
import { researchService } from '../../research.service'
import { ResearchImageField } from '../CreateResearch/Form/ResearchImageField'
import ResearchFieldCategory from './ResearchCategorySelect'

import type { ResearchFormData, ResearchItem } from 'oa-shared'

interface IProps {
  research?: ResearchItem
}

const ResearchFormLabel = ({ children, ...props }) => (
  <Label sx={{ fontSize: 2, mb: 2, display: 'block' }} {...props}>
    {children}
  </Label>
)

const ResearchForm = ({ research }: IProps) => {
  const [initialValues, setInitialValues] = useState<ResearchFormData>()
  const navigate = useNavigate()
  const [intentionalNavigation, setIntentionalNavigation] = useState(false)

  useEffect(() => {
    if (research) {
      setInitialValues({
        title: research?.title,
        description: research?.description,
        status: research?.status || 'In progress',
        category: research?.category
          ? {
              value: research.category.id?.toString(),
              label: research.category.name,
            }
          : undefined,
        collaborators: Array.isArray(research?.collaboratorsUsernames)
          ? research.collaboratorsUsernames
          : [],
        tags: research?.tagIds,
        existingImage: research?.image,
      })
    }
  }, [research])

  const { categories, collaborators, description, tags, title, status } =
    overview

  const onSubmit = async (values: ResearchFormData, isDraft = false) => {
    const result = await researchService.upsert(
      research?.id || null,
      values,
      isDraft,
    )

    setIntentionalNavigation(true)

    setTimeout(() => {
      navigate(`/research/${result.research.slug}`)
    }, 100)
  }

  const removeImage = () => {
    setInitialValues({
      ...initialValues!,
      existingImage: null,
    })
  }

  const pageTitle = research ? headings.overview.edit : headings.overview.create

  return (
    <Form<ResearchFormData>
      onSubmit={async (values) => await onSubmit(values)}
      initialValues={initialValues}
      mutators={{
        ...arrayMutators,
      }}
      validateOnBlur
      render={({
        dirty,
        errors,
        values,
        handleSubmit,
        hasValidationErrors,
        submitting,
        submitFailed,
        submitSucceeded,
      }) => {
        return (
          <Flex
            sx={{ flexWrap: 'wrap', marginX: -2, backgroundColor: 'inherit' }}
          >
            <UnsavedChangesDialog
              hasChanges={dirty && !submitSucceeded && !intentionalNavigation}
            />

            <Flex
              bg="inherit"
              px={2}
              sx={{ width: ['100%', '100%', `${(2 / 3) * 100}%`] }}
              mt={4}
            >
              <Box
                as="form"
                id="researchForm"
                sx={{ width: '100%' }}
                onSubmit={handleSubmit}
              >
                {/* Research Info */}
                <Flex sx={{ flexDirection: 'column' }}>
                  <Card sx={{ backgroundColor: 'softblue' }}>
                    <Flex px={3} py={2} sx={{ alignItems: 'center' }}>
                      <Heading as="h1">
                        <span>{pageTitle}</span>{' '}
                      </Heading>
                      <Box ml="15px">
                        <ElWithBeforeIcon icon={IconHeaderHowto} size={20} />
                      </Box>
                    </Flex>
                  </Card>
                  <Box sx={{ mt: '20px', display: ['block', 'block', 'none'] }}>
                    <ResearchPostingGuidelines />
                  </Box>
                  <Card mt={3} sx={{ overflow: 'visible' }}>
                    <Flex
                      p={4}
                      sx={{ flexWrap: 'wrap', flexDirection: 'column' }}
                    >
                      <Flex
                        mx={-2}
                        sx={{ flexDirection: ['column', 'column', 'row'] }}
                      >
                        <Flex
                          px={2}
                          sx={{ flexDirection: 'column', flex: [1, 1, 4] }}
                        >
                          <Flex sx={{ flexDirection: 'column' }} mb={3}>
                            <ResearchFormLabel htmlFor="title">
                              {title.title}
                              {' *'}
                            </ResearchFormLabel>
                            <Field
                              id="title"
                              name="title"
                              data-cy="intro-title"
                              validateFields={[]}
                              validate={composeValidators(
                                required,
                                minValue(RESEARCH_TITLE_MIN_LENGTH),
                                validateTitle(),
                              )}
                              isEqual={COMPARISONS.textInput}
                              component={FieldInput}
                              maxLength={RESEARCH_TITLE_MAX_LENGTH}
                              minLength={RESEARCH_TITLE_MIN_LENGTH}
                              showCharacterCount
                              placeholder={title.placeholder}
                            />
                          </Flex>
                          <Flex sx={{ flexDirection: 'column' }} mb={3}>
                            <ResearchFormLabel htmlFor="description">
                              {description.title}
                              {' *'}
                            </ResearchFormLabel>
                            <Field
                              id="description"
                              name="description"
                              data-cy="intro-description"
                              validate={(value, allValues) =>
                                draftValidationWrapper(
                                  value,
                                  allValues,
                                  required,
                                )
                              }
                              validateFields={[]}
                              isEqual={COMPARISONS.textInput}
                              component={FieldTextarea}
                              style={{
                                resize: 'none',
                                flex: 1,
                                minHeight: '150px',
                              }}
                              maxLength={RESEARCH_MAX_LENGTH}
                              showCharacterCount
                              placeholder={description.placeholder}
                            />
                          </Flex>
                          <Flex sx={{ flexDirection: 'column' }} mb={3}>
                            <ResearchFormLabel>
                              {categories.title}
                            </ResearchFormLabel>
                            <ResearchFieldCategory />
                          </Flex>
                          <Flex sx={{ flexDirection: 'column' }} mb={3}>
                            <ResearchFormLabel>{tags.title}</ResearchFormLabel>
                            <Field
                              name="tags"
                              component={TagsSelectFieldV2}
                              isEqual={COMPARISONS.tagsSupabase}
                            />
                          </Flex>
                          <Flex sx={{ flexDirection: 'column' }} mb={3}>
                            <ResearchFormLabel>
                              {collaborators.title}
                            </ResearchFormLabel>
                            <Field
                              name="collaborators"
                              component={UserNameSelect}
                              placeholder={collaborators.placeholder}
                              defaultOptions={[]}
                            />
                          </Flex>
                          <Flex sx={{ flexDirection: 'column' }} mb={3}>
                            <ResearchFormLabel>
                              {status.title}
                              {' *'}
                            </ResearchFormLabel>
                            <Field
                              name="status"
                              data-cy="research-status"
                              component={SelectField}
                              placeholder={status.placeholder}
                              options={researchStatusOptions}
                            />
                          </Flex>
                          <ResearchImageField
                            label="Cover Image"
                            existingImage={initialValues?.existingImage || null}
                            remove={removeImage}
                          />
                        </Flex>
                      </Flex>
                    </Flex>
                  </Card>
                </Flex>
              </Box>
            </Flex>
            {/* post guidelines container */}
            <Flex
              sx={{
                flexDirection: 'column',
                width: ['100%', '100%', `${100 / 3}%`],
                height: '100%',
                paddingX: 2,
                marginTop: [0, 0, 4],
                backgroundColor: 'inherit',
              }}
            >
              <Flex
                sx={{
                  flexDirection: 'column',
                  maxWidth: ['inherit', 'inherit', '400px'],
                  gap: 3,
                }}
              >
                <Box sx={{ display: ['none', 'none', 'block'] }}>
                  <ResearchPostingGuidelines />
                </Box>

                <Button
                  data-cy="draft"
                  onClick={() => onSubmit(values, true)}
                  variant="secondary"
                  type="submit"
                  disabled={submitting}
                  sx={{
                    width: '100%',
                    display: 'block',
                  }}
                >
                  <span>{buttons.draft}</span>
                </Button>

                <Button
                  large
                  data-cy="submit"
                  onClick={() => onSubmit(values)}
                  variant="primary"
                  type="submit"
                  disabled={submitting}
                  sx={{
                    width: '100%',
                    display: 'block',
                  }}
                >
                  <span>{buttons.publish}</span>
                </Button>

                <ResearchErrors
                  errors={errors}
                  isVisible={submitFailed && hasValidationErrors}
                  labels={overview}
                />
              </Flex>
              {research?.updates ? (
                <ResearchEditorOverview
                  sx={{ marginTop: 4 }}
                  updates={research?.updates
                    .filter((u) => !u.deleted)
                    .map((u) => ({
                      isActive: false,
                      isDraft: u.isDraft,
                      title: u.title,
                      id: u.id,
                    }))}
                  researchSlug={research?.slug}
                  showCreateUpdateButton={true}
                />
              ) : null}
            </Flex>
          </Flex>
        )
      }}
    />
  )
}

export default ResearchForm
