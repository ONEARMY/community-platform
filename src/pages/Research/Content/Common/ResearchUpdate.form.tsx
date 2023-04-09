import * as React from 'react'
import arrayMutators from 'final-form-arrays'
import { observer } from 'mobx-react'
import { Field, Form } from 'react-final-form'
import { Prompt } from 'react-router'
import { Box, Card, Flex, Heading, Label, Text } from 'theme-ui'
import styled from '@emotion/styled'
import {
  Button,
  FieldInput,
  FieldTextarea,
  ElWithBeforeIcon,
  ResearchEditorOverview,
  ConfirmModal,
  DownloadStaticFile,
} from 'oa-components'

import IconHeaderHowto from 'src/assets/images/header-section/howto-header-icon.svg'
import { ImageInputField } from 'src/common/Form/ImageInput.field'
import { FileInputField } from 'src/common/Form/FileInput.field'
import { useResearchStore } from 'src/stores/Research/research.store'
import { COMPARISONS } from 'src/utils/comparisons'
import {
  composeValidators,
  draftValidationWrapper,
  minValue,
  required,
  setAllowDraftSaveFalse,
  setAllowDraftSaveTrue,
  validateTitle,
} from 'src/utils/validators'
import { UpdateSubmitStatus } from './SubmitStatus'
import {
  RESEARCH_TITLE_MAX_LENGTH,
  RESEARCH_TITLE_MIN_LENGTH,
  RESEARCH_MAX_LENGTH,
} from '../../constants'
import { MAX_LINK_LENGTH } from '../../../constants'
import { buttons, errors, headings, update } from '../../labels'
import { ResearchErrors } from './ResearchErrors'

import type { RouteComponentProps } from 'react-router'
import type { IResearch } from 'src/models/research.models'
import type { ResearchEditorOverviewUpdate } from 'oa-components'

const ImageInputFieldWrapper = styled.div`
  width: 150px;
  height: 100px;
  margin-right: 10px;
  margin-bottom: 6px;
`

const CONFIRM_DIALOG_MSG =
  'You have unsaved changes. Are you sure you want to leave this page?'

interface IProps extends RouteComponentProps<any> {
  formValues: any
  parentType: 'create' | 'edit'
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
  const { description, fileLink, files, images, title, videoUrl } = update
  const { deletion, draft } = buttons

  const store = useResearchStore()
  const [showDeleteModal, setShowDeleteModal] = React.useState(false)
  const [showSubmitModal, setShowSubmitModal] = React.useState<boolean>(false)
  const [showInvalidFileWarning, setInvalidFileWarning] =
    React.useState<boolean>(false)
  const [isDraft, setIsDraft] = React.useState<boolean>(
    formValues.status === 'draft',
  )
  const [fileEditMode, setFileEditMode] = React.useState(false)

  React.useEffect(() => {
    if (store.updateUploadStatus?.Complete) {
      window.removeEventListener('beforeunload', beforeUnload, false)
    }
  }, [store.updateUploadStatus?.Complete])

  // Managing locked state
  React.useEffect(() => {
    if (store.activeUser)
      store.lockResearchUpdate(store.activeUser.userName, props.formValues._id)

    return () => {
      store.unlockResearchUpdate(props.formValues._id)
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
      status: isDraft ? 'draft' : 'published',
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
    formValues.moderation !== 'draft' ? draft.create : draft.update
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
          return (
            <Flex
              mx={-2}
              mb={4}
              bg={'inherit'}
              sx={{ flexWrap: 'wrap' }}
              data-testid="EditResearchUpdate"
            >
              <Flex
                bg="inherit"
                px={2}
                sx={{ width: ['100%', '100%', `${(2 / 3) * 100}%`] }}
                mt={4}
              >
                <Prompt
                  when={!store.updateUploadStatus.Complete && dirty}
                  message={CONFIRM_DIALOG_MSG}
                />
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
                            <Flex sx={{ flexDirection: 'column' }} mb={3}>
                              <Label htmlFor="title" sx={{ mb: 2 }}>
                                {title.title}
                              </Label>
                              <Field
                                id="title"
                                name="title"
                                data-cy="intro-title"
                                validateFields={[]}
                                validate={composeValidators(
                                  required,
                                  minValue(RESEARCH_TITLE_MIN_LENGTH),
                                  validateTitle(
                                    parentType,
                                    formValues._id,
                                    store,
                                  ),
                                )}
                                isEqual={COMPARISONS.textInput}
                                component={FieldInput}
                                maxLength={RESEARCH_TITLE_MAX_LENGTH}
                                minLength={RESEARCH_TITLE_MIN_LENGTH}
                                showCharacterCount
                                placeholder={title.placeholder}
                              />
                            </Flex>
                            <Flex sx={{ flexDirection: 'column' }} mb={3}>
                              <Label htmlFor="description" sx={{ mb: 2 }}>
                                {description.title}
                              </Label>
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
                                style={{
                                  resize: 'none',
                                  flex: 1,
                                  minHeight: '150px',
                                }}
                                maxLength={RESEARCH_MAX_LENGTH}
                                showCharacterCount
                                placeholder={description.placeholder}
                              />
                            </Flex>
                            <Label htmlFor={`images`} sx={{ mb: 2 }}>
                              {images.title}
                            </Label>
                            <Flex
                              sx={{
                                flexDirection: ['column', 'row'],
                                flexWrap: 'wrap',
                                alignItems: 'center',
                              }}
                              mb={3}
                            >
                              <ImageInputFieldWrapper data-cy="image-0">
                                <Field
                                  hasText={false}
                                  name={`images[0]`}
                                  component={ImageInputField}
                                  isEqual={COMPARISONS.image}
                                  validateFields={['videoUrl']}
                                />
                              </ImageInputFieldWrapper>
                              <ImageInputFieldWrapper data-cy="image-1">
                                <Field
                                  hasText={false}
                                  name={`images[1]`}
                                  validateFields={['videoUrl']}
                                  component={ImageInputField}
                                  isEqual={COMPARISONS.image}
                                />
                              </ImageInputFieldWrapper>
                              <ImageInputFieldWrapper data-cy="image-2">
                                <Field
                                  hasText={false}
                                  name={`images[2]`}
                                  validateFields={['videoUrl']}
                                  component={ImageInputField}
                                  isEqual={COMPARISONS.image}
                                />
                              </ImageInputFieldWrapper>
                              <ImageInputFieldWrapper data-cy="image-3">
                                <Field
                                  hasText={false}
                                  name={`images[3]`}
                                  validateFields={['videoUrl']}
                                  component={ImageInputField}
                                  isEqual={COMPARISONS.image}
                                />
                              </ImageInputFieldWrapper>
                              <ImageInputFieldWrapper data-cy="image-4">
                                <Field
                                  hasText={false}
                                  name={`images[4]`}
                                  validateFields={['videoUrl']}
                                  component={ImageInputField}
                                  isEqual={COMPARISONS.image}
                                />
                              </ImageInputFieldWrapper>
                            </Flex>
                            <Flex sx={{ flexDirection: 'column' }} mb={3}>
                              <Label htmlFor={`videoUrl`} sx={{ mb: 2 }}>
                                {videoUrl.title}
                              </Label>
                              <Field
                                name={`videoUrl`}
                                data-cy="videoUrl"
                                component={FieldInput}
                                placeholder={videoUrl.placeholder}
                                validate={(url, values) =>
                                  validateMedia(url, values)
                                }
                                validateFields={[]}
                                isEqual={COMPARISONS.textInput}
                              />
                            </Flex>
                            <Flex sx={{ mb: 2 }}>
                              {showInvalidFileWarning && (
                                <Text
                                  id="invalid-file-warning"
                                  data-cy="invalid-file-warning"
                                  data-testid="invalid-file-warning"
                                  sx={{
                                    color: 'error',
                                  }}
                                >
                                  {files.error}
                                </Text>
                              )}
                            </Flex>
                            <Label htmlFor="files" mb={2}>
                              {files.title}
                            </Label>
                            {props.formValues.files?.length > 0 &&
                            props.parentType === 'edit' &&
                            !fileEditMode ? (
                              <Flex
                                sx={{
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                }}
                                mb={3}
                              >
                                {props.formValues.files.map((file) => (
                                  <DownloadStaticFile
                                    allowDownload
                                    file={file}
                                    key={file.name}
                                  />
                                ))}
                                <Button
                                  variant={'outline'}
                                  icon="delete"
                                  onClick={() => {
                                    props.formValues.files = []
                                    setFileEditMode(true)
                                  }}
                                >
                                  {buttons.files}
                                </Button>
                              </Flex>
                            ) : (
                              <>
                                <Flex
                                  sx={{
                                    flexDirection: 'column',
                                  }}
                                  mb={3}
                                >
                                  <Label
                                    mb={2}
                                    htmlFor="file-download-link"
                                    style={{ fontSize: '12px' }}
                                  >
                                    {fileLink.title}
                                  </Label>
                                  <Field
                                    id="fileLink"
                                    name="fileLink"
                                    data-cy="fileLink"
                                    component={FieldInput}
                                    placeholder="Link to Google Drive, Dropbox, Grabcad etc"
                                    isEqual={COMPARISONS.textInput}
                                    maxLength={MAX_LINK_LENGTH}
                                    validateFields={[]}
                                    mb={2}
                                  />
                                </Flex>
                                <Flex sx={{ flexDirection: 'column' }} mb={3}>
                                  <Label
                                    mb={2}
                                    htmlFor="file-download-link"
                                    style={{ fontSize: '12px' }}
                                  >
                                    {files.title}
                                  </Label>
                                  <Field
                                    hasText={false}
                                    name={'files'}
                                    component={FileInputField}
                                  />
                                  <Text
                                    color={'grey'}
                                    mt={4}
                                    sx={{ fontSize: 1 }}
                                  >
                                    {files.description}
                                  </Text>
                                </Flex>
                              </>
                            )}
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
                    data-cy={'draft'}
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
                      data-cy={'delete'}
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
                    data-cy={'submit'}
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
): ResearchEditorOverviewUpdate[] =>
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
          status: 'draft',
          slug: null,
        }
      : null,
  ].filter(Boolean)

/**
 * Ensure either url or images included (not both), and any url formatted correctly
 */
const validateMedia = (videoUrl: string, values: any) => {
  const { both, empty, invalidUrl } = errors.videoUrl
  const images = values.images

  if (videoUrl) {
    if (images && images[0]) {
      return both
    }
    const ytRegex = new RegExp(/(youtu\.be\/|youtube\.com\/watch\?v=)/gi)
    const urlValid = ytRegex.test(videoUrl)
    return urlValid ? null : invalidUrl
  }
  return images && images[0] ? null : empty
}
