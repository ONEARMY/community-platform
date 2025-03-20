import { useMemo, useState } from 'react'
import { Field, Form } from 'react-final-form'
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
import { TagsSelectField } from 'src/common/Form/TagsSelect.field'
import { UnsavedChangesDialog } from 'src/common/Form/UnsavedChangesDialog'
import {
  ResearchErrors,
  ResearchPostingGuidelines,
  SubmitStatus,
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
import { buttons, headings, overview as labels } from '../../labels'
import { researchService } from '../../research.service'
import ResearchFieldCategory from './ResearchCategorySelect'

import type { ResearchFormData, ResearchItem } from 'src/models/research.model'

type ResearchFormProps = {
  research?: ResearchItem
}

const ResearchFormLabel = ({ children, ...props }) => (
  <Label sx={{ fontSize: 2, mb: 2, display: 'block' }} {...props}>
    {children}
  </Label>
)

const ResearchForm = ({ research }: ResearchFormProps) => {
  const id = research?.id || null

  const [slug, setSlug] = useState('')
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [complete, setComplete] = useState(false)
  const initialValues = useMemo(() => {
    return {
      title: research?.title,
      description: research?.description,
      status: research?.status,
      category: research?.category?.id,
      collaborators: research?.collaborators?.map((x) => x.id),
      tags: research?.tagIds,
    } as ResearchFormData
  }, [research])

  const onSubmit = async (values: ResearchFormData, isDraft = false) => {
    try {
      const updatedResearh = await researchService.upsert(id, values, isDraft)

      if (updatedResearh) {
        setSlug(updatedResearh.slug)
      }
    } catch (err) {
      console.error(err)
    }

    setComplete(true)
  }

  const pageTitle = id ? headings.overview.edit : headings.overview.create

  return (
    <div>
      <SubmitStatus
        slug={'/research/' + slug}
        complete={complete}
        isOpen={showSubmitModal}
        type="Research"
        onClose={() => {
          setShowSubmitModal(false)
          setComplete(false)
        }}
      />

      <Form<ResearchFormData>
        onSubmit={(v) => onSubmit(v)}
        initialValues={initialValues}
        validateOnBlur
        render={({
          dirty,
          errors,
          hasValidationErrors,
          submitting,
          values,
        }) => {
          return (
            <Flex sx={{ mx: -2, bg: 'inherit', flexWrap: 'wrap' }}>
              <UnsavedChangesDialog hasChanges={dirty} />

              <Flex
                sx={{
                  width: ['100%', '100%', `${(2 / 3) * 100}%`],
                  bg: 'inherit',
                  px: 2,
                  mt: 4,
                }}
              >
                <Box as="form" id="researchForm" sx={{ width: '100%' }}>
                  {/* Research Info */}
                  <Flex sx={{ flexDirection: 'column' }}>
                    <Card sx={{ backgroundColor: 'softblue' }}>
                      <Flex sx={{ px: 3, py: 2, alignItems: 'center' }}>
                        <Heading as="h1">
                          <span>{pageTitle}</span>{' '}
                        </Heading>
                        <Box ml="15px">
                          <ElWithBeforeIcon icon={IconHeaderHowto} size={20} />
                        </Box>
                      </Flex>
                    </Card>
                    <Box
                      sx={{ mt: '20px', display: ['block', 'block', 'none'] }}
                    >
                      <ResearchPostingGuidelines />
                    </Box>
                    <Card sx={{ overflow: 'visible', mt: 3 }}>
                      <Flex
                        sx={{ flexWrap: 'wrap', flexDirection: 'column', p: 4 }}
                      >
                        <Flex
                          sx={{
                            flexDirection: ['column', 'column', 'row'],
                            mx: -2,
                          }}
                        >
                          <Flex
                            sx={{
                              flexDirection: 'column',
                              flex: [1, 1, 4],
                              px: 2,
                            }}
                          >
                            <Flex sx={{ flexDirection: 'column', mb: 3 }}>
                              <ResearchFormLabel htmlFor="title">
                                {labels.title.title}
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
                                placeholder={labels.title.placeholder}
                              />
                            </Flex>
                            <Flex sx={{ flexDirection: 'column', mb: 3 }}>
                              <ResearchFormLabel htmlFor="description">
                                {labels.description.title}
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
                                sx={{
                                  resize: 'none',
                                  flex: 1,
                                  minHeight: '150px',
                                }}
                                maxLength={RESEARCH_MAX_LENGTH}
                                showCharacterCount
                                placeholder={labels.description.placeholder}
                              />
                            </Flex>
                            <Flex sx={{ flexDirection: 'column', mb: 3 }}>
                              <ResearchFormLabel>
                                {labels.categories.title}
                              </ResearchFormLabel>
                              <ResearchFieldCategory />
                            </Flex>
                            <Flex sx={{ flexDirection: 'column', mb: 3 }}>
                              <ResearchFormLabel>
                                {labels.tags.title}
                              </ResearchFormLabel>
                              <Field
                                name="tags"
                                component={TagsSelectField}
                                isEqual={COMPARISONS.tags}
                              />
                            </Flex>
                            <Flex sx={{ flexDirection: 'column', mb: 3 }}>
                              <ResearchFormLabel>
                                {labels.collaborators.title}
                              </ResearchFormLabel>
                              <Field
                                name="collaborators"
                                component={UserNameSelect}
                                placeholder={labels.collaborators.placeholder}
                                defaultOptions={[]}
                              />
                            </Flex>
                            <Flex sx={{ flexDirection: 'column', mb: 3 }}>
                              <ResearchFormLabel>
                                {labels.researchStatus.title}
                                {' *'}
                              </ResearchFormLabel>
                              <Field
                                name="researchStatus"
                                data-cy="research-status"
                                component={SelectField}
                                placeholder={labels.researchStatus.placeholder}
                                options={researchStatusOptions}
                                validate={composeValidators(required)}
                              />
                            </Flex>
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
                  bg: 'inherit',
                  px: 2,
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
                    <ResearchPostingGuidelines />
                  </Box>

                  <Button
                    data-cy="draft"
                    onClick={() => onSubmit(values, true)}
                    variant="secondary"
                    type="button"
                    disabled={submitting}
                    sx={{ width: '100%', display: 'block', mt: [0, 0, 3] }}
                  >
                    <span>{buttons.draft}</span>
                  </Button>

                  <Button
                    large
                    data-cy="submit"
                    variant="primary"
                    type="button"
                    disabled={submitting}
                    sx={{
                      width: '100%',
                      mb: ['40px', '40px', 0],
                      display: 'block',
                      mt: 3,
                    }}
                  >
                    <span>{buttons.publish}</span>
                  </Button>

                  <ResearchErrors
                    errors={errors}
                    isVisible={hasValidationErrors}
                    labels={labels}
                  />
                </Box>
                {research?.updates ? (
                  <ResearchEditorOverview
                    sx={{ mt: 4 }}
                    updates={research?.updates
                      .filter((u) => !u.deleted)
                      .map((u) => ({
                        isActive: false,
                        status: u.status,
                        title: u.title,
                        slug: research.slug + '#update_' + u.id,
                      }))}
                    researchSlug={research.slug}
                    showCreateUpdateButton={true}
                  />
                ) : null}
              </Flex>
            </Flex>
          )
        }}
      />
    </div>
  )
}

export default ResearchForm
