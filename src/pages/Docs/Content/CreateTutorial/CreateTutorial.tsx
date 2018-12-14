import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { Form, Field } from 'react-final-form'
import { FieldArray } from 'react-final-form-arrays'
import arrayMutators from 'final-form-arrays'
import InputAdornment from '@material-ui/core/InputAdornment'
import {
  ITutorial,
  ITutorialFormInput,
} from '../../../../models/tutorial.models'

import { db } from '../../../../utils/firebase'

import { TUTORIAL_TEMPLATE_DATA } from './TutorialTemplate'
import { TagsSelect } from 'src/pages/common/Tags'
import { ISelectedTags } from 'src/models/tags.model'
import { FirebaseFileUploaderField } from 'src/pages/common/FirebaseFileUploader/FirebaseFileUploaderField.jsx'
import helpers from 'src/utils/helpers'
import Button from 'src/components/Button/Button'

import { Step } from './Step/Step.jsx'

import {
  FormContainer,
  Title,
  TutorialForm,
  Background,
  DescriptionContainer,
  StepBackground,
  Label,
  Input,
  TextArea,
  CoverImage,
  Select,
} from './elements'

export interface IState {
  formValues: ITutorialFormInput
  _uploadImgPath: string
  _uploadFilesPath: string
  _toDocsList: boolean
}

const InputField = ({ input, meta, label, ...rest }: any) => (
  <>
    <Label component="label">{label}</Label>
    <Input {...input} {...rest} />
    {meta.error && meta.touched && <span>{meta.error}</span>}
  </>
)

// For now tags are raw in this variable, next we'll need to get them from our server
// let selectedTags: any = []
const required = (value: any) => (value ? undefined : 'Required')

export class CreateTutorial extends React.PureComponent<
  RouteComponentProps<any>,
  IState
> {
  constructor(props: any) {
    super(props)
    this.state = {
      formValues: TUTORIAL_TEMPLATE_DATA,
      _uploadImgPath: 'uploads/test',
      _uploadFilesPath: 'uploads/test',
      _toDocsList: false,
    }
  }

  public submit = async (formValues: ITutorialFormInput) => {
    const timestamp = new Date()
    const slug = helpers.stripSpecialCharacters(formValues.tutorial_title)
    const values: ITutorial = {
      ...this.castFormValuesToCorrectTypes(formValues),
      slug,
      _created: timestamp,
      _modified: timestamp,
    }
    console.log('submitting', values)
    try {
      await db.collection('documentation').add(values)
      console.log('doc set successfully')
      this.props.history.push('/docs/' + slug)
      this.forceUpdate()
    } catch (error) {
      console.log('error while saving the tutorial')
    }
  }

  public validate = async (formValues: ITutorialFormInput) => {
    // TODO: validate cover image exists
    // if (this.state.formValues.cover_image_url === '') {
    // alert('Please provide a cover image before saving your tutorial')
    return Promise.resolve({})
  }

  // By default all tutorial form input fields come as strings. We want to cast to the
  // correct data types if this ever becomes more complex could use
  // https://medium.freecodecamp.org/how-to-write-powerful-schemas-in-javascript-490da6233d37
  public castFormValuesToCorrectTypes(values: ITutorialFormInput) {
    const formattedValues = {
      ...values,
      tutorial_cost: Number(values.tutorial_cost),
    }
    return formattedValues
  }

  public onInputChange = (event: any, inputType: string) => {
    // *** TODO the event.target.value needs to be formated as the article id
    const value = event.target.value
    switch (inputType) {
      case 'tutorial_title':
        const clearUrlSlug = helpers.stripSpecialCharacters(value)
        this.setState({
          formValues: {
            ...this.state.formValues,
            tutorial_title: event.target.value,
            slug: clearUrlSlug,
          },
          _uploadImgPath: 'uploads/' + encodeURIComponent(clearUrlSlug),
          _uploadFilesPath: 'uploads/' + encodeURIComponent(clearUrlSlug),
        })
        break
      case 'tutorial_extern_file_url':
        // TODO check is proper url
        this.setState({
          formValues: {
            ...this.state.formValues,
            tutorial_extern_file_url: event.target.value,
          },
        })
      default:
        this.setState({
          formValues: {
            ...this.state.formValues,
            [inputType]: event.target.value,
          },
        })
        break
    }
  }

  public onSelectedTagsChanged(selectedTags: ISelectedTags) {
    // TODO: make tags save to form values instead
    /*this.setState({
      formValues: {
        ...this.state.formValues,
        tags: selectedTags,
      },
    })*/
  }

  public render() {
    return (
      <div>
        <Title variant="h4" component="h4">
          Create a documentation
        </Title>
        <Form
          onSubmit={this.submit}
          validate={this.validate}
          initialValues={this.state.formValues}
          mutators={{
            ...arrayMutators,
          }}
          render={({ handleSubmit, submitting, values, form, invalid }) => {
            return (
              <FormContainer>
                <TutorialForm onSubmit={handleSubmit}>
                  <Background>
                    <DescriptionContainer>
                      <Field
                        name="workspace_name"
                        validate={required}
                        component={InputField}
                        label="What is your davehakkens.nl account ?"
                        placeholder="@janedoe"
                      />
                      <Field
                        name="tutorial_title"
                        validate={required}
                        component={InputField}
                        label="What is the title of your documentation ?"
                        placeholder="How to make XXX using YYY"
                      />
                      {values.cover_image_url && (
                        <CoverImage
                          src={values.cover_image_url}
                          alt={'cover image'}
                        />
                      )}
                      <Field
                        name="cover_image_url"
                        component={FirebaseFileUploaderField}
                        storagePath={this.state._uploadImgPath}
                        hidden={true}
                        accept="image/png, image/jpeg"
                        buttonText="Upload a cover image"
                      />

                      <Label
                        component="label"
                        style={{ margin: '50px 0 10px' }}
                      >
                        Write a short description for the documentation
                      </Label>
                      <Field name="tutorial_description" validate={required}>
                        {({ input, meta }) => (
                          <div>
                            <TextArea
                              {...input}
                              placeholder="This is what we will do"
                            />
                            {meta.error && meta.touched && (
                              <span>{meta.error}</span>
                            )}
                          </div>
                        )}
                      </Field>
                      <Label
                        component="label"
                        style={{ margin: '50px 0 10px' }}
                      >
                        Add tags
                      </Label>
                      <TagsSelect
                        value={this.state.formValues.tags}
                        onChange={tags => this.onSelectedTagsChanged(tags)}
                      />
                      <Field name="tutorial_time" validate={required}>
                        {({ input, meta }) => (
                          <div>
                            <Label
                              component="label"
                              style={{ margin: '50px 0 10px' }}
                            >
                              How much time does it take ? (hours/week)
                            </Label>
                            <Input
                              {...input}
                              type="text"
                              placeholder="2 hours"
                            />
                            {meta.error && meta.touched && (
                              <span>{meta.error}</span>
                            )}
                          </div>
                        )}
                      </Field>
                      <Field name="tutorial_cost" validate={required}>
                        {({ input, meta }) => (
                          <div>
                            <Label
                              component="label"
                              style={{ margin: '50px 0 10px' }}
                            >
                              How much does it cost (roughly in €)?
                            </Label>
                            <Input
                              {...input}
                              type="number"
                              placeholder="10"
                              startAdornment={
                                <InputAdornment
                                  position="start"
                                  style={{ margin: '0 0 0 5px;' }}
                                >
                                  €
                                </InputAdornment>
                              }
                            />
                            {meta.error && meta.touched && (
                              <span>{meta.error}</span>
                            )}
                          </div>
                        )}
                      </Field>
                      <Label
                        component="label"
                        style={{ margin: '50px 0 10px' }}
                      >
                        How difficult to replicate is your documentation ?
                      </Label>
                      <Select name="difficulty_level" component="select">
                        <option value="easy">easy</option>
                        <option value="medium">medium</option>
                        <option value="difficult">difficult</option>
                      </Select>
                      <Label
                        component="label"
                        style={{ margin: '50px 0 10px' }}
                      >
                        File to support your documentation ? (20mb max)
                      </Label>
                      <Field
                        name="files"
                        component={FirebaseFileUploaderField}
                        storagePath={this.state._uploadImgPath}
                        hidden={true}
                        accept="*"
                        buttonText="Upload a file"
                      />

                      <Field name="tutorial_extern_file_url">
                        {({ input, meta }) => (
                          <div>
                            <Label
                              component="label"
                              style={{ margin: '50px 0 10px' }}
                            >
                              Or a link
                            </Label>
                            <Input
                              {...input}
                              type="text"
                              placeholder="https://drive.google.com/drive/u/2/folders/..."
                            />
                            {meta.error && meta.touched && (
                              <span>{meta.error}</span>
                            )}
                          </div>
                        )}
                      </Field>
                    </DescriptionContainer>
                  </Background>
                  <StepBackground>
                    <FieldArray name="steps">
                      {({ fields }) => (
                        <div>
                          {fields.map((step, index: any) => (
                            <Step
                              step={step}
                              index={index}
                              key={index}
                              onDelete={(fieldIndex: any) => {
                                fields.remove(fieldIndex)
                              }}
                              values={values}
                            />
                          ))}
                          <Button
                            text={'Add step'}
                            addstep
                            style={{ margin: '60px auto', display: 'block' }}
                            onClick={() => {
                              fields.push({
                                title: '',
                                text: '',
                                images: [],
                              })
                            }}
                          />
                        </div>
                      )}
                    </FieldArray>
                    <Button
                      type="submit"
                      text={'Save'}
                      saveTut
                      disabled={submitting || invalid}
                    />
                  </StepBackground>
                </TutorialForm>
              </FormContainer>
            )
          }}
        />
      </div>
    )
  }
}
