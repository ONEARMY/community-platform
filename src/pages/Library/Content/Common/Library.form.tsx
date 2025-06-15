import { useMemo, useState } from 'react'
import { Form } from 'react-final-form'
import styled from '@emotion/styled'
import { useNavigate } from '@remix-run/react'
import arrayMutators from 'final-form-arrays'
import { Button, ElWithBeforeIcon } from 'oa-components'
import IconHeaderHowto from 'src/assets/images/header-section/howto-header-icon.svg'
import { ErrorsContainer } from 'src/common/Form/ErrorsContainer'
import { UnsavedChangesDialog } from 'src/common/Form/UnsavedChangesDialog'
import { logger } from 'src/logger'
import { FilesFields } from 'src/pages/common/FormFields/FilesFields'
import { ImageField } from 'src/pages/common/FormFields/ImageField'
import { Box, Card, Flex, Heading, Text } from 'theme-ui'

import { buttons, headings, intro } from '../../labels'
import { libraryService } from '../../library.service'
import { LibraryCategoryField } from './LibraryCategory.field'
import { LibraryDescriptionField } from './LibraryDescription.field'
import { LibraryDifficultyField } from './LibraryDifficulty.field'
import { LibraryPostingGuidelines } from './LibraryPostingGuidelines'
import { LibraryStepsContainerField } from './LibraryStepsContainer.field'
import { LibraryTagsField } from './LibraryTags.field'
import { LibraryTimeField } from './LibraryTime.field'
import { LibraryTitleField } from './LibraryTitle.field'

import type { MediaFile, Project, ProjectFormData } from 'oa-shared'

interface LibraryFormProps {
  project?: Project
  files?: MediaFile[]
  fileLink?: string
}

const FormContainer = styled.form`
  width: 100%;
`
export const LibraryForm = ({ project, files, fileLink }: LibraryFormProps) => {
  const navigate = useNavigate()
  const [intentionalNavigation, setIntentionalNavigation] = useState(false)
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null)

  const formValues = useMemo<ProjectFormData>(
    () => ({
      title: project?.title || '',
      description: project?.description || '',
      category: project?.category
        ? {
            value: project.category.id?.toString(),
            label: project.category.name,
          }
        : undefined,
      tags: project?.tagIds || [],
      time: project?.time,
      difficultyLevel: project?.difficultyLevel,
      existingImage: project?.coverImage || null,
      existingFiles: files,
      fileLink: fileLink,
      steps: project?.steps
        ?.toSorted((a, b) => a.order - b.order)
        .map((x) => ({
          id: x.id,
          title: x.title,
          description: x.description,
          videoUrl: x.videoUrl || undefined,
          images: [],
          existingImages: x.images,
        })) ?? [
        { title: '', description: '', images: [], existingImages: [] },
        { title: '', description: '', images: [], existingImages: [] },
        { title: '', description: '', images: [], existingImages: [] },
      ],
    }),
    [project],
  )

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
      return
    }
  }

  return (
    <Form<ProjectFormData>
      onSubmit={() => {}}
      initialValues={formValues}
      mutators={{
        ...arrayMutators,
      }}
      validateOnBlur
      enableReinitialize={true}
      render={({
        dirty,
        valid,
        values,
        handleSubmit,
        submitSucceeded,
        submitting,
      }) => {
        return (
          <Flex
            sx={{ backgroundColor: 'inherit', marginx: -2, flexWrap: 'wrap' }}
          >
            <UnsavedChangesDialog
              hasChanges={dirty && !submitSucceeded && !intentionalNavigation}
            />
            <Flex
              sx={{
                backgroundColor: 'inherit',
                paddingX: 2,
                marginTop: 4,
                width: ['100%', '100%', `${(2 / 3) * 100}%`],
              }}
            >
              <FormContainer id={formId} onSubmit={handleSubmit}>
                {/* Project Info */}
                <Flex sx={{ flexDirection: 'column' }}>
                  <Card sx={{ backgroundColor: 'softblue' }}>
                    <Flex
                      sx={{ paddingX: 3, paddingY: 2, alignItems: 'center' }}
                    >
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
                    sx={{
                      marginTop: '20px',
                      display: ['block', 'block', 'none'],
                    }}
                  >
                    <LibraryPostingGuidelines />
                  </Box>
                  <Card sx={{ marginTop: 3 }}>
                    <Flex
                      sx={{
                        flexWrap: 'wrap',
                        flexDirection: 'column',
                        padding: 4,
                      }}
                    >
                      {/* Left Side */}
                      <Heading as="h2" variant="small" mb={3}>
                        {intro.heading.title}
                      </Heading>
                      <Flex
                        sx={{
                          marginX: -2,
                          flexDirection: ['column', 'column', 'row'],
                        }}
                      >
                        <Flex
                          sx={{
                            flexDirection: 'column',
                            flex: [1, 1, 4],
                            paddingX: 2,
                          }}
                        >
                          <LibraryTitleField />
                          <LibraryDescriptionField />
                          <LibraryCategoryField />
                          <LibraryTagsField />
                          <LibraryTimeField />
                          <LibraryDifficultyField />
                          <FilesFields />
                        </Flex>
                        {/* Right side */}
                        <Flex
                          sx={{
                            flexDirection: 'column',
                            flex: [1, 1, 3],
                            paddingX: 2,
                          }}
                          data-cy="intro-cover"
                        >
                          <ImageField title="Cover Image" />
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
                backgroundColor: 'inherit',
                paddingX: 2,
                marginTop: [0, 0, 4],
              }}
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
                    variant="secondary"
                    type="submit"
                    disabled={submitting}
                    sx={{ width: '100%', display: 'block', mt: [0, 0, 3] }}
                    onClick={() => onSubmit(values, true)}
                    form={formId}
                  >
                    <span>{buttons.draft.create}</span>
                  </Button>
                  <Text sx={{ fontSize: 1, textAlign: 'center', marginTop: 1 }}>
                    {buttons.draft.description}
                  </Text>
                </Flex>
                <Button
                  large
                  data-cy="submit"
                  data-testid="submit-form"
                  variant="primary"
                  type="submit"
                  disabled={submitting || !valid}
                  form={formId}
                  onClick={() => onSubmit(values)}
                  sx={{
                    width: '100%',
                    display: 'block',
                    marginBottom: ['40px', '40px', 0],
                    marginTop: 3,
                  }}
                >
                  {buttons.publish}
                </Button>
                {saveErrorMessage && (
                  <ErrorsContainer errors={[saveErrorMessage]} />
                )}
              </Box>
            </Flex>
          </Flex>
        )
      }}
    />
  )
}
