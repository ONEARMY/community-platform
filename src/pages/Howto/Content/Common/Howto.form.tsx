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
  FileInformation,
} from 'oa-components'
import type { HowtoStore } from 'src/stores/Howto/howto.store'
import { Heading, Card, Flex, Box, Text } from 'theme-ui'
import { TagsSelectField } from 'src/common/Form/TagsSelect.field'
import { ImageInputField } from 'src/common/Form/ImageInput.field'
import { FileInputField } from 'src/common/Form/FileInput.field'
import { motion, AnimatePresence } from 'framer-motion'
import { inject, observer } from 'mobx-react'
import { stripSpecialCharacters } from 'src/utils/helpers'
import { PostingGuidelines } from './PostingGuidelines'
// TODO: Remove direct usage of Theme
import { preciousPlasticTheme } from 'oa-themes'
const theme = preciousPlasticTheme.styles
import { DIFFICULTY_OPTIONS, TIME_OPTIONS } from './FormSettings'
import { HowToSubmitStatus } from './SubmitStatus'
import { required, validateUrlAcceptEmpty } from 'src/utils/validators'
import IconHeaderHowto from 'src/assets/images/header-section/howto-header-icon.svg'
import { COMPARISONS } from 'src/utils/comparisons'
import { UnsavedChangesDialog } from 'src/common/Form/UnsavedChangesDialog'
import { logger } from 'src/logger'
import { HOWTO_MAX_LENGTH, HOWTO_TITLE_MAX_LENGTH } from '../../constants'
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

const Label = styled.label`
  font-size: ${theme.fontSizes[2] + 'px'};
  margin-bottom: ${theme.space[2] + 'px'};
  display: block;
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
    if (formValues.fileLink && formValues.files.length > 0) {
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
  public validateTitle = async (value: any) => {
    const originalId =
      this.props.parentType === 'edit' ? this.props.formValues._id : undefined
    return this.store.validateTitleForSlug(value, 'howtos', originalId)
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
      showInvalidFileWarning: false,
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
            ...arrayMutators,
          }}
          validateOnBlur
          decorators={[this.calculatedFields]}
          render={({ submitting, handleSubmit }) => {
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
                      <Card bg={theme.colors.softblue}>
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
                                <Label htmlFor="title">
                                  Title of your How-to *
                                </Label>
                                <Field
                                  id="title"
                                  name="title"
                                  data-cy="intro-title"
                                  validateFields={[]}
                                  validate={this.validateTitle}
                                  isEqual={COMPARISONS.textInput}
                                  modifiers={{ capitalize: true }}
                                  component={FieldInput}
                                  maxLength={HOWTO_TITLE_MAX_LENGTH}
                                  placeholder={`Make a chair from... (max ${HOWTO_TITLE_MAX_LENGTH} characters)`}
                                  showCharacterCount
                                />
                              </Flex>
                              <Flex sx={{ flexDirection: 'column' }} mb={3}>
                                <Label>Category *</Label>
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
                                <Label>Select tags for your How-to*</Label>
                                <Field
                                  name="tags"
                                  component={TagsSelectField}
                                  category="how-to"
                                  isEqual={COMPARISONS.tags}
                                />
                              </Flex>
                              <Flex sx={{ flexDirection: 'column' }} mb={3}>
                                <Label htmlFor="time">
                                  How long does it take? *
                                </Label>
                                <Field
                                  id="time"
                                  name="time"
                                  validate={required}
                                  validateFields={[]}
                                  isEqual={COMPARISONS.textInput}
                                  options={TIME_OPTIONS}
                                  component={SelectField}
                                  data-cy="time-select"
                                  placeholder="How much time?"
                                />
                              </Flex>
                              <Flex sx={{ flexDirection: 'column' }} mb={3}>
                                <Label htmlFor="difficulty_level">
                                  Difficulty level? *
                                </Label>
                                <Field
                                  px={1}
                                  id="difficulty_level"
                                  name="difficulty_level"
                                  data-cy="difficulty-select"
                                  validate={required}
                                  validateFields={[]}
                                  isEqual={COMPARISONS.textInput}
                                  component={SelectField}
                                  options={DIFFICULTY_OPTIONS}
                                  placeholder="How hard is it?"
                                />
                              </Flex>
                              <Flex sx={{ flexDirection: 'column' }} mb={3}>
                                <Label htmlFor="description">
                                  Short description of your How-to *
                                </Label>
                                <Field
                                  id="description"
                                  name="description"
                                  data-cy="intro-description"
                                  validate={required}
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
                                  placeholder="Introduction to your How-To (max 400 characters)"
                                />
                              </Flex>
                              <Label htmlFor="description">
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
                                      <FileInformation
                                        allowDownload
                                        file={file}
                                        key={file.name}
                                      />
                                    ))}
                                    <Button
                                      variant={'outline'}
                                      icon="delete"
                                      onClick={() =>
                                        this.setState({
                                          fileEditMode:
                                            !this.state.fileEditMode,
                                        })
                                      }
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
                                        placeholder="Link to Gdrive, Dropbox, Grabcad etc"
                                        isEqual={COMPARISONS.textInput}
                                        maxLength={MAX_LINK_LENGTH}
                                        validate={validateUrlAcceptEmpty}
                                        validateFields={[]}
                                      />
                                    </Flex>
                                    <Flex
                                      sx={{
                                        flexDirection: 'column',
                                      }}
                                    >
                                      <Label
                                        htmlFor="files"
                                        style={{ fontSize: '12px' }}
                                      >
                                        Or upload your files here
                                      </Label>
                                      <Field
                                        name="files"
                                        component={FileInputField}
                                      />
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
                              <Label htmlFor="cover_image">Cover image *</Label>
                              <Box sx={{ height: '230px' }}>
                                <Field
                                  id="cover_image"
                                  name="cover_image"
                                  validate={required}
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
                            <AnimatePresence>
                              {fields.map((name, index: number) => (
                                <AnimationContainer
                                  key={fields.value[index]._animationKey}
                                >
                                  <HowtoStep
                                    key={fields.value[index]._animationKey}
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
                    height: '100%',
                    position: ['relative', 'relative', 'sticky'],
                    top: 3,
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
                    <Button
                      data-cy={'draft'}
                      onClick={() => this.trySubmitForm(true)}
                      mt={[0, 0, 3]}
                      variant="secondary"
                      type="submit"
                      disabled={submitting}
                      sx={{ width: '100%', display: 'block' }}
                    >
                      {formValues.moderation !== 'draft' ? (
                        <span>Save to draft</span>
                      ) : (
                        <span>Revert to draft</span>
                      )}
                    </Button>
                    <Button
                      large
                      data-cy={'submit'}
                      onClick={() => this.trySubmitForm(false)}
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
