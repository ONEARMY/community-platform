import { useEffect, useState } from 'react'
import { Form } from 'react-final-form'
import styled from '@emotion/styled'
import { useNavigate } from '@remix-run/react'
import arrayMutators from 'final-form-arrays'
import { Button, ElWithBeforeIcon } from 'oa-components'
import IconHeaderHowto from 'src/assets/images/header-section/howto-header-icon.svg'
import { UnsavedChangesDialog } from 'src/common/Form/UnsavedChangesDialog'
import { logger } from 'src/logger'
import { Box, Card, Flex, Heading, Text } from 'theme-ui'

import { buttons, headings, intro } from '../../labels'
import { libraryService } from '../../library.service'
import { LibraryButtonPublish } from './LibraryButtonPublish'
import { LibraryCategoryField } from './LibraryCategory.field'
import { LibraryCoverImageField } from './LibraryCoverImage.field'
import { LibraryDescriptionField } from './LibraryDescription.field'
import { LibraryDifficultyField } from './LibraryDifficulty.field'
import { LibraryErrors } from './LibraryErrors'
import { LibraryFilesField } from './LibraryFiles.field'
import { LibraryPostingGuidelines } from './LibraryPostingGuidelines'
import { LibraryStepsContainerField } from './LibraryStepsContainer.field'
import { LibraryTagsField } from './LibraryTags.field'
import { LibraryTimeField } from './LibraryTime.field'
import { LibraryTitleField } from './LibraryTitle.field'

import type { MediaFile, Project, ProjectFormData } from 'oa-shared'

interface IState {
  formSaved: boolean
  _toDocsList: boolean
  editCoverImg?: boolean
  fileEditMode?: boolean
  showInvalidFileWarning: boolean
}
interface LibraryFormProps {
  project?: Project
  files?: MediaFile[]
  fileLink?: string
}

const FormContainer = styled.form`
  width: 100%;
`
export const LibraryForm = ({ project, files, fileLink }: LibraryFormProps) => {
  const [initialValues, setInitialValues] = useState<Partial<ProjectFormData>>()
  const navigate = useNavigate()
  const [intentionalNavigation, setIntentionalNavigation] = useState(false)
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (project) {
      setInitialValues({
        title: project?.title,
        description: project?.description,
        category: project?.category
          ? {
              value: project.category.id?.toString(),
              label: project.category.name,
            }
          : undefined,
        tags: project?.tagIds || [],
        existingCoverImage: project?.coverImage,
        existingFiles: files,
        fileLink: fileLink,
      })
    }
  }, [project])
  const [state, setState] = useState<IState>({
    formSaved: false,
    _toDocsList: false,
    editCoverImg: false,
    fileEditMode: false,
    showInvalidFileWarning: !project?.files?.length && !project?.hasFileLink,
  })

  const { fileEditMode, showInvalidFileWarning } = state

  const formId = 'libraryForm'
  const headingText = project ? headings.edit : headings.create

  const onSubmit = async (values: ProjectFormData, isDraft = false) => {
    setIntentionalNavigation(true)
    setSaveErrorMessage(null)

    try {
      const result = await libraryService.upsert(
        project?.id || null,
        values,
        isDraft,
      )

      setTimeout(() => {
        navigate(`/library/${result.project.slug}`)
      }, 100)
    } catch (e) {
      if (e.cause && e.message) {
        setSaveErrorMessage(e.message)
      }
      logger.error(e)
    }
  }

  return (
    <>
      <Form<ProjectFormData>
        onSubmit={async (formValues) => await onSubmit(formValues)}
        initialValues={initialValues}
        mutators={{
          ...arrayMutators,
        }}
        validateOnBlur
        render={({
          dirty,
          errors,
          form,
          handleSubmit,
          submitSucceeded,
          submitting,
        }) => {
          return (
            <Flex mx={-2} bg="inherit" sx={{ flexWrap: 'wrap' }}>
              <UnsavedChangesDialog
                hasChanges={dirty && !submitSucceeded && !intentionalNavigation}
              />
              <Flex
                bg="inherit"
                px={2}
                sx={{ width: ['100%', '100%', `${(2 / 3) * 100}%`] }}
                mt={4}
              >
                <FormContainer id={formId} onSubmit={handleSubmit}>
                  {/* Project Info */}
                  <Flex sx={{ flexDirection: 'column' }}>
                    <Card sx={{ bg: 'softblue' }}>
                      <Flex px={3} py={2} sx={{ alignItems: 'center' }}>
                        <Heading
                          as="h1"
                          dangerouslySetInnerHTML={{ __html: headingText }}
                        />
                        <Box ml="15px">
                          <ElWithBeforeIcon icon={IconHeaderHowto} size={20} />
                        </Box>
                      </Flex>
                    </Card>
                    <Box
                      sx={{ mt: '20px', display: ['block', 'block', 'none'] }}
                    >
                      <LibraryPostingGuidelines />
                    </Box>
                    <Card mt={3}>
                      <Flex
                        p={4}
                        sx={{ flexWrap: 'wrap', flexDirection: 'column' }}
                      >
                        {/* Left Side */}
                        <Heading as="h2" variant="small" mb={3}>
                          {intro.heading.title}
                        </Heading>
                        <Flex
                          mx={-2}
                          sx={{ flexDirection: ['column', 'column', 'row'] }}
                        >
                          <Flex
                            px={2}
                            sx={{ flexDirection: 'column', flex: [1, 1, 4] }}
                          >
                            <LibraryTitleField />
                            <LibraryCategoryField />
                            <LibraryTagsField />
                            <LibraryTimeField />
                            <LibraryDifficultyField />
                            <LibraryDescriptionField />
                            <LibraryFilesField
                              fileEditMode={fileEditMode}
                              files={files}
                              onClick={() => {
                                setState((state) => ({
                                  ...state,
                                  fileEditMode: !state.fileEditMode,
                                }))
                                form.change('files', [])
                              }}
                              showInvalidFileWarning={showInvalidFileWarning}
                            />
                          </Flex>
                          {/* Right side */}
                          <Flex
                            px={2}
                            sx={{ flexDirection: 'column', flex: [1, 1, 3] }}
                            data-cy={'intro-cover'}
                          >
                            <LibraryCoverImageField />
                          </Flex>
                        </Flex>
                      </Flex>
                    </Card>

                    <LibraryStepsContainerField />
                  </Flex>
                </FormContainer>
              </Flex>
              {/* post guidelines container */}
              <Flex
                sx={{
                  flexDirection: 'column',
                  width: ['100%', '100%', `${100 / 3}%`],
                  height: 'auto',
                  position: ['relative', 'relative', 'sticky'],
                  top: 3,
                  alignSelf: 'flex-start',
                }}
                bg="inherit"
                px={2}
                mt={[0, 0, 4]}
              >
                <Box
                  sx={{
                    maxWidth: ['inherit', 'inherit', '400px'],
                  }}
                >
                  <Box sx={{ display: ['none', 'none', 'block'] }}>
                    <LibraryPostingGuidelines />
                  </Box>

                  <Flex sx={{ flexDirection: 'column', alignItems: 'center' }}>
                    <Button
                      data-cy="draft"
                      mt={[0, 0, 3]}
                      variant="secondary"
                      type="submit"
                      disabled={submitting}
                      sx={{ width: '100%', display: 'block' }}
                      form={formId}
                    >
                      <span>{buttons.draft.create}</span>
                    </Button>
                    <Text sx={{ fontSize: 1, textAlign: 'center' }}>
                      {buttons.draft.description}
                    </Text>
                  </Flex>

                  <LibraryButtonPublish
                    form={form}
                    formId={formId}
                    submitting={submitting}
                  />

                  <LibraryErrors
                    errors={errors}
                    isVisible={!!saveErrorMessage}
                  />
                </Box>
              </Flex>
            </Flex>
          )
        }}
      />
    </>
  )
}
