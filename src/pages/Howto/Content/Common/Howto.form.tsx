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
import { HowtoButtonDraft } from './HowtoButtonDraft'
import { HowtoButtonPublish } from './HowtoButtonPublish'
import { HowtoErrors } from './HowtoErrors'
import { HowtoFieldCategory } from './HowtoFieldCategory'
import { HowtoFieldCoverImage } from './HowtoFieldCoverImage'
import { HowtoFieldCoverImageAlt } from './HowtoFieldCoverImageAlt'
import { HowtoFieldDescription } from './HowtoFieldDescription'
import { HowtoFieldDifficulty } from './HowtoFieldDifficulty'
import { HowtoFieldFiles } from './HowtoFieldFiles'
import { HowtoFieldStepsContainer } from './HowtoFieldStepsContainer'
import { HowtoFieldTags } from './HowtoFieldTags'
import { HowtoFieldTime } from './HowtoFieldTime'
import { HowtoFieldTitle } from './HowtoFieldTitle'
import { HowtoPostingGuidelines } from './HowtoPostingGuidelines'
import { HowToSubmitStatus } from './SubmitStatus'

import type { FormApi } from 'final-form'
import type { IHowtoFormInput } from 'oa-shared'

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

  const { formValues, parentType } = props
  const { fileEditMode, showSubmitModal, showInvalidFileWarning } = state
  const { heading } = intro
  const { create, edit } = headings

  const formId = 'howtoForm'
  const headingText = parentType === 'create' ? create : edit

  const checkFilesValid = (formValues: IHowtoFormInput) => {
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
  const onSubmit = async (formValues: IHowtoFormInput, form: FormApi) => {
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
    await howtoStore.uploadHowTo(formValues)
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
                  {/* How To Info */}
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
