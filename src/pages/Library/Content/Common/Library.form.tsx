import { useMemo, useState } from 'react'
import { Form } from 'react-final-form'
import { useNavigate } from '@remix-run/react'
import arrayMutators from 'final-form-arrays'
import { Button } from 'oa-components'
import { ErrorsContainer } from 'src/common/Form/ErrorsContainer'
import { FormWrapper } from 'src/common/Form/FormWrapper'
import { UnsavedChangesDialog } from 'src/common/Form/UnsavedChangesDialog'
import { logger } from 'src/logger'
import { FilesFields } from 'src/pages/common/FormFields/FilesFields'
import { ImageField } from 'src/pages/common/FormFields/ImageField'
import { Flex } from 'theme-ui'

import { buttons, headings } from '../../labels'
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
      if (!isDraft) {
        if (!values.category?.value) {
          setSaveErrorMessage('Category is required')
          return
        } else if (!values.image && !values.existingImage?.id) {
          setSaveErrorMessage('An image is required')
          return
        }
      }

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
      onSubmit={(values) => onSubmit(values, false)}
      initialValues={formValues}
      mutators={{
        ...arrayMutators,
      }}
      validateOnBlur
      enableReinitialize={true}
      validate={(values) => {
        const errors = {}

        if (!values.category) {
          errors['category'] = 'Category is required.'
        }

        if (!values.image && !values.existingImage) {
          errors['existingImage'] =
            'An image is required (either new or existing).'
          errors['image'] = 'An image is required (either new or existing).'
        }

        return errors
      }}
      render={({
        dirty,
        valid,
        values,
        handleSubmit,
        submitSucceeded,
        submitting,
      }) => {
        const saveError = saveErrorMessage && (
          <ErrorsContainer errors={[saveErrorMessage]} />
        )

        const sidebar = (
          <Flex sx={{ flexDirection: 'column', alignItems: 'center' }}>
            <Button
              data-cy="draft"
              variant="secondary"
              type="submit"
              disabled={submitting}
              sx={{ width: '100%', display: 'block' }}
              onClick={() => onSubmit(values, true)}
              form={formId}
            >
              <span>{buttons.draft.create}</span>
            </Button>
          </Flex>
        )

        const unsavedChangesDialog = (
          <UnsavedChangesDialog
            hasChanges={dirty && !submitSucceeded && !intentionalNavigation}
          />
        )

        return (
          <>
            <FormWrapper
              buttonLabel={buttons.publish}
              contentType="research"
              guidelines={<LibraryPostingGuidelines />}
              handleSubmit={handleSubmit}
              heading={headingText}
              saveError={saveError}
              sidebar={sidebar}
              belowBody={
                <Flex sx={{ flexDirection: 'column' }}>
                  <LibraryStepsContainerField />
                </Flex>
              }
              submitting={submitting}
              unsavedChangesDialog={unsavedChangesDialog}
              valid={valid}
            >
              <Flex
                sx={{
                  gap: 4,
                  flexDirection: ['column', 'row'],
                }}
              >
                <Flex sx={{ flexDirection: 'column', gap: 2, flex: 1 }}>
                  <LibraryTitleField />
                  <LibraryDescriptionField />
                  <LibraryCategoryField />
                  <LibraryTagsField />
                  <LibraryTimeField />
                  <LibraryDifficultyField />
                  <FilesFields />
                </Flex>
                {/* Right side */}
                <Flex data-cy="intro-cover" sx={{ flex: 1, width: '100%' }}>
                  <ImageField title="Cover Image" />
                </Flex>
              </Flex>
            </FormWrapper>
          </>
        )
      }}
    />
  )
}
