import * as React from 'react'
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

import type { MainFormAction } from 'src/common/Form/types'
import type { IResearch } from 'src/models/research.models'

const CONFIRM_DIALOG_MSG =
  'You have unsaved changes. Are you sure you want to leave this page?'

interface IProps {
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
  const [formState, setFormState] = React.useState<{ dirty: boolean }>({
    dirty: false,
  })
  const [showDeleteModal, setShowDeleteModal] = React.useState(false)
  const [showSubmitModal, setShowSubmitModal] = React.useState<boolean>(false)
  const [showInvalidFileWarning, setInvalidFileWarning] =
    React.useState<boolean>(false)
  const [isDraft, setIsDraft] = React.useState<boolean>(
    formValues.status === ResearchUpdateStatus.DRAFT,
  )

  React.useEffect(() => {
    if (store.updateUploadStatus?.Complete) {
      window.removeEventListener('beforeunload', beforeUnload, false)
    }
  }, [store.updateUploadStatus?.Complete])

  // Managing locked state
  React.useEffect(() => {
    if (store.activeUser)
      store.lockResearchUpdate(store.activeUser.userName, formValues._id)

    return () => {
      store.unlockResearchUpdate(formValues._id)
    }
  }, [store.activeUser])

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

  const onSubmit = (formValues: IResearch.Update) => {
    setShowSubmitModal(true)
    if (formValues.fileLink && formValues.files && formValues.files.length > 0)
      return setInvalidFileWarning(true)
    else setInvalidFileWarning(false)

    store.uploadUpdate({
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
    await store.deleteUpdate(_updateId)
    if (redirectUrl) {
      window.location.assign(redirectUrl)
    }
  }

  // Display a confirmation dialog when leaving the page outside the React Router
  const unloadDecorator = React.useCallback(
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
          {...props}
          onClose={() => {
            setShowSubmitModal(false)
            store.resetUpdateUploadStatus()
          }}
        />
      )}
      <Form
        onSubmit={(v) => {
          onSubmit(v as IResearch.Update)
        }}
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
              <UnsavedChangesDialog
                uploadComplete={store.updateUploadStatus.Complete}
                message={CONFIRM_DIALOG_MSG}
              />
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
                            <TitleField
                              parentType={parentType}
                              formValues={formValues}
                            />
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
                <Box
                  sx={{
                    position: ['relative', 'relative', 'sticky'],
                    top: 3,
                    maxWidth: ['inherit', 'inherit', '400px'],
                  }}
                >
                  <Button
                    data-cy="draft"
                    onClick={() => {
                      trySubmitForm(true)
                    }}
                    variant="secondary"
                    type="submit"
                    disabled={submitting}
                    sx={{ width: '100%', display: 'block', mt: 0 }}
                  >
                    <span>{draftButtonText}</span>
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
                      sx={{ width: '100%', display: 'block', mt: 3 }}
                    >
                      {deletion.text}
                    </Button>
                  ) : null}
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
                      mt: 3,
                      mb: ['40px', '40px', 0],
                      width: '100%',
                      justifyContent: 'center',
                    }}
                  >
                    <span>{publishButtonText}</span>
                  </Button>

                  <ResearchErrors
                    errors={errors}
                    isVisible={submitFailed && hasValidationErrors}
                    labels={update}
                  />

                  {store.activeResearchItem ? (
                    <ResearchEditorOverview
                      sx={{ mt: 4 }}
                      updates={getResearchUpdates(
                        store.activeResearchItem.updates || [],
                        store.activeResearchItem._id,
                        !isEdit,
                        values.title,
                      )}
                      researchSlug={store.activeResearchItem?.slug}
                      showCreateUpdateButton={isEdit}
                      showBackToResearchButton={true}
                    />
                  ) : null}
                </Box>
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
