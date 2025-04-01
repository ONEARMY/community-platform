import { useEffect, useState } from 'react'
import { Form } from 'react-final-form'
import {
  Button,
  ConfirmModal,
  ElWithBeforeIcon,
  ResearchEditorOverview,
} from 'oa-components'
import { ResearchUpdateStatus } from 'oa-shared'
import IconHeaderHowto from 'src/assets/images/header-section/howto-header-icon.svg'
import { UnsavedChangesDialog } from 'src/common/Form/UnsavedChangesDialog'
import { Box, Card, Flex, Heading } from 'theme-ui'

import { buttons, headings, update } from '../../labels'
import { researchService } from '../../research.service'
import { DescriptionField } from '../CreateResearch/Form/DescriptionField'
import { FilesFields } from '../CreateResearch/Form/FilesFields'
import { ResearchImagesField } from '../CreateResearch/Form/ResearchImagesField'
// import { FilesFields } from '../CreateResearch/Form/FilesFields'
import { TitleField } from '../CreateResearch/Form/TitleField'
import VideoUrlField from '../CreateResearch/Form/VideoUrlField'
import { ResearchErrors } from './ResearchErrors'
import { SubmitStatus } from './SubmitStatus'

import type {
  ResearchItem,
  ResearchUpdate,
  ResearchUpdateFormData,
} from 'src/models/research.model'

interface IProps {
  research: ResearchItem
  researchUpdate: ResearchUpdate | null
}

export const ResearchUpdateForm = (props: IProps) => {
  const { research, researchUpdate } = props
  const [formState, setFormState] = useState<{ dirty: boolean }>({
    dirty: false,
  })
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [complete, setComplete] = useState(false)
  const id = props.researchUpdate?.id || null
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
        existingFiles: researchUpdate?.files || [],
        fileLink: researchUpdate?.fileLink || '',
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
    setShowSubmitModal(true)

    // if (formData.fileLink && formData.files && formData.files.length > 0) {
    //   return setInvalidFileWarning(true)
    // }

    // setInvalidFileWarning(false)

    try {
      await researchService.upsertUpdate(research.id, id, formData, isDraft)
    } catch (err) {
      console.error(err)
    }

    setComplete(true)
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
  const publishButtonText = isEdit ? 'Save' : 'Add update'
  const pageTitle = isEdit ? headings.update.edit : headings.update.create

  const removeExistingImage = (index: number) => {
    setInitialValues((prevState: ResearchUpdateFormData) => {
      return {
        ...prevState,
        existingImages:
          prevState.existingImages?.filter((_, i) => i !== index) ?? null,
      }
    })
  }

  const removeExistingFile = (index: number) => {
    setInitialValues((prevState: ResearchUpdateFormData) => {
      return {
        ...prevState,
        existingFiles:
          prevState.existingFiles?.filter((_, i) => i !== index) ?? null,
      }
    })
  }

  return (
    <>
      <SubmitStatus
        complete={complete}
        isOpen={showSubmitModal}
        type="Research Update"
        slug={props.research.slug}
        onClose={() => {
          setShowSubmitModal(false)
          setComplete(false)
        }}
      />
      <Form<ResearchUpdateFormData>
        onSubmit={(v) => onSubmit(v)}
        initialValues={initialValues}
        validateOnBlur
        render={({
          dirty,
          handleSubmit,
          hasValidationErrors,
          errors,
          submitSucceeded,
          submitting,
          submitFailed,
          values,
        }) => {
          if (formState.dirty !== dirty) {
            setFormState({ dirty })
          }

          const numberOfImageInputsAvailable = (values as any)?.images
            ? Math.min((values as any).images.filter((x) => !!x).length + 1, 10)
            : 1

          return (
            <Flex
              sx={{
                mx: -2,
                mb: 4,
                bg: 'inherit',
                flexWrap: 'wrap',
              }}
              data-testid="EditResearchUpdate"
            >
              <UnsavedChangesDialog hasChanges={dirty && !submitSucceeded} />
              <Flex
                sx={{
                  bg: 'inherit',
                  px: 2,
                  width: ['100%', '100%', `${(2 / 3) * 100}%`],
                  mt: 4,
                }}
              >
                <form
                  id="updateForm"
                  onSubmit={handleSubmit}
                  style={{ width: '100%' }}
                >
                  {/* Update Info */}
                  <Flex sx={{ flexDirection: 'column' }}>
                    <Card sx={{ bg: 'softblue' }}>
                      <Flex sx={{ px: 3, py: 2, alignItems: 'center' }}>
                        <Heading>
                          <span>{pageTitle}</span>{' '}
                        </Heading>
                        <Box sx={{ ml: '15px' }}>
                          <ElWithBeforeIcon icon={IconHeaderHowto} size={20} />
                        </Box>
                      </Flex>
                    </Card>
                    <Card sx={{ mt: 3 }}>
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
                            <TitleField />
                            <DescriptionField />
                            <ResearchImagesField
                              inputsAvailable={numberOfImageInputsAvailable}
                              existingImages={initialValues.existingImages}
                              removeExistingImage={removeExistingImage}
                            />
                            <VideoUrlField />
                            <FilesFields
                              files={initialValues?.files || []}
                              deleteFile={removeExistingFile}
                              showInvalidFileWarning={false}
                            />
                          </Flex>
                        </Flex>
                      </Flex>
                    </Card>
                  </Flex>
                </form>
              </Flex>
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
                <Flex
                  sx={{
                    flexDirection: 'column',
                    position: ['relative', 'relative', 'sticky'],
                    gap: 3,
                    maxWidth: ['inherit', 'inherit', '400px'],
                  }}
                >
                  <Button
                    large
                    id="submit-form"
                    data-testid="submit-form"
                    data-cy="submit"
                    variant="primary"
                    type="submit"
                    disabled={submitting}
                    onClick={() => onSubmit(values)}
                    sx={{
                      alignSelf: 'stretch',
                      justifyContent: 'center',
                    }}
                  >
                    {publishButtonText}
                  </Button>

                  <Button
                    data-cy="draft"
                    variant="secondary"
                    type="submit"
                    disabled={submitting}
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
                      disabled={submitting}
                      sx={{ alignSelf: 'stretch', justifyContent: 'center' }}
                    >
                      {buttons.deletion.text}
                    </Button>
                  ) : null}

                  <ResearchErrors
                    errors={errors}
                    isVisible={submitFailed && hasValidationErrors}
                    labels={update}
                  />

                  {props.research ? (
                    <ResearchEditorOverview
                      sx={{ mt: 2 }}
                      updates={getResearchUpdates(
                        props.research.updates || [],
                        !isEdit,
                        values.title,
                      )}
                      researchSlug={props.research?.slug}
                      showCreateUpdateButton={isEdit}
                      showBackToResearchButton={true}
                    />
                  ) : null}
                </Flex>
              </Flex>
              <ConfirmModal
                isOpen={showDeleteModal}
                message={buttons.deletion.message}
                confirmButtonText={buttons.deletion.confirm}
                handleCancel={() => setShowDeleteModal(false)}
                handleConfirm={handleDelete}
              />
            </Flex>
          )
        }}
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
        status: u.status,
        slug: u.id,
      })),
    isCreating
      ? {
          title: researchTitle,
          status: ResearchUpdateStatus.DRAFT,
          slug: null,
        }
      : null,
  ].filter(Boolean)
