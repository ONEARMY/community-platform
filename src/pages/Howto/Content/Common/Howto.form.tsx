import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { Form, Field } from 'react-final-form'
import styled from '@emotion/styled'
import { FieldArray } from 'react-final-form-arrays'
import arrayMutators from 'final-form-arrays'
import createDecorator from 'final-form-calculate'
import { IHowtoFormInput } from 'src/models/howto.models'
import Text from 'src/components/Text'
import { UploadedFile } from 'src/pages/common/UploadedFile/UploadedFile'
import { InputField, TextAreaField } from 'src/components/Form/Fields'
import { SelectField } from 'src/components/Form/Select.field'
import { HowtoStep } from './HowtoStep.form'
import { Button } from 'oa-components'
import { HowtoStore } from 'src/stores/Howto/howto.store'
import Heading from 'src/components/Heading'
import Flex from 'src/components/Flex'
import { TagsSelectField } from 'src/components/Form/TagsSelect.field'
import { ImageInputField } from 'src/components/Form/ImageInput.field'
import { FileInputField } from 'src/components/Form/FileInput.field'
import { motion, AnimatePresence } from 'framer-motion'
import { inject, observer } from 'mobx-react'
import { stripSpecialCharacters } from 'src/utils/helpers'
import { PostingGuidelines } from './PostingGuidelines'
import theme from 'src/themes/styled.theme'
import { DIFFICULTY_OPTIONS, TIME_OPTIONS } from './FormSettings'
import { Box } from 'theme-ui'
import { FileInfo } from 'src/components/FileInfo/FileInfo'
import { HowToSubmitStatus } from './SubmitStatus'
import { required } from 'src/utils/validators'
import ElWithBeforeIcon from 'src/components/ElWithBeforeIcon'
import IconHeaderHowto from 'src/assets/images/header-section/howto-header-icon.svg'
import { COMPARISONS } from 'src/utils/comparisons'
import { UnsavedChangesDialog } from 'src/components/Form/UnsavedChangesDialog'
import { logger } from 'src/logger'
import { HOWTO_MAX_LENGTH, HOWTO_TITLE_MAX_LENGTH } from '../../constants'

interface IState {
  formSaved: boolean
  _toDocsList: boolean
  showSubmitModal?: boolean
  editCoverImg?: boolean
  fileEditMode?: boolean
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
  constructor(props: any) {
    super(props)
    this.state = {
      formSaved: false,
      _toDocsList: false,
      editCoverImg: false,
      fileEditMode: false,
      showSubmitModal: false,
    }
    this.isDraft = props.moderation === 'draft'
  }

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
  public onSubmit = async (formValues: IHowtoFormInput) => {
    this.setState({ showSubmitModal: true })
    formValues.moderation = this.isDraft ? 'draft' : 'awaiting-moderation'
    logger.debug('submitting form', formValues)
    await this.store.uploadHowTo(formValues)
  }

  get injected() {
    return this.props as IInjectedProps
  }
  get store() {
    return this.injected.howtoStore
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
      slug: title => stripSpecialCharacters(title).toLowerCase(),
    },
  })

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
          onSubmit={v => {
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

                <Flex bg="inherit" px={2} sx={{ width: ['100%', '100%', `${2 / 3 * 100}%`] }} mt={4}>
                  <FormContainer
                    ref={this.formContainerRef as any}
                    id="howtoForm"
                    onSubmit={handleSubmit}
                  >
                    {/* How To Info */}
                    <Flex sx={{ flexDirection: 'column' }}>
                      <Flex
                        card
                        mediumRadius
                        bg={theme.colors.softblue}
                        px={3}
                        py={2}
                        sx={{ alignItems: 'center' }}
                      >
                        <Heading medium>
                          {this.props.parentType === 'create' ? (
                            <span>Create</span>
                          ) : (
                            <span>Edit</span>
                          )}{' '}
                          a How-To
                        </Heading>
                        <Box ml="15px">
                          <ElWithBeforeIcon
                            IconUrl={IconHeaderHowto}
                            height="20px"
                          />
                        </Box>
                      </Flex>
                      <Box
                        sx={{ mt: '20px', display: ['block', 'block', 'none'] }}
                      >
                        <PostingGuidelines />
                      </Box>
                      <Flex
                        card
                        mediumRadius
                        bg={'white'}
                        mt={3}
                        p={4}
                        sx={{ flexWrap: 'wrap', flexDirection: 'column' }}
                      >
                        {/* Left Side */}
                        <Heading small mb={3}>
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
                                component={InputField}
                                maxLength={HOWTO_TITLE_MAX_LENGTH}
                                placeholder={`Make a chair from... (max ${HOWTO_TITLE_MAX_LENGTH} characters)`}
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
                                component={TextAreaField}
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
                              {formValues.files.length !== 0 &&
                              parentType === 'edit' &&
                              !fileEditMode ? (
                                <Flex
                                  sx={{
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                  }}
                                >
                                  {formValues.files.map(file => (
                                    <FileInfo
                                      allowDownload
                                      file={file}
                                      key={file.name}
                                    />
                                  ))}
                                  <Button
                                    variant={'tertiary'}
                                    icon="delete"
                                    onClick={() =>
                                      this.setState({
                                        fileEditMode: !this.state.fileEditMode,
                                      })
                                    }
                                  >
                                    Re-upload files (this will delete the
                                    existing ones)
                                  </Button>
                                </Flex>
                              ) : (
                                <>
                                  <Field
                                    name="files"
                                    component={FileInputField}
                                  />
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

                            <Text small color={'grey'} mt={4}>
                              This image should be landscape. We advise
                              1280x960px
                            </Text>
                          </Flex>
                        </Flex>
                      </Flex>

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
                                medium
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
                    width: [1, 1, 1 / 3],
                    height: '100%',
                  }}
                  bg="inherit"
                  px={2}
                  mt={[0, 0, 4]}
                >
                  <Box
                    sx={{
                      position: ['relative', 'relative', 'fixed'],
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
                      )}{' '}
                    </Button>
                    <Button
                      data-cy={'submit'}
                      onClick={() => this.trySubmitForm(false)}
                      mt={3}
                      variant="primary"
                      type="submit"
                      disabled={submitting}
                      sx={{ width: '100%', mb: ['40px', '40px', 0] }}
                    >
                      <span>Publish</span>
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
