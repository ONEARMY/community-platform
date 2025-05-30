import React, { useState } from 'react'
import { Form } from 'react-final-form'
import styled from '@emotion/styled'
import arrayMutators from 'final-form-arrays'
import createDecorator from 'final-form-calculate'
import { observer } from 'mobx-react'
import { ElWithBeforeIcon } from 'oa-components'
import { IModerationStatus } from 'oa-shared'
import IconHeaderHowto from 'src/assets/images/header-section/howto-header-icon.svg'
import { UnsavedChangesDialog } from 'src/common/Form/UnsavedChangesDialog'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { logger } from 'src/logger'
import { fireConfetti } from 'src/utils/fireConfetti'
import { stripSpecialCharacters } from 'src/utils/helpers'
import {
  setAllowDraftSaveFalse,
  setAllowDraftSaveTrue,
} from 'src/utils/validators'
import { Box, Card, Flex, Heading } from 'theme-ui'

import { headings, intro } from '../../labels'
import {
  LibraryButtonDraft,
  LibraryButtonPublish,
  LibraryCategoryField,
  LibraryCoverImageAltField,
  LibraryCoverImageField,
  LibraryDescriptionField,
  LibraryDifficultyField,
  LibraryErrors,
  LibraryFilesField,
  LibraryPostingGuidelines,
  LibraryStepsContainerField,
  LibraryTagsField,
  LibraryTimeField,
  LibraryTitleField,
  SubmitStatus,
} from './'

import type { FormApi } from 'final-form'
import type { ILibrary } from 'oa-shared'

export type ParentType = 'create' | 'edit'

interface IState {
  formSaved: boolean
  _toDocsList: boolean
  showSubmitModal?: boolean
  editCoverImg?: boolean
  fileEditMode?: boolean
  showInvalidFileWarning: boolean
}
interface IProps {
  formValues: any
  parentType: ParentType
}

const FormContainer = styled.form`
  width: 100%;
`
export const LibraryForm = observer((props: IProps) => {
  const { LibraryStore } = useCommonStores().stores

  const [state, setState] = useState<IState>({
    formSaved: false,
    _toDocsList: false,
    editCoverImg: false,
    fileEditMode: false,
    showSubmitModal: false,
    showInvalidFileWarning:
      props.formValues.files?.length > 0 && props.formValues.fileLink,
  })
  const [itemSlug, setItemSlug] = useState<string>('')

  const { formValues, parentType } = props
  const { fileEditMode, showSubmitModal, showInvalidFileWarning } = state
  const { heading } = intro
  const { create, edit } = headings

  const formId = 'libraryForm'
  const headingText = parentType === 'create' ? create : edit

  const checkFilesValid = (formValues: ILibrary.FormInput) => {
    if (
      formValues.fileLink &&
      formValues.files &&
      formValues.files.length > 0
    ) {
      setState((state) => ({ ...state, showInvalidFileWarning: true }))
      return false
    } else {
      setState((state) => ({ ...state, showInvalidFileWarning: false }))
      return true
    }
  }
  const onSubmit = async (formValues: ILibrary.FormInput, form: FormApi) => {
    if (!checkFilesValid(formValues)) {
      return
    }
    setState((state) => ({ ...state, showSubmitModal: true }))
    if (formValues.moderation !== IModerationStatus.ACCEPTED) {
      formValues.moderation = formValues.allowDraftSave
        ? IModerationStatus.DRAFT
        : IModerationStatus.AWAITING_MODERATION
    }
    logger.debug('submitting form', formValues)
    const howto = await LibraryStore.upload(formValues)
    howto && setItemSlug(howto.slug)

    if (formValues.allowDraftSave === false) {
      fireConfetti()
    }

    form.reset(formValues)
  }
  // automatically generate the slug when the title changes
  const calculatedFields = createDecorator({
    field: 'title',
    updates: {
      slug: (title) => stripSpecialCharacters(title).toLowerCase(),
    },
  })

  return (
    <>
      {showSubmitModal && (
        <SubmitStatus
          {...props}
          slug={itemSlug}
          onClose={() => {
            setState((state) => ({ ...state, showSubmitModal: false }))
            LibraryStore.resetUploadStatus()
          }}
        />
      )}
      <Form
        onSubmit={async (formValues, form) => await onSubmit(formValues, form)}
        initialValues={formValues}
        mutators={{
          setAllowDraftSaveTrue,
          setAllowDraftSaveFalse,
          ...arrayMutators,
        }}
        validateOnBlur
        decorators={[calculatedFields]}
        render={({
          dirty,
          errors,
          form,
          handleSubmit,
          hasValidationErrors,
          submitFailed,
          submitSucceeded,
          submitting,
        }) => {
          return (
            <Flex mx={-2} bg="inherit" sx={{ flexWrap: 'wrap' }}>
              <UnsavedChangesDialog hasChanges={dirty && !submitSucceeded} />

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
                          {heading.title}
                        </Heading>
                        <Flex
                          mx={-2}
                          sx={{ flexDirection: ['column', 'column', 'row'] }}
                        >
                          <Flex
                            px={2}
                            sx={{ flexDirection: 'column', flex: [1, 1, 4] }}
                          >
                            <LibraryTitleField
                              store={LibraryStore}
                              _id={formValues._id}
                            />
                            <LibraryCategoryField />
                            <LibraryTagsField />
                            <LibraryTimeField />
                            <LibraryDifficultyField />
                            <LibraryDescriptionField />
                            <LibraryFilesField
                              fileEditMode={fileEditMode}
                              files={formValues.files}
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
                            <LibraryCoverImageAltField />
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

                  <LibraryButtonDraft
                    form={form}
                    formId={formId}
                    moderation={formValues.moderation}
                    submitting={submitting}
                  />

                  <LibraryButtonPublish
                    form={form}
                    formId={formId}
                    submitting={submitting}
                  />

                  <LibraryErrors
                    errors={errors}
                    isVisible={submitFailed && hasValidationErrors}
                  />
                </Box>
              </Flex>
            </Flex>
          )
        }}
      />
    </>
  )
})
