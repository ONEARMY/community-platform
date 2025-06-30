import { useEffect, useState } from 'react'
import { Form } from 'react-final-form'
import { useNavigate } from 'react-router'
import arrayMutators from 'final-form-arrays'
import { Button, ResearchEditorOverview } from 'oa-components'
import { FormWrapper } from 'src/common/Form/FormWrapper'
import { UnsavedChangesDialog } from 'src/common/Form/UnsavedChangesDialog'
import { logger } from 'src/logger'
import { TagsField } from 'src/pages/common/FormFields'
import { ImageField } from 'src/pages/common/FormFields/ImageField'
import { errorSet } from 'src/pages/Library/Content/utils/transformLibraryErrors'
import { ResearchPostingGuidelines } from 'src/pages/Research/Content/Common'
import { fireConfetti } from 'src/utils/fireConfetti'
import { Text } from 'theme-ui'

import { buttons, headings, overview } from '../../labels'
import { researchService } from '../../research.service'
import { ResearchCollaboratorsField } from './FormFields/ResearchCollaboratorsField'
import { ResearchDescriptionField } from './FormFields/ResearchDescriptionField'
import { ResearchTitleField } from './FormFields/ResearchTitleField'
import ResearchFieldCategory from './ResearchCategorySelect'

import type { ResearchFormData, ResearchItem, ResearchStatus } from 'oa-shared'

interface IProps {
  research?: ResearchItem
}

const ResearchForm = ({ research }: IProps) => {
  const [initialValues, setInitialValues] = useState<ResearchFormData>()
  const navigate = useNavigate()
  const [intentionalNavigation, setIntentionalNavigation] = useState(false)
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (research) {
      setInitialValues({
        title: research?.title,
        description: research?.description,
        category: research?.category
          ? {
              value: research.category.id?.toString(),
              label: research.category.name,
            }
          : undefined,
        collaborators: Array.isArray(research?.collaboratorsUsernames)
          ? research.collaboratorsUsernames
          : [],
        tags: research?.tagIds || [],
        existingImage: research?.image,
        image: undefined,
      })
    }
  }, [research])

  const updateStatus = async (status: ResearchStatus) => {
    try {
      await researchService.updateResearchStatus(research!.id, status)
      navigate(`/research/${research!.slug}`)
    } catch (err) {
      setSaveErrorMessage('Error updating research status')
    }
  }

  const onSubmit = async (values: ResearchFormData, isDraft = false) => {
    setIntentionalNavigation(true)
    setSaveErrorMessage(null)

    try {
      const result = await researchService.upsert(
        research?.id || null,
        values,
        isDraft,
      )

      if (!isDraft) {
        fireConfetti()
      }

      setTimeout(() => {
        navigate(`/research/${result.research.slug}`)
      }, 100)
    } catch (e) {
      if (e.cause && e.message) {
        setSaveErrorMessage(e.message)
      }
      logger.error(e)
    }
  }

  const heading = research ? headings.overview.edit : headings.overview.create

  return (
    <Form<ResearchFormData>
      onSubmit={async (values) => await onSubmit(values)}
      initialValues={initialValues}
      mutators={{
        ...arrayMutators,
      }}
      validate={(values) => {
        const errors = {}
        if (values.image == null && values.existingImage === null) {
          errors['image'] = 'An image is required (either new or existing).'
        }
        return errors
      }}
      validateOnBlur
      render={({
        errors,
        dirty,
        handleSubmit,
        hasValidationErrors,
        submitFailed,
        submitting,
        submitSucceeded,
        values,
        valid,
      }) => {
        const errorsClientSide = [errorSet(errors, overview)]

        const sidebar = (
          <>
            <Button
              data-cy="draft"
              onClick={() => onSubmit(values, true)}
              variant="secondary"
              type="submit"
              disabled={submitting || !valid}
              sx={{
                width: '100%',
                display: 'block',
              }}
            >
              <span>{buttons.draft}</span>
            </Button>

            {research?.id && (
              <Button
                data-cy="draft"
                onClick={() =>
                  updateStatus(
                    research?.status === 'complete'
                      ? 'in-progress'
                      : 'complete',
                  )
                }
                variant={research?.status === 'complete' ? 'info' : 'success'}
                type="submit"
                disabled={!research?.id}
                sx={{
                  width: '100%',
                  display: 'block',
                }}
              >
                <span>
                  {research?.status === 'complete'
                    ? buttons.markInProgress
                    : buttons.markCompleted}
                </span>
              </Button>
            )}

            {submitting && <Text>Submitting...</Text>}

            {research?.updates && (
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
            )}
          </>
        )
        const unsavedChangesDialog = (
          <UnsavedChangesDialog
            hasChanges={dirty && !submitSucceeded && !intentionalNavigation}
          />
        )

        return (
          <FormWrapper
            buttonLabel={buttons.publish}
            contentType="research"
            errorsClientSide={errorsClientSide}
            errorSubmitting={saveErrorMessage}
            guidelines={<ResearchPostingGuidelines />}
            handleSubmit={handleSubmit}
            hasValidationErrors={hasValidationErrors}
            heading={heading}
            sidebar={sidebar}
            submitFailed={submitFailed}
            submitting={submitting}
            unsavedChangesDialog={unsavedChangesDialog}
          >
            <ResearchTitleField />
            <ResearchDescriptionField />
            <ResearchFieldCategory />
            <TagsField title={overview.tags.title} />
            <ResearchCollaboratorsField />
            <ImageField title="Cover Image" />
          </FormWrapper>
        )
      }}
    />
  )
}

export default ResearchForm
