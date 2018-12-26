import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { Form, Field } from 'react-final-form'
import { FieldArray } from 'react-final-form-arrays'
import arrayMutators from 'final-form-arrays'
import './CreateTutorial.scss'
import { ITutorial, ITutorialFormInput } from 'src/models/tutorial.models'
import { db } from 'src/utils/firebase'
import { TUTORIAL_TEMPLATE_DATA } from './TutorialTemplate'
import {
  IFirebaseUploadInfo,
  FirebaseFileUploader,
} from 'src/pages/common/FirebaseFileUploader/FirebaseFileUploader'
import helpers from 'src/utils/helpers'
import { TagsSelect } from 'src/pages/common/Tags'
import { ISelectedTags } from 'src/models/tags.model'
import { UploadedFile } from 'src/pages/common/UploadedFile/UploadedFile'
import { FirebaseFileUploaderField } from 'src/pages/common/FirebaseFileUploader/FirebaseFileUploaderField'
import Button from 'src/components/Button/Button'
import { InputField, Label, TextArea } from 'src/components/Form/Fields'
import { Step } from './Step/Step'
import {
  FormContainer,
  Title,
  TutorialForm,
  Background,
  DescriptionContainer,
  StepBackground,
  CoverImage,
  Select,
} from './elements'

export interface IState {
  formValues: ITutorialFormInput
  formSaved: boolean
  _docID: string
  _uploadPath: string
  _toDocsList: boolean
}

const required = (value: any) => (value ? undefined : 'Required')

export class CreateTutorial extends React.PureComponent<
  RouteComponentProps<any>,
  IState
> {
  uploadRefs: { [key: string]: UploadedFile | null } = {}
  constructor(props: any) {
    super(props)
    // generate unique id for db and storage references and assign to state
    const databaseRef = db.collection('documentation').doc()
    const docID = databaseRef.id
    this.state = {
      formValues: { ...TUTORIAL_TEMPLATE_DATA, id: docID },
      formSaved: false,
      _docID: docID,
      _uploadPath: `uploads/documentation/${docID}`,
      _toDocsList: false,
    }
  }

  componentWillUnmount() {
    // remove any uploaded images if not saved
    if (!this.state.formSaved) {
      this.purgeUploads()
    }
  }

  // when a file upload component is created can optionally add a named reference
  // to itself to enable calling methods (such as 'delete()') on it later from this component
  // this will automatically populate as null when the component is destroyed
  addUploadRef(ref: UploadedFile | null, key: string) {
    this.uploadRefs[key] = ref
  }

  // remove any uploaded images or files (case when user decided not to save doc)
  // requires a name to be given to all UploadedFile components
  purgeUploads() {
    Object.keys(this.uploadRefs).forEach(key => {
      const ref = this.uploadRefs[key]
      if (ref) {
        ref.delete()
      }
    })
  }

  uploadedCoverImageDeleted() {
    const values = { ...this.state.formValues }
    values.cover_image = null
    this.setState({ formValues: values })
  }

  public onSubmit = async (formValues: ITutorialFormInput) => {
    if (!this.state.formValues.cover_image) {
      alert('Please provide a cover image before saving your tutorial')
    } else {
      const timestamp = new Date()
      const slug = helpers.stripSpecialCharacters(formValues.tutorial_title)
      // convert data to correct types and populate metadata
      const values: ITutorial = {
        ...this.castFormValuesToCorrectTypes(formValues),
        slug,
        cover_image: formValues.cover_image as IFirebaseUploadInfo,
        _created: timestamp,
        _modified: timestamp,
      }
      try {
        await db
          .collection('documentation')
          .doc(formValues.id)
          .set(values)
        this.setState({ formSaved: true })
        this.props.history.push('/docs/' + this.state.formValues.slug)
        this.forceUpdate()
      } catch (error) {
        console.log('error while saving the tutorial')
      }
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

  /* EXAMPLE
    You want to pass the step index to the handle upload step image success function
    When you have the url of the image you want to merge it with the existing step images
    Then merge the updated step with all steps and update the state
  */
  public handleUploadCoverSuccess = (fileInfo: IFirebaseUploadInfo) => {
    this.setState({
      formValues: {
        ...this.state.formValues,
        cover_image: fileInfo,
      },
    })
  }

  public onInputChange = (event: any, inputType: string) => {
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
    console.log('selected tags changed', selectedTags)
    // TODO: make tags save to form values instead
    this.setState({
      formValues: {
        ...this.state.formValues,
        tags: selectedTags,
      },
    })
  }

  public render() {
    const { formValues } = this.state
    console.log('form values', formValues)
    return (
      <div>
        <Title variant="h4" component="h4">
          Create a documentation
        </Title>
        <Form
          onSubmit={this.onSubmit}
          initialValues={formValues}
          validate={this.validate}
          mutators={{
            ...arrayMutators,
          }}
          render={({
            handleSubmit,
            mutators,
            submitting,
            values,
            form,
            invalid,
          }) => {
            const v = values as ITutorial
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
                        customEvent
                        onBlur={(event: any) => {
                          this.onInputChange(event, 'tutorial_title')
                        }}
                      />
                      {v.cover_image ? (
                        <UploadedFile
                          file={v.cover_image}
                          imagePreview
                          showDelete
                          onFileDeleted={() => this.uploadedCoverImageDeleted()}
                          ref={el => this.addUploadRef(el, 'coverImage')}
                        />
                      ) : (
                        // <CoverImage
                        //   src={values.cover_image_url}
                        //   alt={'cover image'}
                        // />
                        <Field
                          name="cover_image"
                          component={FirebaseFileUploaderField}
                          storagePath={this.state._uploadPath}
                          hidden={true}
                          accept="image/png, image/jpeg"
                          buttonText="Upload a cover image"
                        />
                      )}

                      <Label
                        text={'Write a short description for the documentation'}
                        style={{ margin: '50px 0 10px' }}
                      />
                      <Field
                        name="tutorial_description"
                        validate={required}
                        component={TextArea}
                        placeholder="This is what we will do"
                      />
                      <Label
                        text={'Add Tags'}
                        style={{ margin: '50px 0 10px' }}
                      />
                      <TagsSelect
                        value={v.tags}
                        onChange={tags => this.onSelectedTagsChanged(tags)}
                      />
                      <Field
                        name="tutorial_time"
                        validate={required}
                        component={InputField}
                        label="How much time does it take ? (hours/week)"
                        placeholder="2 hours"
                      />
                      <Field
                        name="tutorial_cost"
                        validate={required}
                        component={InputField}
                        label="How much does it cost (roughly in €)?"
                        placeholder="10"
                      />
                      <Label
                        text={
                          'How difficult to replicate is your documentation ?'
                        }
                        style={{ margin: '50px 0 10px' }}
                      />
                      <Select name="difficulty_level" component="select">
                        <option value="easy">easy</option>
                        <option value="medium">medium</option>
                        <option value="difficult">difficult</option>
                      </Select>
                      <Label
                        text={'File to support your documentation ? (20mb max)'}
                        style={{ margin: '50px 0 10px' }}
                      />
                      <FirebaseFileUploader
                        hidden={true}
                        buttonText="Upload files"
                        storagePath={this.state._uploadPath}
                        onUploadSuccess={fileInfo => {
                          console.log('file uploaded successfully', fileInfo)
                          mutators.push('tutorial_files', fileInfo)
                        }}
                      />
                      {v.tutorial_files.map((file, index) => (
                        <UploadedFile
                          key={file.downloadUrl}
                          file={file}
                          showDelete
                          onFileDeleted={() => {
                            mutators.remove('tutorial_files', index)
                          }}
                          ref={el =>
                            this.addUploadRef(el, `tutorial_files[${index}]`)
                          }
                        />
                      ))}
                      <Field
                        name="tutorial_extern_file_url"
                        component={InputField}
                        label="Or a link"
                        placeholder="https://drive.google.com/drive/u/2/folders/..."
                      />
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
                              _uploadPath={this.state._uploadPath}
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
