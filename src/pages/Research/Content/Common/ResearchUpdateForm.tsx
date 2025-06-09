import { useEffect, useState } from 'react'
import { Form } from 'react-final-form'
import { useNavigate } from 'react-router'
import { Button, ConfirmModal, ResearchEditorOverview } from 'oa-components'
import { ErrorsContainer } from 'src/common/Form/ErrorsContainer'
import { FormWrapper } from 'src/common/Form/FormWrapper'
import { UnsavedChangesDialog } from 'src/common/Form/UnsavedChangesDialog'
import { logger } from 'src/logger'
import { fireConfetti } from 'src/utils/fireConfetti'

import { FilesFields } from '../../../common/FormFields/FilesFields'
import { buttons, headings } from '../../labels'
import { researchService } from '../../research.service'
import { DescriptionField } from '../CreateResearch/Form/DescriptionField'
import { ResearchImagesField } from '../CreateResearch/Form/ResearchImagesField'
import { TitleField } from '../CreateResearch/Form/TitleField'
import VideoUrlField from '../CreateResearch/Form/VideoUrlField'

import type {
  MediaFile,
  ResearchItem,
  ResearchUpdate,
  ResearchUpdateFormData,
} from 'oa-shared'

interface IProps {
  research: ResearchItem
  researchUpdate?: ResearchUpdate
  files?: MediaFile[]
  fileLink?: string
}

export const ResearchUpdateForm = (props: IProps) => {
  const { research, researchUpdate, files, fileLink } = props
  const navigate = useNavigate()
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [intentionalNavigation, setIntentionalNavigation] = useState(false)
  const id = researchUpdate?.id || null
  const [initialValues, setInitialValues] = useState<ResearchUpdateFormData>({
    title: '',
    description: '',
    existingImages: [],
    existingFiles: [],
    fileLink: '',
    videoUrl: '',
    files: [],
    images: [],
  })

  useEffect(() => {
    if (researchUpdate) {
      setInitialValues({
        title: researchUpdate?.title,
        description: researchUpdate?.description,
        existingImages: researchUpdate?.images || [],
        existingFiles: files,
        fileLink: fileLink,
        videoUrl: researchUpdate?.videoUrl || '',
        files: [],
        images: [],
      })
    }
  }, [researchUpdate])

  const onSubmit = async (
    formData: ResearchUpdateFormData,
    isDraft = false,
  ) => {
    if (isSaving) {
      return
    }
    setIsSaving(true)
    setIntentionalNavigation(true)
    setSaveErrorMessage(null)

    try {
      const result = await researchService.upsertUpdate(
        research.id,
        id,
        formData,
        isDraft,
      )

      if (!isDraft) {
        fireConfetti()
      }

      if (result) {
        setTimeout(() => {
          navigate(
            `/research/${research.slug}#update_${result.researchUpdate.id}`,
          )
        }, 100)
      }
    } catch (error) {
      setSaveErrorMessage(error.message)
      logger.error(error)
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!researchUpdate) {
      return
    }
    setShowDeleteModal(false)
    await researchService.deleteUpdate(props.research.id, researchUpdate.id)
    window.location.assign('/research/' + props.research.slug)
  }

  const isEdit = !!researchUpdate
  const heading = isEdit ? headings.update.edit : headings.update.create

  const removeExistingImage = (index: number) => {
    setInitialValues((prevState: ResearchUpdateFormData) => {
      return {
        ...prevState,
        existingImages:
          prevState.existingImages?.filter((_, i) => i !== index) ?? null,
      }
    })
  }

  const removeExistingFile = (id: string) => {
    setInitialValues((prevState: ResearchUpdateFormData) => {
      return {
        ...prevState,
        existingFiles:
          prevState.existingFiles?.filter((file) => file.id !== id) ?? null,
      }
    })
  }

  return (
    <>
      <Form<ResearchUpdateFormData>
        onSubmit={async (values) => await onSubmit(values)}
        initialValues={initialValues}
        validateOnBlur
        render={({
          dirty,
          handleSubmit,
          hasValidationErrors,
          errors,
          valid,
          submitSucceeded,
          submitting,
          values,
        }) => {
          const saveError = saveErrorMessage && (
            <ErrorsContainer errors={[saveErrorMessage]} />
          )

          const numberOfImageInputsAvailable = (values as any)?.images
            ? Math.min((values as any).images.filter((x) => !!x).length + 1, 10)
            : 1

          const unsavedChangesDialog = (
            <UnsavedChangesDialog
              hasChanges={dirty && !submitSucceeded && !intentionalNavigation}
            />
          )

          const sidebar = (
            <>
              <Button
                data-cy="draft"
                variant="secondary"
                type="submit"
                disabled={isSaving}
                onClick={() => onSubmit(values, true)}
                sx={{
                  alignSelf: 'stretch',
                  justifyContent: 'center',
                }}
              >
                {buttons.draft}
              </Button>

              {isEdit ? (
                <Button
                  data-cy="delete"
                  onClick={(evt) => {
                    setShowDeleteModal(true)
                    evt.preventDefault()
                  }}
                  variant="destructive"
                  type="submit"
                  disabled={isSaving || submitting}
                  sx={{ alignSelf: 'stretch', justifyContent: 'center' }}
                >
                  {buttons.deletion.text}
                </Button>
              ) : null}

              {hasValidationErrors && errors && (
                <ErrorsContainer
                  errors={Object.values(errors).map((value) => String(value))}
                />
              )}

              {props.research && (
                <ResearchEditorOverview
                  updates={getResearchUpdates(
                    props.research.updates || [],
                    !isEdit,
                    values.title,
                  )}
                  researchSlug={props.research?.slug}
                  showCreateUpdateButton={isEdit}
                  showBackToResearchButton={true}
                />
              )}
            </>
          )

          return (
            <FormWrapper
              buttonLabel={buttons.publish}
              contentType="researchUpdate"
              handleSubmit={handleSubmit}
              heading={heading}
              saveError={saveError}
              sidebar={sidebar}
              submitting={submitting}
              unsavedChangesDialog={unsavedChangesDialog}
              valid={valid}
            >
              <TitleField />
              <DescriptionField />
              <ResearchImagesField
                inputsAvailable={numberOfImageInputsAvailable}
                existingImages={initialValues.existingImages}
                removeExistingImage={removeExistingImage}
              />
              <VideoUrlField />
              <FilesFields
                files={initialValues?.existingFiles || []}
                deleteFile={removeExistingFile}
              />
            </FormWrapper>
          )
        }}
      />
      <ConfirmModal
        isOpen={showDeleteModal}
        message={buttons.deletion.message}
        confirmButtonText={buttons.deletion.confirm}
        handleCancel={() => setShowDeleteModal(false)}
        handleConfirm={handleDelete}
      />
    </>
  )
}

const getResearchUpdates = (
  updates: ResearchUpdate[],
  isCreating: boolean,
  researchTitle: string,
): any[] =>
  [
    ...updates
      .filter((u) => !u.deleted)
      .map((u) => ({
        title: u.title,
        isDraft: u.isDraft,
        slug: u.id,
        id: u.id,
      })),
    isCreating
      ? {
          title: researchTitle,
          isDraft: true,
          slug: null,
        }
      : null,
  ].filter(Boolean)
