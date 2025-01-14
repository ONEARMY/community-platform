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
import { stripSpecialCharacters } from 'src/utils/helpers'
import {
  setAllowDraftSaveFalse,
  setAllowDraftSaveTrue,
} from 'src/utils/validators'
import { Box, Card, Flex, Heading } from 'theme-ui'

import { headings, intro } from '../../labels'
import { HowtoButtonDraft } from './LibraryButtonDraft'
import { HowtoButtonPublish } from './LibraryButtonPublish'
import { HowtoFieldCategory } from './LibraryCategory.field'
import { HowtoFieldCoverImage } from './LibraryCoverImage.field'
import { HowtoFieldCoverImageAlt } from './LibraryCoverImageAlt.field'
import { HowtoFieldDescription } from './LibraryDescription.field'
import { HowtoFieldDifficulty } from './LibraryDifficulty.field'
import { HowtoErrors } from './LibraryErrors'
import { HowtoFieldFiles } from './LibraryFiles.field'
import { HowtoPostingGuidelines } from './LibraryPostingGuidelines'
import { HowtoFieldStepsContainer } from './LibraryStepsContainer.field'
import { HowtoFieldTags } from './LibraryTags.field'
import { HowtoFieldTime } from './LibraryTime.field'
import { HowtoFieldTitle } from './LibraryTitle.field'
import { HowToSubmitStatus } from './SubmitStatus'

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
export const HowtoForm = observer((props: IProps) => {
  const { howtoStore } = useCommonStores().stores

  const [state, setState] = useState<IState>({
    formSaved: false,
    _toDocsList: false,
    editCoverImg: false,
    fileEditMode: false,
    showSubmitModal: false,
    showInvalidFileWarning:
      props.formValues.files?.length > 0 && props.formValues.fileLink,
  })
  const [howtoSlug, setHowtoSlug] = useState<string>('')

  const { formValues, parentType } = props
  const { fileEditMode, showSubmitModal, showInvalidFileWarning } = state
  const { heading } = intro
  const { create, edit } = headings

  const formId = 'howtoForm'
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
    const howto = await howtoStore.uploadHowTo(formValues)
    howto && setHowtoSlug(howto.slug)
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
        <HowToSubmitStatus
          {...props}
          slug={howtoSlug}
          onClose={() => {
            setState((state) => ({ ...state, showSubmitModal: false }))
            howtoStore.resetUploadStatus()
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
          values,
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
                      <HowtoPostingGuidelines />
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
                            <HowtoFieldTitle
                              store={howtoStore}
                              _id={formValues._id}
                            />
                            <HowtoFieldCategory />
                            <HowtoFieldTags />
                            <HowtoFieldTime />
                            <HowtoFieldDifficulty />
                            <HowtoFieldDescription />
                            <HowtoFieldFiles
                              category={values.category}
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
                            <HowtoFieldCoverImage />
                            <HowtoFieldCoverImageAlt />
                          </Flex>
                        </Flex>
                      </Flex>
                    </Card>

                    <HowtoFieldStepsContainer />
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
                    <HowtoPostingGuidelines />
                  </Box>

                  <HowtoButtonDraft
                    form={form}
                    formId={formId}
                    moderation={formValues.moderation}
                    submitting={submitting}
                  />

                  <HowtoButtonPublish
                    form={form}
                    formId={formId}
                    submitting={submitting}
                  />

                  <HowtoErrors
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
