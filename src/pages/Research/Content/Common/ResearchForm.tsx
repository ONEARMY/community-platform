import { useEffect, useState } from 'react'
import { Form } from 'react-final-form'
import { useNavigate } from 'react-router'
import arrayMutators from 'final-form-arrays'
import { Button, ResearchEditorOverview } from 'oa-components'
import {
  type ResearchFormData,
  type ResearchItem,
  ResearchStatus,
} from 'oa-shared'
import { FormWrapper } from 'src/common/Form/FormWrapper'
import { UnsavedChangesDialog } from 'src/common/Form/UnsavedChangesDialog'
import { logger } from 'src/logger'
import { TagsField } from 'src/pages/common/FormFields'
import {
  ResearchErrors,
  ResearchPostingGuidelines,
} from 'src/pages/Research/Content/Common'

import { buttons, headings, overview } from '../../labels'
import { researchService } from '../../research.service'
import { ResearchImageField } from '../CreateResearch/Form/ResearchImageField'
import { ResearchCollaboratorsField } from './FormFields/ResearchCollaboratorsField'
import { ResearchDescriptionField } from './FormFields/ResearchDescriptionField'
import { ResearchStatusField } from './FormFields/ResearchStatusField'
import { ResearchTitleField } from './FormFields/ResearchTitleField'
import ResearchFieldCategory from './ResearchCategorySelect'

interface IProps {
  research?: ResearchItem
}

const ResearchForm = ({ research }: IProps) => {
  const [initialValues, setInitialValues] = useState<Partial<ResearchFormData>>(
    {
      status: ResearchStatus.IN_PROGRESS,
    },
  )
  const navigate = useNavigate()
  const [intentionalNavigation, setIntentionalNavigation] = useState(false)
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (research) {
      setInitialValues({
        title: research?.title,
        description: research?.description,
        status: research?.status || ResearchStatus.IN_PROGRESS,
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

  const onSubmit = async (values: ResearchFormData, isDraft = false) => {
    setIntentionalNavigation(true)
    setSaveErrorMessage(null)

    try {
      const result = await researchService.upsert(
        research?.id || null,
        values,
        isDraft,
      )

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

  const removeImage = () => {
    setInitialValues({
      ...initialValues!,
      existingImage: null,
    })
  }

  const heading = research ? headings.overview.edit : headings.overview.create

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
        valid,
        handleSubmit,
        submitting,
        submitSucceeded,
      }) => {
        const saveError = saveErrorMessage && (
          <ResearchErrors
            errors={errors}
            isVisible={!!saveErrorMessage}
            labels={overview}
          />
        )

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
            guidelines={<ResearchPostingGuidelines />}
            handleSubmit={handleSubmit}
            heading={heading}
            saveError={saveError}
            sidebar={sidebar}
            submitting={submitting}
            unsavedChangesDialog={unsavedChangesDialog}
            valid={valid}
          >
            <ResearchTitleField />
            <ResearchDescriptionField />
            <ResearchFieldCategory />
            <TagsField title={overview.tags.title} />
            <ResearchCollaboratorsField />
            <ResearchStatusField />
            <ResearchImageField
              label="Cover Image"
              existingImage={initialValues?.existingImage || null}
              remove={removeImage}
            />
          </FormWrapper>
        )
      }}
    />
  )
}

export default ResearchForm
