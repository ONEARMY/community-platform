import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { Form, Field } from 'react-final-form'
import styled from 'styled-components'
import { FieldArray } from 'react-final-form-arrays'
import arrayMutators from 'final-form-arrays'
import createDecorator from 'final-form-calculate'
import { IHowtoFormInput, IHowto } from 'src/models/howto.models'
import Text from 'src/components/Text'
import { UploadedFile } from 'src/pages/common/UploadedFile/UploadedFile'
import { InputField, TextAreaField } from 'src/components/Form/Fields'
import { SelectField } from 'src/components/Form/Select.field'
import { HowtoStep } from './HowtoStep.form'
import { Button } from 'src/components/Button'
import { HowtoStore } from 'src/stores/Howto/howto.store'
import Heading from 'src/components/Heading'
import Flex from 'src/components/Flex'
import { TagsSelectField } from 'src/components/Form/TagsSelect.field'
import { ImageInputField } from 'src/components/Form/ImageInput.field'
import { FileInputField } from 'src/components/Form/FileInput.field'
import posed, { PoseGroup } from 'react-pose'
import { inject } from 'mobx-react'
import { Modal } from 'src/components/Modal/Modal'
import { HowToSubmitStatus } from './SubmitStatus'
import { stripSpecialCharacters } from 'src/utils/helpers'
import { PostingGuidelines } from './PostingGuidelines'
import theme from 'src/themes/styled.theme'
import { DIFFICULTY_OPTIONS, TIME_OPTIONS } from './FormSettings'
import { Image, Box } from 'rebass'
import { FileInfo } from 'src/components/FileInfo/FileInfo'

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
  onSubmit: (value: IHowtoFormInput) => void
}
interface IInjectedProps extends IProps {
  howtoStore: HowtoStore
}

const AnimationContainer = posed.div({
  // use flip pose to prevent default spring action on list item removed
  flip: {
    transition: {
      // type: 'tween',
      // ease: 'linear',
    },
  },
  // use a pre-enter pose as otherwise default will be the exit state and so will animate
  // horizontally as well
  preEnter: {
    opacity: 0,
  },
  enter: {
    opacity: 1,
    duration: 200,
    applyAtStart: { display: 'block' },
  },
  exit: {
    applyAtStart: { display: 'none' },
    duration: 200,
  },
})

const Label = styled.label`
  font-size: ${theme.fontSizes[2] + 'px'};
  margin-bottom: ${theme.space[2] + 'px'};
  display: block;
`
// validation - return undefined if no error (i.e. valid)
const required = (value: any) => (value ? undefined : 'Required')

@inject('howtoStore')
export class HowtoForm extends React.Component<IProps, IState> {
  uploadRefs: { [key: string]: UploadedFile | null } = {}
  constructor(props: any) {
    super(props)
    this.state = {
      formSaved: false,
      _toDocsList: false,
      editCoverImg: false,
      fileEditMode: false,
    }
  }

  get injected() {
    return this.props as IInjectedProps
  }
  get store() {
    return this.injected.howtoStore
  }

  public validateTitle = async (value: any) => {
    return this.store.validateTitle(value, 'v2_howtos')
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
    const { editCoverImg, fileEditMode } = this.state
    return (
      <Form
        onSubmit={v => {
          this.setState({ showSubmitModal: true })
          this.props.onSubmit(v as IHowtoFormInput)
        }}
        initialValues={formValues}
        mutators={{
          ...arrayMutators,
        }}
        validateOnBlur
        decorators={[this.calculatedFields]}
        render={({ submitting, values, invalid, errors, handleSubmit }) => {
          const disabled = invalid || submitting
          return (
            <Flex mx={-2} bg={'inherit'} flexWrap="wrap">
              <Flex bg="inherit" px={2} width={[1, 1, 2 / 3]} mt={4}>
                <form id="howtoForm" onSubmit={handleSubmit}>
                  {/* How To Info */}
                  <Flex flexDirection={'column'}>
                    <Flex
                      card
                      mediumRadius
                      bg={theme.colors.softblue}
                      px={3}
                      py={2}
                    >
                      <Heading medium>
                        {this.props.parentType === 'create' ? (
                          <span>Create</span>
                        ) : (
                          <span>Edit</span>
                        )}{' '}
                        your How-To
                      </Heading>
                    </Flex>
                    <Flex
                      card
                      mediumRadius
                      bg={'white'}
                      mt={5}
                      p={4}
                      flexWrap="wrap"
                      flexDirection="column"
                    >
                      {/* Left Side */}
                      <Heading small mb={3}>
                        Intro
                      </Heading>
                      <Flex mx={-2} flexDirection={['column', 'column', 'row']}>
                        <Flex flex={[1, 1, 4]} px={2} flexDirection="column">
                          <Flex flexDirection={'column'} mb={3}>
                            <Label htmlFor="title">
                              Title of your How-to *
                            </Label>
                            <Field
                              id="title"
                              name="title"
                              validateFields={[]}
                              validate={value =>
                                this.props.parentType === 'create'
                                  ? this.validateTitle(value)
                                  : false
                              }
                              component={InputField}
                              placeholder="Make a chair from...
                            "
                            />
                          </Flex>
                          <Flex flexDirection={'column'} mb={3}>
                            <Label>Select tags for your How-to (max 4) *</Label>
                            <Field
                              name="tags"
                              component={TagsSelectField}
                              category="how-to"
                            />
                          </Flex>
                          <Flex flexDirection={'column'} mb={3}>
                            <Label htmlFor="time">
                              How long does it take? *
                            </Label>
                            <Field
                              id="time"
                              name="time"
                              validate={required}
                              validateFields={[]}
                              options={TIME_OPTIONS}
                              component={SelectField}
                              placeholder="How much time? *"
                            />
                          </Flex>
                          <Flex flexDirection={'column'} mb={3}>
                            <Label htmlFor="difficulty_level">
                              Difficulty level? *
                            </Label>
                            <Field
                              px={1}
                              id="difficulty_level"
                              name="difficulty_level"
                              validate={required}
                              validateFields={[]}
                              component={SelectField}
                              options={DIFFICULTY_OPTIONS}
                              placeholder="How hard is it? *"
                            />
                          </Flex>
                          <Flex flexDirection={'column'} mb={3}>
                            <Label htmlFor="description">
                              Short description of your How-to *
                            </Label>
                            <Field
                              id="description"
                              name="description"
                              validate={required}
                              validateFields={[]}
                              component={TextAreaField}
                              style={{
                                resize: 'none',
                                flex: 1,
                                minHeight: '150px',
                              }}
                              placeholder="Introduction to your How-To, keep it to 100 words please! *"
                            />
                          </Flex>
                          <Label htmlFor="description">
                            Do you have supporting file to help others replicate
                            your How-to?
                          </Label>
                          <Flex flexDirection={'column'} mb={[4, 4, 0]}>
                            {formValues.files.length !== 0 &&
                            parentType === 'edit' &&
                            !fileEditMode ? (
                              <Flex
                                flexDirection={'column'}
                                alignItems={'center'}
                              >
                                {formValues.files.map(file => (
                                  <FileInfo
                                    allowDownload
                                    file={file}
                                    key={file.name}
                                  />
                                ))}
                                <Button
                                  small
                                  variant={'tertiary'}
                                  icon="delete"
                                  onClick={() =>
                                    this.setState({
                                      fileEditMode: !this.state.fileEditMode,
                                    })
                                  }
                                >
                                  Re-upload files (this will delete the existing
                                  ones)
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
                        <Flex px={2} flex={[1, 1, 3]} flexDirection={'column'}>
                          <Label htmlFor="cover_image">Cover image *</Label>
                          {formValues.cover_image && !editCoverImg ? (
                            <Flex
                              alignItems={'center'}
                              justifyContent={'center'}
                              flexDirection={'column'}
                            >
                              <Image
                                sx={{ opacity: 0.5 }}
                                src={formValues.cover_image.downloadUrl}
                              />
                              <Button
                                icon={'delete'}
                                variant={'tertiary'}
                                sx={{ position: 'absolute' }}
                                onClick={() =>
                                  this.setState({
                                    editCoverImg: !editCoverImg,
                                  })
                                }
                              />
                            </Flex>
                          ) : (
                            <Field
                              id="cover_image"
                              name="cover_image"
                              validate={required}
                              validateFields={[]}
                              component={ImageInputField}
                            />
                          )}

                          <Text small color={'grey'} mt={2}>
                            This image should be landscape. We advise 1280x960px
                          </Text>
                          <Flex mt={2}>
                            <Field
                              name="caption"
                              component={InputField}
                              placeholder="Insert Caption"
                            />
                          </Flex>
                        </Flex>
                      </Flex>
                    </Flex>
                  </Flex>

                  {/* Steps Info */}
                  <FieldArray name="steps">
                    {({ fields }) => (
                      <>
                        <PoseGroup preEnterPose="preEnter">
                          {fields.map((name, index: number) => (
                            <AnimationContainer
                              key={fields.value[index]._animationKey}
                            >
                              <HowtoStep
                                key={fields.value[index]._animationKey}
                                step={name}
                                index={index}
                                images={fields.value[index].images}
                                onDelete={(fieldIndex: number) => {
                                  fields.remove(fieldIndex)
                                }}
                              />
                            </AnimationContainer>
                          ))}
                        </PoseGroup>
                        <Flex>
                          <Button
                            icon={'add'}
                            mx="auto"
                            my={20}
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
                </form>
                {this.state.showSubmitModal && (
                  <Modal>
                    <>
                      <HowToSubmitStatus />
                      <Button
                        mt={3}
                        variant={submitting ? 'disabled' : 'outline'}
                        icon="arrow-forward"
                        onClick={() =>
                          this.props.history.push('/how-to/' + values.slug)
                        }
                      >
                        View How-To
                      </Button>
                    </>
                  </Modal>
                )}
              </Flex>
              {/* post guidelines container */}
              <Flex
                flexDirection={'column'}
                width={[1, 1, 1 / 3]}
                height={'100%'}
                bg="inherit"
                px={2}
                mt={4}
              >
                <Box sx={{ position: 'fixed', maxWidth: '400px' }}>
                  <PostingGuidelines />
                  <Button
                    onClick={() => {
                      const form = document.getElementById('howtoForm')
                      if (typeof form !== 'undefined' && form !== null) {
                        form.dispatchEvent(
                          new Event('submit', { cancelable: true }),
                        )
                      }
                    }}
                    width={1}
                    mt={3}
                    variant={disabled ? 'primary' : 'primary'}
                    type="submit"
                    disabled={submitting || invalid}
                  >
                    {this.props.parentType === 'create' ? (
                      <span>Publish</span>
                    ) : (
                      <span>Save changes</span>
                    )}{' '}
                  </Button>
                </Box>
              </Flex>
            </Flex>
          )
        }}
      />
    )
  }
}
