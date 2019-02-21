import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { Form, Field } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { IPostFormInput } from 'src/models/discussions.models'
import { afs } from 'src/utils/firebase'
import { POST_TEMPLATE_DATA } from './PostTemplate'
import helpers from 'src/utils/helpers'
import { UploadedFile } from 'src/pages/common/UploadedFile/UploadedFile'
import { InputField } from 'src/components/Form/Fields'
import { Editor, VARIANT } from 'src/components/Editor/'

import { IDiscussionPost } from 'src/models/discussions.models'

import { Button } from 'src/components/Button/'

export interface IState {
  formValues: IPostFormInput
  formSaved: boolean
  postContent: string
}

const required = (value: any) => (value ? undefined : 'Required')

export class PostCreate extends React.PureComponent<
  RouteComponentProps<any>,
  IState
> {
  uploadRefs: { [key: string]: UploadedFile | null } = {}
  constructor(props: any) {
    super(props)
    // generate unique id for db and storage references and assign to state
    const databaseRef = afs.collection('documentation').doc()
    const docID = databaseRef.id
    this.state = {
      formValues: { ...POST_TEMPLATE_DATA },
      formSaved: false,
      postContent: '',
    }
  }

  public onSubmit = async (formValues: any) => {
    const content = this.state.postContent
    const timestamp = new Date()
    const slug = helpers.stripSpecialCharacters(formValues.title)
    // convert data to correct types and populate metadata
    const values: IDiscussionPost = {
      ...formValues,
      content,
      _created: timestamp,
    }
    try {
      await afs
        .collection('discussions')
        .doc()
        .set(values)
      this.setState({ formSaved: true })
      this.props.history.push('/' + slug)
    } catch (error) {
      console.log('error while saving the Post')
    }
  }

  public validate = async (formValues: IPostFormInput) => {
    // TODO: validate cover image exists
    // if (this.state.formValues.cover_image_url === '') {
    // alert('Please provide a cover image before saving your tutorial')
    return Promise.resolve({})
  }

  public render() {
    const { formValues } = this.state
    return (
      <div>
        <h2 style={{ marginTop: 0 }}>Create a Post</h2>
        <Form
          onSubmit={this.onSubmit}
          initialValues={formValues}
          validate={() => this.validate}
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
            const v = values as IDiscussionPost
            return (
              <div>
                <form onSubmit={handleSubmit}>
                  <Field
                    name="title"
                    validate={required}
                    component={InputField}
                    label="What is the title of your post ?"
                    placeholder="Post title"
                  />
                  <Editor
                    content={''}
                    variant={VARIANT.SMALL}
                    onChange={content => {
                      console.log('content changed : ' + content)
                      this.setState({ postContent: content })
                      return content.indexOf('') === -1
                    }}
                  />

                  <Button
                    type="submit"
                    icon={'check'}
                    disabled={submitting || invalid}
                  >
                    Save
                  </Button>
                </form>
              </div>
            )
          }}
        />
      </div>
    )
  }
}
