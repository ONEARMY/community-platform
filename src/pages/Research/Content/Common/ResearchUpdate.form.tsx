import { useCallback, useEffect, useState } from 'react'
import { Form } from 'react-final-form'
import styled from '@emotion/styled'
import arrayMutators from 'final-form-arrays'
import { observer } from 'mobx-react'
import {
  Button,
  ConfirmModal,
  ElWithBeforeIcon,
  ResearchEditorOverview,
} from 'oa-components'
import { IModerationStatus, ResearchUpdateStatus } from 'oa-shared'
import IconHeaderHowto from 'src/assets/images/header-section/howto-header-icon.svg'
import { UnsavedChangesDialog } from 'src/common/Form/UnsavedChangesDialog'
import { useResearchStore } from 'src/stores/Research/research.store'
import {
  setAllowDraftSaveFalse,
  setAllowDraftSaveTrue,
} from 'src/utils/validators'
import { Box, Card, Flex, Heading } from 'theme-ui'

import { buttons, headings, update } from '../../labels'
import { DescriptionField } from '../CreateResearch/Form/DescriptionField'
import { FilesFields } from '../CreateResearch/Form/FilesFields'
import { MediaFields } from '../CreateResearch/Form/MediaFields'
import { TitleField } from '../CreateResearch/Form/TitleField'
import { ResearchErrors } from './ResearchErrors'
import { UpdateSubmitStatus } from './SubmitStatus'

import type { IResearch, IResearchDB } from 'oa-shared'
import type { MainFormAction } from 'src/common/Form/types'

const CONFIRM_DIALOG_MSG =
  'You have unsaved changes. Are you sure you want to leave this page?'

interface IProps {
  research: IResearchDB
  formValues: any
  parentType: MainFormAction
  redirectUrl?: string
}

const FormContainer = styled.form`
  width: 100%;
`

const beforeUnload = (e) => {
  e.preventDefault()
  e.returnValue = CONFIRM_DIALOG_MSG
}

export const ResearchUpdateForm = observer((props: IProps) => {
  const { formValues, parentType, redirectUrl } = props
  const { deletion, draft } = buttons

  const store = useResearchStore()
  const [formState, setFormState] = useState<{ dirty: boolean }>({
    dirty: false,
  })
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false)
  const [showInvalidFileWarning, setInvalidFileWarning] =
    useState<boolean>(false)
  const [isDraft, setIsDraft] = useState<boolean>(
    formValues.status === ResearchUpdateStatus.DRAFT,
  )

  useEffect(() => {
    if (store.updateUploadStatus?.Complete) {
      window.removeEventListener('beforeunload', beforeUnload, false)
    }
  }, [store.updateUploadStatus?.Complete])

  const trySubmitForm = (isDraft: boolean) => {
    const form = document.getElementById('updateForm')
    setIsDraft(isDraft)
    setTimeout(() => {
      if (typeof form !== 'undefined' && form !== null) {
        form.dispatchEvent(
          new Event('submit', { cancelable: true, bubbles: true }),
        )
      }
    }, 0)
  }

  const onSubmit = async (formValues: IResearch.Update) => {
    setShowSubmitModal(true)

    if (
      formValues.fileLink &&
      formValues.files &&
      formValues.files.length > 0
    ) {
      return setInvalidFileWarning(true)
    }

    setInvalidFileWarning(false)

    await store.uploadUpdate(props.research, {
      ...formValues,
      collaborators: Array.from(
        new Set(
          [
            ...(formValues?.collaborators || []),
            store.activeUser?.userName || '',
          ].filter(Boolean),
        ),
      ),
      status: isDraft
        ? ResearchUpdateStatus.DRAFT
        : ResearchUpdateStatus.PUBLISHED,
    })
  }

  const handleDelete = async (_updateId: string) => {
    setShowDeleteModal(false)
    await store.deleteUpdate(props.research, _updateId)
    if (redirectUrl) {
      window.location.assign(redirectUrl)
    }
  }

  // Display a confirmation dialog when leaving the page outside the React Router
  const unloadDecorator = useCallback(
    (form) => {
      return form.subscribe(
        ({ dirty }) => {
          if (dirty && !store.updateUploadStatus.Complete) {
            window.addEventListener('beforeunload', beforeUnload, false)
            return
          }
          window.removeEventListener('beforeunload', beforeUnload, false)
        },
        { dirty: true },
      )
    },
    [store.updateUploadStatus.Complete, beforeUnload],
  )

  const draftButtonText =
    formValues.moderation !== IModerationStatus.DRAFT
      ? draft.create
      : draft.update
  const isEdit = parentType === 'edit'
  const publishButtonText = isEdit ? 'Save' : 'Add update'
  const pageTitle = headings.update[parentType]

  return (
    <>
      {showSubmitModal && (
        <UpdateSubmitStatus
          slug={props.research.slug}
          onClose={() => {
            setShowSubmitModal(false)
            store.resetUpdateUploadStatus()
          }}
        />
      )}
      <Form
        onSubmit={async (v) => await onSubmit(v as IResearch.Update)}
        initialValues={formValues}
        mutators={{
          setAllowDraftSaveFalse,
          setAllowDraftSaveTrue,
          ...arrayMutators,
        }}
        validateOnBlur
        decorators={[unloadDecorator]}
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

          return (
            <Flex
              mx={-2}
              mb={4}
              bg={'inherit'}
              sx={{ flexWrap: 'wrap' }}
              data-testid="EditResearchUpdate"
            >
              <UnsavedChangesDialog hasChanges={dirty && !submitSucceeded} />
              <Flex
                bg="inherit"
                px={2}
                sx={{ width: ['100%', '100%', `${(2 / 3) * 100}%`] }}
                mt={4}
              >
                <FormContainer id="updateForm" onSubmit={handleSubmit}>
                  {/* Update Info */}
                  <Flex sx={{ flexDirection: 'column' }}>
                    <Card sx={{ bg: 'softblue' }}>
                      <Flex px={3} py={2} sx={{ alignItems: 'center' }}>
                        <Heading>
                          <span>{pageTitle}</span>{' '}
                        </Heading>
                        <Box ml="15px">
                          <ElWithBeforeIcon icon={IconHeaderHowto} size={20} />
                        </Box>
                      </Flex>
                    </Card>
                    <Card mt={3}>
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
                            <TitleField />
                            <DescriptionField />
                            <MediaFields values={values} />
                            <FilesFields
                              parentType={parentType}
                              formValues={formValues}
                              showInvalidFileWarning={showInvalidFileWarning}
                            />
                          </Flex>
                        </Flex>
                      </Flex>
                    </Card>
                  </Flex>
                </FormContainer>
              </Flex>
              <Flex
                sx={{
                  flexDirection: 'column',
                  width: ['100%', '100%', `${100 / 3}%`],
                  height: '100%',
                }}
                bg="inherit"
                px={2}
                mt={[0, 0, 4]}
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
                    onClick={(evt) => {
                      trySubmitForm(false)
                      evt.preventDefault()
                    }}
                    variant="primary"
                    type="submit"
                    disabled={submitting}
                    sx={{
                      alignSelf: 'stretch',
                      justifyContent: 'center',
                    }}
                  >
                    {publishButtonText}
                  </Button>

                  <Button
                    data-cy="draft"
                    onClick={() => {
                      trySubmitForm(true)
                    }}
                    variant="secondary"
                    type="submit"
                    sx={{
                      alignSelf: 'stretch',
                      justifyContent: 'center',
                    }}
                    disabled={submitting}
                  >
                    {draftButtonText}
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
                      {deletion.text}
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
                        props.research._id,
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
                message={deletion.message}
                confirmButtonText={deletion.confirm}
                handleCancel={() => setShowDeleteModal(false)}
                handleConfirm={() =>
                  handleDelete && handleDelete(formValues._id)
                }
              />
            </Flex>
          )
        }}
      />
    </>
  )
})

const getResearchUpdates = (
  updates,
  activeResearchId: string,
  isCreating: boolean,
  researchTitle: string,
): any[] =>
  [
    ...updates
      .filter((u) => !u._deleted)
      .map((u) => ({
        isActive: u._id === activeResearchId,
        title: u.title,
        status: u.status,
        slug: u._id,
      })),
    isCreating
      ? {
          isActive: false,
          title: researchTitle,
          status: ResearchUpdateStatus.DRAFT,
          slug: null,
        }
      : null,
  ].filter(Boolean)
