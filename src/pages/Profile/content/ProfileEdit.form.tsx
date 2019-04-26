import * as React from 'react'
import { Form, Field } from 'react-final-form'
import Heading from 'src/components/Heading'
import { IUser } from 'src/models/user.models'
import { Avatar } from 'src/components/Avatar'
import { InputField, TextAreaField } from 'src/components/Form/Fields'
import { UserStore } from 'src/stores/User/user.store'
import { Button } from 'src/components/Button'
import { TextNotification } from 'src/components/Notification/TextNotification'
import { observer, inject } from 'mobx-react'

// tslint:disable no-empty-interface
interface IFormValues extends Partial<IUser> {
  // form values are simply subset of user profile fields
}
interface IProps {
  // no additional props here
}
interface IInjectedProps {
  userStore: UserStore
}
interface IState {
  formValues: IFormValues
  readOnly: boolean
  isSaving?: boolean
  showNotification?: boolean
}
// we inject the userstore here instead of passing down as would have to pass
// from Profile -> UserProfile -> ProfileEditForm which is less reliable
// could use contextAPI but as we have mobx feels easier
@inject('userStore')
@observer
export class ProfileEditForm extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    const user = this.injected.userStore.user
    this.state = { formValues: user ? user : {}, readOnly: true }
  }

  get injected() {
    return this.props as IInjectedProps
  }

  public async saveProfile(values: IFormValues) {
    await this.injected.userStore.updateUserProfile(values)
    this.setState({ readOnly: true, showNotification: true })
  }

  render() {
    const user = this.injected.userStore.user
    return user ? (
      <Form
        // submission managed by button and state above
        onSubmit={values => this.saveProfile(values)}
        initialValues={user}
        render={({ handleSubmit, submitting }) => {
          return (
            <>
              {this.state.readOnly && (
                <div style={{ float: 'right' }}>
                  <Button
                    variant={'outline'}
                    m={0}
                    icon={'edit'}
                    onClick={() => this.setState({ readOnly: false })}
                  >
                    Edit Profile
                  </Button>
                  <TextNotification
                    text="profile saved"
                    icon="check"
                    show={this.state.showNotification}
                  />
                </div>
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
    ) : null
  }
}
