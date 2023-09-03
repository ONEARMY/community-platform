import * as React from 'react'
import type { RouteComponentProps } from 'react-router'
import { Form } from 'react-final-form'
import type { FormApi } from 'final-form'
import styled from '@emotion/styled'
import arrayMutators from 'final-form-arrays'
import createDecorator from 'final-form-calculate'
import { ElWithBeforeIcon } from 'oa-components'
import { Heading, Card, Flex, Box } from 'theme-ui'
import { inject, observer } from 'mobx-react'

import IconHeaderHowto from 'src/assets/images/header-section/howto-header-icon.svg'
import { UnsavedChangesDialog } from 'src/common/Form/UnsavedChangesDialog'
import { logger } from 'src/logger'
import { stripSpecialCharacters } from 'src/utils/helpers'
import {
  setAllowDraftSaveFalse,
  setAllowDraftSaveTrue,
} from 'src/utils/validators'
import { intro, headings } from '../../labels'
import {
  HowtoButtonDraft,
  HowtoButtonPublish,
  HowtoErrors,
  HowtoFieldCategory,
  HowtoFieldCoverImage,
  HowtoFieldDescription,
  HowtoFieldDifficulty,
  HowtoFieldFiles,
  HowtoFieldStepsContainer,
  HowtoFieldTags,
  HowtoFieldTime,
  HowtoFieldTitle,
  HowToSubmitStatus,
  PostingGuidelines,
} from '.'

import type { IHowtoFormInput } from 'src/models/howto.models'
import type { UploadedFile } from 'src/pages/common/UploadedFile/UploadedFile'
import type { HowtoStore } from 'src/stores/Howto/howto.store'
export type ParentType = 'create' | 'edit'

interface IState {
  formSaved: boolean
  _toDocsList: boolean
  showSubmitModal?: boolean
  editCoverImg?: boolean
  fileEditMode?: boolean
  showInvalidFileWarning: boolean
}
interface IProps extends RouteComponentProps<any> {
  formValues: any
  parentType: ParentType
}
interface IInjectedProps extends IProps {
  howtoStore: HowtoStore
}

const FormContainer = styled.form`
  width: 100%;
`

@inject('howtoStore')
@observer
export class HowtoForm extends React.PureComponent<IProps, IState> {
  uploadRefs: { [key: string]: UploadedFile | null } = {}
  formContainerRef = React.createRef<HTMLElement>()
  public checkFilesValid = (formValues: IHowtoFormInput) => {
    if (
      formValues.fileLink &&
      formValues.files &&
      formValues.files.length > 0
    ) {
      this.setState({ showInvalidFileWarning: true })
      return false
    } else {
      this.setState({ showInvalidFileWarning: false })
      return true
    }
  }
  public onSubmit = async (formValues: IHowtoFormInput, form: FormApi) => {
    if (!this.checkFilesValid(formValues)) {
      return
    }
    this.setState({ showSubmitModal: true })
    formValues.moderation = formValues.allowDraftSave
      ? 'draft'
      : 'awaiting-moderation'
    logger.debug('submitting form', formValues)
    await this.store.uploadHowTo(formValues)
    form.reset(formValues)
  }
  // automatically generate the slug when the title changes
  private calculatedFields = createDecorator({
    field: 'title',
    updates: {
      slug: (title) => stripSpecialCharacters(title).toLowerCase(),
    },
  })

  constructor(props: any) {
    super(props)
    this.state = {
      formSaved: false,
      _toDocsList: false,
      editCoverImg: false,
      fileEditMode: false,
      showSubmitModal: false,
      showInvalidFileWarning:
        this.props.formValues.files?.length > 0 &&
        this.props.formValues.fileLink,
    }
  }

  get injected() {
    return this.props as IInjectedProps
  }
  get store() {
    return this.injected.howtoStore
  }

  public render() {
    const { formValues, parentType } = this.props
    const { fileEditMode, showSubmitModal, showInvalidFileWarning } = this.state
    const { heading } = intro
    const { create, edit } = headings

    const formId = 'howtoForm'
    const headingText = parentType === 'create' ? create : edit

    return (
      <>
        {showSubmitModal && (
          <HowToSubmitStatus
            {...this.props}
            onClose={() => {
              this.setState({ showSubmitModal: false })
              this.injected.howtoStore.resetUploadStatus()
            }}
          />
        )}
        <Form
          onSubmit={(formValues, form) => {
            this.onSubmit(formValues, form)
          }}
          initialValues={formValues}
          mutators={{
            setAllowDraftSaveTrue,
            setAllowDraftSaveFalse,
            ...arrayMutators,
          }}
          validateOnBlur
          decorators={[this.calculatedFields]}
          render={({
            errors,
            form,
            handleSubmit,
            hasValidationErrors,
            submitFailed,
            submitting,
            values,
          }) => {
            return (
              <Flex mx={-2} bg={'inherit'} sx={{ flexWrap: 'wrap' }}>
                <UnsavedChangesDialog
                  uploadComplete={this.store.uploadStatus.Complete}
                />

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
                            dangerouslySetInnerHTML={{ __html: headingText }}
                          />
                          <Box ml="15px">
                            <ElWithBeforeIcon
                              icon={IconHeaderHowto}
                              size={20}
                            />
                          </Box>
                        </Flex>
                      </Card>
                      <Box
                        sx={{ mt: '20px', display: ['block', 'block', 'none'] }}
                      >
                        <PostingGuidelines />
                      </Box>
                      <Card mt={3}>
                        <Flex
                          p={4}
                          sx={{ flexWrap: 'wrap', flexDirection: 'column' }}
                        >
                          {/* Left Side */}
                          <Heading variant="small" mb={3}>
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
                                store={this.store}
                                _id={formValues._id}
                              />
                              <HowtoFieldCategory category={values.category} />
                              <HowtoFieldTags />
                              <HowtoFieldTime />
                              <HowtoFieldDifficulty />
                              <HowtoFieldDescription />
                              <HowtoFieldFiles
                                category={values.category}
                                fileEditMode={fileEditMode}
                                files={formValues.files}
                                onClick={() => {
                                  this.setState({
                                    fileEditMode: !this.state.fileEditMode,
                                  })
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
                      <PostingGuidelines />
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
  }
}
