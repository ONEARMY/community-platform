import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { Form, Field } from 'react-final-form'
import { FieldArray } from 'react-final-form-arrays'
import arrayMutators from 'final-form-arrays'
import { IHowto, IHowtoFormInput } from 'src/models/howto.models'
import { afs } from 'src/utils/firebase'
import { TUTORIAL_TEMPLATE_DATA } from './TutorialTemplate'
import { IFirebaseUploadInfo } from 'src/components/FirebaseFileUploader/FirebaseFileUploader'
import { stripSpecialCharacters } from 'src/utils/helpers'
import { UploadedFile } from 'src/pages/common/UploadedFile/UploadedFile'
import {
  InputField,
  TextAreaField,
  SelectField,
} from 'src/components/Form/Fields'
import { FirebaseFileUploaderField } from 'src/components/Form/FirebaseFileUploader.field'
import { Step } from './Step/Step'
import { Button } from 'src/components/Button'
import { FieldState } from 'final-form'
import { HowtoStore } from 'src/stores/Howto/howto.store'
import Heading from 'src/components/Heading'
import PageContainer from 'src/components/Layout/PageContainer'
import { FlexContainer } from 'src/components/Layout/FlexContainer'
import { BoxContainer } from 'src/components/Layout/BoxContainer'
import { TagsSelectField } from 'src/components/Form/TagsSelect.field'

import Icon from 'src/components/Icons'

export interface IState {
  formValues: IHowtoFormInput
  formSaved: boolean
  _docID: string
  _uploadPath: string
  _toDocsList: boolean
}

const required = (value: any) => (value ? undefined : 'Required')

export class CreateHowto extends React.PureComponent<
  RouteComponentProps<any>,
  IState
> {
  uploadRefs: { [key: string]: UploadedFile | null } = {}
  store = new HowtoStore()
  constructor(props: any) {
    super(props)
    // generate unique id for db and storage references and assign to state
    const databaseRef = afs.collection('documentation').doc()
    const docID = databaseRef.id
    this.state = {
      formValues: { id: docID } as IHowtoFormInput,
      formSaved: false,
      _docID: docID,
      _uploadPath: `uploads/documentation/${docID}`,
      _toDocsList: false,
    }
  }

  public onSubmit = async (formValues: IHowtoFormInput) => {
    const inputValues = formValues as IHowtoFormInput
    if (!inputValues.cover_image) {
      alert('Please provide a cover image before saving your tutorial')
    } else {
      const timestamp = new Date()
      const slug = stripSpecialCharacters(formValues.tutorial_title)
      // convert data to correct types and populate metadata
      const values: IHowto = {
        ...formValues,
        slug,
        tutorial_cost: Number(formValues.tutorial_cost),
        cover_image: formValues.cover_image as IFirebaseUploadInfo,
        _created: timestamp,
        _modified: timestamp,
      }
      try {
        await afs
          .collection('documentation')
          .doc(formValues.id)
          .set(values)
        this.setState({ formSaved: true })
        this.props.history.push('/how-to/' + slug)
      } catch (error) {
        console.log('error while saving the tutorial')
      }
    }
  }

  public validateTitle = async (value: any, meta?: FieldState) => {
    if (meta && (!meta.dirty && meta.valid)) {
      return undefined
    }
    if (value) {
      const error = this.store.isSlugUnique(stripSpecialCharacters(value))
      return error
    } else if ((meta && (meta.touched || meta.visited)) || value === '') {
      return 'A title for your how-to is required'
    }
    return undefined
  }

  public validate = async (formValues: IHowtoFormInput) => {
    // TODO: validate cover image exists
    // if (this.state.formValues.cover_image_url === '') {
    // alert('Please provide a cover image before saving your tutorial')
    return Promise.resolve({})
  }

  public render() {
    const { formValues } = this.state
    console.log('formvalues', formValues)
    return (
      <PageContainer>
        <Form
          onSubmit={v => this.onSubmit(v as IHowtoFormInput)}
          initialValues={formValues}
          validate={() => this.validate}
          validateOnBlur
          mutators={{
            ...arrayMutators,
            clearCoverImage: (args, state, utils) => {
              utils.changeValue(state, 'cover_image', () => null)
            },
          }}
          render={({
            handleSubmit,
            mutators,
            submitting,
            values,
            form,
            invalid,
          }) => {
            const v = values as IHowto
            return (
              <form onSubmit={handleSubmit}>
                <BoxContainer bg="white">
                  <Heading medium>Create your How-To</Heading>
                  <FlexContainer p={0} mb={3}>
                    <BoxContainer p={0} mr={3}>
                      <Field
                        name="tutorial_title"
                        validateFields={[]}
                        validate={value => this.validateTitle(value)}
                        component={InputField}
                        placeholder="Title of your How-to *"
                      />
                      <Field
                        name="tags"
                        validateFields={[]}
                        component={TagsSelectField}
                      />
                      <FlexContainer p={0}>
                        <Field
                          name="tutorial_time"
                          validate={required}
                          validateFields={[]}
                          component={InputField}
                          placeholder="How much time? *"
                          style={{ marginRight: '4px' }}
                        />
                        <Field
                          name="difficulty_level"
                          component={SelectField}
                          validateFields={[]}
                          placeholder="How hard is it? *"
                          style={{ marginLeft: '4px' }}
                        >
                          <option value="" disabled>
                            How hard is it? *
                          </option>
                          <option value="easy">easy</option>
                          <option value="medium">medium</option>
                          <option value="difficult">difficult</option>
                        </Field>
                      </FlexContainer>
                      <Field
                        name="tutorial_time"
                        component={FirebaseFileUploaderField}
                        buttonText="UPLOAD FILES"
                        storagePath={this.state._uploadPath}
                        hidden={true}
                        icon="upload"
                      />

                      {v.tutorial_files &&
                        v.tutorial_files.map((file, index) => (
                          <UploadedFile
                            key={file.downloadUrl}
                            file={file}
                            showDelete
                            onFileDeleted={() => {
                              mutators.remove('tutorial_files', index)
                            }}
                          />
                        ))}
                    </BoxContainer>
                    {v.cover_image && v.cover_image.downloadUrl ? (
                      <UploadedFile
                        file={v.cover_image}
                        imagePreview
                        showDelete
                        onFileDeleted={form.mutators.clearCoverImage}
                      />
                    ) : (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          border: '1px solid #dddddd',
                          justifyContent: 'center',
                          padding: '16px',
                        }}
                      >
                        <>
                          <FlexContainer p={0} mb={3} justifyContent="center">
                            <Icon glyph="upload" />
                          </FlexContainer>
                          <Field
                            name="cover_image"
                            validateFields={[]}
                            component={FirebaseFileUploaderField}
                            storagePath={this.state._uploadPath}
                            hidden={true}
                            accept="image/png, image/jpeg"
                            buttonText="UPLOAD IMAGE"
                          />
                        </>
                      </div>
                    )}
                  </FlexContainer>
                  <Field
                    name="tutorial_description"
                    validate={required}
                    validateFields={[]}
                    component={TextAreaField}
                    placeholder="Introduction to your How-To, keep it to 100 words please! *"
                  />
                </BoxContainer>

                <FieldArray name="steps">
                  {({ fields }) => (
                    <BoxContainer bg="white" mt={3}>
                      {fields.map((step, index: number) => (
                        <Step
                          step={step}
                          index={index}
                          key={index}
                          onDelete={(fieldIndex: number) => {
                            fields.remove(fieldIndex)
                          }}
                          values={values}
                          _uploadPath={this.state._uploadPath}
                        />
                      ))}
                      <Button
                        icon={'add'}
                        width={300}
                        mx="auto"
                        my={60}
                        bg="yellow"
                        onClick={() => {
                          fields.push({
                            title: '',
                            text: '',
                            images: [],
                          })
                        }}
                      >
                        add step
                      </Button>
                    </BoxContainer>
                  )}
                </FieldArray>
                <Button
                  type="submit"
                  width={1}
                  bg="green"
                  icon="check"
                  mx="auto"
                  disabled={submitting || invalid}
                >
                  Save
                </Button>
              </form>
            )
          }}
        />
      </PageContainer>
    )
  }
}
