import React from 'react'
import { Form, Field } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { InputField } from 'src/components/Form/Fields'
import { IUser, IUserFormInput } from 'src/models/user.models'
import ImagePreview from 'src/pages/common/UploadedFile/ImagePreview'
import { LinkButton } from 'src/pages/common/Header/CommunityHeader/elements'
import { Button } from 'src/components/Button'

interface IState {
  formValues: IUserFormInput
  formSaved: boolean
  errors: any
}

interface IProps {
  onChange: (formValues: IUserFormInput) => void
  readOnly?: boolean
  user: IUser
}

export class ProfileEditForm extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      formValues: props.user as IUserFormInput,
      formSaved: false,
      errors: null,
    }
  }

  public get uploadPath() {
    return this.props.user && `uploads/users/${this.props.user._id}`
  }

  public valuesUpdated(values) {
    // used to pass value changes to parent
    return this.props.onChange(values)
  }
  public onSubmit(values: IUserFormInput) {
    // no submit function passed to component as handled in parent
    return
  }

  public deleteAvatar = () => {}

  public validate(formValues: IUserFormInput): boolean {
    // currently no validation done
    return true
  }

  public importProfileFromDH() {
    const mention_name = this.state.formValues.mention_name
    console.log('importing mention name', mention_name)
  }

  public render() {
    const { formValues, errors } = this.state
    const { user } = this.props
    return (
      <div>
        {errors ? (
          <ul>
            {Object.entries(errors).map(([key, value]) => (
              <li key={key.toString()}>{value}</li>
            ))}
          </ul>
        ) : null}
        <Form
          onSubmit={values => this.onSubmit(values as IUserFormInput)}
          initialValues={formValues}
          mutators={{
            ...arrayMutators,
            clearCoverImage: (args, state, utils) => {
              utils.changeValue(state, 'cover_image', () => null)
            },
          }}
          render={({ handleSubmit, submitting, form, invalid, values }) => {
            // when rendered propagate the current values back up
            this.valuesUpdated(values)
            return (
              <form onSubmit={handleSubmit}>
                <>
                  {!this.props.readOnly && (
                    <>
                      {/* <UploadedFile
                        file={values.avatar}
                        imagePreview
                        showDelete
                        onFileDeleted={form.mutators.clearCoverImage}
                      /> */}

                      {/* <Field
                        name="avatar"
                        component={FirebaseFileUploaderField}
                        storagePath={this.uploadPath}
                        hidden={true}
                        accept="image/png, image/jpeg"
                        buttonText="Upload your avatar"
                      /> */}
                    </>
                  )}
                  <ImagePreview
                    imageSrc={user.avatar}
                    imageAlt={user.mention_name ? user.mention_name : user._id}
                    onDelete={this.deleteAvatar}
                    showDelete={false}
                  />

                  <Field
                    name="mention_name"
                    component={InputField}
                    label="User Name"
                    disabled={this.props.readOnly}
                  />
                  {!this.props.readOnly && (
                    <Button
                      disabled={!values.mention_name}
                      onClick={() => this.importProfileFromDH()}
                    >
                      Import @{values.mention_name} from Dave Hakkens
                    </Button>
                  )}

                  <Field
                    name="country"
                    component={InputField}
                    label="Country"
                    disabled={this.props.readOnly}
                  />
                  {this.props.readOnly ? null : (
                    <>
                      <LinkButton
                        className="nav-link"
                        to="/profile/change-password"
                      >
                        Change password
                      </LinkButton>
                    </>
                  )}
                </>
              </form>
            )
          }}
        />
      </div>
    )
  }
}
