import * as React from 'react'
import type { RouteComponentProps } from 'react-router'
import { Form, Field } from 'react-final-form'
import styled from '@emotion/styled'
import { FieldArray } from 'react-final-form-arrays'
import arrayMutators from 'final-form-arrays'
import createDecorator from 'final-form-calculate'
import type { IHowtoFormInput } from 'src/models/howto.models'
import type { UploadedFile } from 'src/pages/common/UploadedFile/UploadedFile'
import { SelectField } from 'src/common/Form/Select.field'
import { HowtoStep } from './HowtoStep.form'
import {
  Button,
  FieldInput,
  FieldTextarea,
  ElWithBeforeIcon,
  DownloadStaticFile,
} from 'oa-components'
import type { HowtoStore } from 'src/stores/Howto/howto.store'
import { Heading, Card, Flex, Box, Text, Label } from 'theme-ui'
import { TagsSelectField } from 'src/common/Form/TagsSelect.field'
import { ImageInputField } from 'src/common/Form/ImageInput.field'
import { FileInputField } from 'src/common/Form/FileInput.field'
import { motion, AnimatePresence } from 'framer-motion'
import { inject, observer } from 'mobx-react'
import { stripSpecialCharacters } from 'src/utils/helpers'
import { PostingGuidelines } from './PostingGuidelines'

import { DIFFICULTY_OPTIONS, TIME_OPTIONS } from './FormSettings'
import { HowToSubmitStatus } from './SubmitStatus'
import {
  composeValidators,
  draftValidationWrapper,
  minValue,
  required,
  setAllowDraftSaveFalse,
  setAllowDraftSaveTrue,
  validateTitle,
  validateUrlAcceptEmpty,
} from 'src/utils/validators'
import IconHeaderHowto from 'src/assets/images/header-section/howto-header-icon.svg'
import { COMPARISONS } from 'src/utils/comparisons'
import { UnsavedChangesDialog } from 'src/common/Form/UnsavedChangesDialog'
import { logger } from 'src/logger'
import {
  HOWTO_MAX_LENGTH,
  HOWTO_TITLE_MAX_LENGTH,
  HOWTO_TITLE_MIN_LENGTH,
} from '../../constants'
import { CategoriesSelect } from 'src/pages/Howto/Category/CategoriesSelect'

const MAX_LINK_LENGTH = 2000

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
  parentType: 'create' | 'edit'
}
interface IInjectedProps extends IProps {
  howtoStore: HowtoStore
}

const AnimationContainer = (props: any) => {
  const variants = {
    pre: {
      opacity: 0,
    },
    enter: {
      opacity: 1,
      duration: 0.2,
      display: 'block',
    },
    post: {
      display: 'none',
      duration: 0.2,
      top: '-100%',
    },
  }
  return (
    <motion.div
      layout
      initial="pre"
      animate="enter"
      exit="post"
      variants={variants}
    >
      {props.children}
    </motion.div>
  )
}

const FormContainer = styled.form`
  width: 100%;
`

@inject('howtoStore')
@observer
export class HowtoForm extends React.PureComponent<IProps, IState> {
  isDraft = false
  uploadRefs: { [key: string]: UploadedFile | null } = {}
  formContainerRef = React.createRef<HTMLElement>()
  /** When submitting from outside the form dispatch an event from the form container ref to trigger validation */
  private trySubmitForm = (draft: boolean) => {
    this.isDraft = draft
    const formContainerRef = this.formContainerRef.current
    // dispatch submit from the element
    if (formContainerRef) {
      // https://github.com/final-form/react-final-form/issues/878
      formContainerRef.dispatchEvent(
        new Event('submit', { cancelable: true, bubbles: true }),
      )
    }
  }
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
  public onSubmit = async (formValues: IHowtoFormInput) => {
    if (!this.checkFilesValid(formValues)) {
      return
    }
    this.setState({ showSubmitModal: true })
    formValues.moderation = this.isDraft ? 'draft' : 'awaiting-moderation'
    logger.debug('submitting form', formValues)
    await this.store.uploadHowTo(formValues)
  }
  // automatically generate the slug when the title changes
  private calculatedFields = createDecorator({
    field: 'title',
    updates: {
      slug: (title) => stripSpecialCharacters(title).toLowerCase(),
    },
  })

  private titleValidation = (values, allValues) => {
    const validators = composeValidators(
      required,
      minValue(HOWTO_TITLE_MIN_LENGTH),
      validateTitle(
        this.props.parentType,
        this.props.formValues._id,
        'howtos',
        this.store,
      ),
    )

    return draftValidationWrapper(values, allValues, validators)
  }

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
    this.isDraft = props.moderation === 'draft'
  }

  get injected() {
    return this.props as IInjectedProps
  }
  get store() {
    return this.injected.howtoStore
  }

  public render() {
    const { formValues, parentType } = this.props
    const { fileEditMode, showSubmitModal } = this.state
    const _labelStyle = {
      fontSize: 2,
      marginBottom: 2,
      display: 'block',
    }
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
          onSubmit={(v) => {
            this.onSubmit(v as IHowtoFormInput)
          }}
          initialValues={formValues}
          mutators={{
            setAllowDraftSaveTrue,
            setAllowDraftSaveFalse,
            ...arrayMutators,
          }}
          validateOnBlur
          decorators={[this.calculatedFields]}
          render={({ submitting, handleSubmit, form }) => {
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
                  <FormContainer
                    ref={this.formContainerRef as any}
                    id="howtoForm"
                    onSubmit={handleSubmit}
                  >
                    {/* How To Info */}
                    <Flex sx={{ flexDirection: 'column' }}>
                      <Card sx={{ bg: 'softblue' }}>
                        <Flex px={3} py={2} sx={{ alignItems: 'center' }}>
                          <Heading>
                            {this.props.parentType === 'create' ? (
                              <span>Create</span>
                            ) : (
                              <span>Edit</span>
                            )}{' '}
                            a How-To
                          </Heading>
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
                            Intro
                          </Heading>
                          <Flex
                            mx={-2}
                            sx={{ flexDirection: ['column', 'column', 'row'] }}
                          >
                            <Flex
                              px={2}
                              sx={{ flexDirection: 'column', flex: [1, 1, 4] }}
                            >
                              <Flex sx={{ flexDirection: 'column' }} mb={3}>
                                <Label sx={_labelStyle} htmlFor="title">
                                  Title of your How-to *
                                </Label>
                                <Field
                                  id="title"
                                  name="title"
                                  data-cy="intro-title"
                                  validateFields={[]}
                                  validate={this.titleValidation}
                                  isEqual={COMPARISONS.textInput}
                                  modifiers={{ capitalize: true }}
                                  component={FieldInput}
                                  minLength={HOWTO_TITLE_MIN_LENGTH}
                                  maxLength={HOWTO_TITLE_MAX_LENGTH}
                                  placeholder={`Make a chair from... (${HOWTO_TITLE_MIN_LENGTH} - ${HOWTO_TITLE_MAX_LENGTH} characters)`}
                                  showCharacterCount
                                />
                              </Flex>
                              <Flex sx={{ flexDirection: 'column' }} mb={3}>
                                <Label sx={_labelStyle}>Category *</Label>
                                <Field
                                  name="category"
                                  render={({ input, ...rest }) => (
                                    <CategoriesSelect
                                      {...rest}
                                      isForm={true}
                                      onChange={(category) =>
                                        input.onChange(category)
                                      }
                                      value={input.value}
                                      placeholder="Select one category"
                                      type="howto"
                                    />
                                  )}
                                />
                              </Flex>
                              <Flex sx={{ flexDirection: 'column' }} mb={3}>
                                <Label sx={_labelStyle}>
                                  Select tags for your How-to*
                                </Label>
                                <Field
                                  name="tags"
                                  component={TagsSelectField}
                                  category="how-to"
                                  isEqual={COMPARISONS.tags}
                                />
                              </Flex>
                              <Flex sx={{ flexDirection: 'column' }} mb={3}>
                                <Label sx={_labelStyle} htmlFor="time">
                                  How long does it take? *
                                </Label>
                                <Field
                                  id="time"
                                  name="time"
                                  validate={(values, allValues) =>
                                    draftValidationWrapper(
                                      values,
                                      allValues,
                                      required,
                                    )
                                  }
                                  validateFields={[]}
                                  isEqual={COMPARISONS.textInput}
                                  options={TIME_OPTIONS}
                                  component={SelectField}
                                  data-cy="time-select"
                                  placeholder="How much time?"
                                />
                              </Flex>
                              <Flex sx={{ flexDirection: 'column' }} mb={3}>
                                <Label
                                  sx={_labelStyle}
                                  htmlFor="difficulty_level"
                                >
                                  Difficulty level? *
                                </Label>
                                <Field
                                  px={1}
                                  id="difficulty_level"
                                  name="difficulty_level"
                                  data-cy="difficulty-select"
                                  validate={(values, allValues) =>
                                    draftValidationWrapper(
                                      values,
                                      allValues,
                                      required,
                                    )
                                  }
                                  validateFields={[]}
                                  isEqual={COMPARISONS.textInput}
                                  component={SelectField}
                                  options={DIFFICULTY_OPTIONS}
                                  placeholder="How hard is it?"
                                />
                              </Flex>
                              <Flex sx={{ flexDirection: 'column' }} mb={3}>
                                <Label sx={_labelStyle} htmlFor="description">
                                  Short description of your How-to *
                                </Label>
                                <Field
                                  id="description"
                                  name="description"
                                  data-cy="intro-description"
                                  validate={(values, allValues) =>
                                    draftValidationWrapper(
                                      values,
                                      allValues,
                                      required,
                                    )
                                  }
                                  validateFields={[]}
                                  modifiers={{ capitalize: true }}
                                  isEqual={COMPARISONS.textInput}
                                  component={FieldTextarea}
                                  style={{
                                    resize: 'none',
                                    flex: 1,
                                    minHeight: '150px',
                                  }}
                                  maxLength={HOWTO_MAX_LENGTH}
                                  showCharacterCount
                                  placeholder={`Introduction to your How-To (max ${HOWTO_MAX_LENGTH} characters)`}
                                />
                              </Flex>
                              <Flex sx={{ mb: 2 }}>
                                {this.state.showInvalidFileWarning && (
                                  <Text
                                    id="invalid-file-warning"
                                    data-cy="invalid-file-warning"
                                    data-testid="invalid-file-warning"
                                    sx={{
                                      color: 'error',
                                    }}
                                  >
                                    Please provide either a file link or upload
                                    a file, not both.
                                  </Text>
                                )}
                              </Flex>
                              <Label sx={_labelStyle} htmlFor="description">
                                Do you have supporting file to help others
                                replicate your How-to?
                              </Label>
                              <Flex
                                sx={{ flexDirection: 'column' }}
                                mb={[4, 4, 0]}
                              >
                                {formValues.files?.length &&
                                parentType === 'edit' &&
                                !fileEditMode ? (
                                  <Flex
                                    sx={{
                                      flexDirection: 'column',
                                      alignItems: 'center',
                                    }}
                                  >
                                    {formValues.files.map((file) => (
                                      <DownloadStaticFile
                                        allowDownload
                                        file={file}
                                        key={file.name}
                                      />
                                    ))}
                                    <Button
                                      data-testid="re-upload-files"
                                      variant={'outline'}
                                      icon="delete"
                                      onClick={() => {
                                        this.setState({
                                          fileEditMode:
                                            !this.state.fileEditMode,
                                        })
                                        form.change('files', [])
                                      }}
                                    >
                                      Re-upload files (this will delete the
                                      existing ones)
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
                                        sx={_labelStyle}
                                        htmlFor="file-download-link"
                                        style={{ fontSize: '12px' }}
                                      >
                                        Add a download link
                                      </Label>
                                      <Field
                                        id="fileLink"
                                        name="fileLink"
                                        data-cy="fileLink"
                                        component={FieldInput}
                                        placeholder="Link to Google Drive, Dropbox, Grabcad etc"
                                        isEqual={COMPARISONS.textInput}
                                        maxLength={MAX_LINK_LENGTH}
                                        validate={(values, allValues) =>
                                          draftValidationWrapper(
                                            values,
                                            allValues,
                                            validateUrlAcceptEmpty,
                                          )
                                        }
                                        validateFields={[]}
                                      />
                                    </Flex>
                                    <Flex
                                      sx={{
                                        flexDirection: 'column',
                                      }}
                                    >
                                      <Label
                                        sx={_labelStyle}
                                        htmlFor="files"
                                        style={{ fontSize: '12px' }}
                                      >
                                        Or upload your files here
                                      </Label>
                                      <Field
                                        id="files"
                                        name="files"
                                        data-cy="files"
                                        component={FileInputField}
                                      />
                                      <Text
                                        color={'grey'}
                                        mt={4}
                                        sx={{ fontSize: 1 }}
                                      >
                                        Maximum file size 50MB
                                      </Text>
                                    </Flex>
                                  </>
                                )}
                              </Flex>
                            </Flex>
                            {/* Right side */}
                            <Flex
                              px={2}
                              sx={{ flexDirection: 'column', flex: [1, 1, 3] }}
                              data-cy={'intro-cover'}
                            >
                              <Label sx={_labelStyle} htmlFor="cover_image">
                                Cover image *
                              </Label>
                              <Box sx={{ height: '230px' }}>
                                <Field
                                  id="cover_image"
                                  name="cover_image"
                                  validate={(values, allValues) =>
                                    draftValidationWrapper(
                                      values,
                                      allValues,
                                      required,
                                    )
                                  }
                                  isEqual={COMPARISONS.image}
                                  component={ImageInputField}
                                />
                              </Box>

                              <Text color={'grey'} mt={4} sx={{ fontSize: 1 }}>
                                This image should be landscape. We advise
                                1280x960px
                              </Text>
                            </Flex>
                          </Flex>
                        </Flex>
                      </Card>

                      {/* Steps Info */}
                      <FieldArray name="steps" isEqual={COMPARISONS.step}>
                        {({ fields }) => (
                          <>
                            <Box paddingTop={5}>
                              <Heading>Steps</Heading>
                              <Text sx={{ fontSize: 2 }}>
                                Each step needs an intro, a description and
                                photos or video. You'll need to have
                                <strong> at least three steps</strong>.
                              </Text>
                            </Box>
                            <AnimatePresence>
                              {fields.map((name, index: number) => (
                                <AnimationContainer
                                  key={`${fields.value[index]._animationKey}-1`}
                                >
                                  <HowtoStep
                                    key={`${fields.value[index]._animationKey}-2`}
                                    step={name}
                                    index={index}
                                    moveStep={(from, to) => {
                                      if (to !== fields.length) {
                                        fields.move(from, to)
                                      }
                                    }}
                                    images={fields.value[index].images}
                                    onDelete={(fieldIndex: number) => {
                                      fields.remove(fieldIndex)
                                    }}
                                  />
                                </AnimationContainer>
                              ))}
                            </AnimatePresence>
                            <Flex>
                              <Button
                                icon={'add'}
                                data-cy={'add-step'}
                                mx="auto"
                                mt={[10, 10, 20]}
                                mb={[5, 5, 20]}
                                variant="secondary"
                                onClick={() => {
                                  fields.push({
                                    title: '',
                                    text: '',
                                    images: [],
                                    // HACK - need unique key, this is a rough method to generate form random numbers
                                    _animationKey: `unique${Math.random()
                                      .toString(36)
                                      .substring(7)}`,
                                  })
                                }}
                              >
                                Add step
                              </Button>
                            </Flex>
                          </>
                        )}
                      </FieldArray>
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
                    <Flex
                      sx={{ flexDirection: 'column', alignItems: 'center' }}
                    >
                      <Button
                        data-cy={'draft'}
                        onClick={() => {
                          form.mutators.setAllowDraftSaveTrue()
                          this.trySubmitForm(true)
                        }}
                        mt={[0, 0, 3]}
                        variant="secondary"
                        type="submit"
                        disabled={submitting}
                        sx={{ width: '100%', display: 'block' }}
                      >
                        {formValues.moderation !== 'draft' ? (
                          <span>Save draft</span>
                        ) : (
                          <span>Revert to draft</span>
                        )}
                      </Button>
                      <Text sx={{ fontSize: 1, textAlign: 'center' }}>
                        A draft can be saved any time
                      </Text>
                    </Flex>
                    <Button
                      large
                      data-cy={'submit'}
                      data-testid="submit-form"
                      onClick={() => {
                        form.mutators.setAllowDraftSaveFalse()
                        this.trySubmitForm(false)
                      }}
                      mt={3}
                      variant="primary"
                      type="submit"
                      disabled={submitting}
                      sx={{
                        width: '100%',
                        display: 'block',
                        mb: ['40px', '40px', 0],
                      }}
                    >
                      Publish
                    </Button>
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
