import * as React from 'react'
import { Form, Field } from 'react-final-form'
import Heading from 'src/components/Heading'
import { IUser } from 'src/models/user.models'
import { Avatar } from 'src/components/Avatar'
import { InputField, TextAreaField } from 'src/components/Form/Fields'
import { UserStore } from 'src/stores/User/user.store'
import { Button } from 'src/components/Button'

// tslint:disable no-empty-interface
interface IFormValues extends Partial<IUser> {
  // form values are simply subset of user profile fields
}

interface IProps {
  user: IUser
  userStore: UserStore
}
interface IState {
  formValues: IFormValues
  readOnly: boolean
  isSaving?: boolean
}
export class ProfileEditForm extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = { formValues: props.user, readOnly: true }
  }

  public async saveProfile(values: IFormValues) {
    await this.props.userStore.updateUserProfile(values)
    this.setState({ readOnly: true })
  }

  render() {
    const user = this.props.user
    return (
      <Form
        // submission managed by button and state above
        onSubmit={values => this.saveProfile(values)}
        initialValues={this.state.formValues}
        render={({ handleSubmit, submitting }) => {
          return (
            <>
              {this.state.readOnly && (
                <Button
                  variant={'outline'}
                  m={0}
                  icon={'edit'}
                  style={{ float: 'right' }}
                  onClick={() => this.setState({ readOnly: false })}
                >
                  Edit Profile
                </Button>
              )}
              {/* NOTE - need to put submit method on form to prevent
              default post request */}
              <form onSubmit={handleSubmit}>
                {!this.state.readOnly && (
                  <Button
                    variant={submitting ? 'disabled' : 'outline'}
                    m={0}
                    icon={'check'}
                    style={{ float: 'right' }}
                    disabled={submitting}
                    type="submit"
                  >
                    Save Profile
                  </Button>
                )}
                <Heading medium bold>
                  Profile
                </Heading>
                <Avatar userName={user.userName} width="180px" />
                <Field
                  name="userName"
                  component={InputField}
                  label="User Name"
                  disabled={true}
                />
                <Field
                  name="about"
                  component={TextAreaField}
                  label="About"
                  disabled={this.state.readOnly}
                />
                <Field
                  name="country"
                  component={InputField}
                  label="Country"
                  disabled={this.state.readOnly || submitting}
                />
              </form>
            </>
          )
        }}
      />
    )
  }
}
