import React from 'react'
import { Form, Field } from 'react-final-form'
import { Button } from 'src/components/Button'
import { InputField } from 'src/components/Form/Fields'
import { IUser, IUserFormInput } from 'src/models/user.models'
import { USER_TEMPLATE_DATA } from './Template'

interface IState {
  formValues: IUserFormInput
  formSaved: boolean
  errors: any
}

interface IProps {
  onSubmit: any
  user?: IUser
}

export class UserForm extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props)
    this.state = {
      formValues: props.user ? props.user as IUserFormInput : USER_TEMPLATE_DATA,
      formSaved: false,
      errors: null,
    }
  }
  public onSubmit = async (formValues: IUserFormInput) => {
    if (this.validate(formValues)) {
      try {
        await this.props.onSubmit(formValues)
      } catch (error) {
        this.setState({ errors: { submit: error } })
      }
    }
  }

  public validate(formValues: IUserFormInput): boolean {
    let { password, repeat_password } = formValues
    let errors = {}
    if (password !== repeat_password) {
      errors = { ...{ password: "Passwords don't match." } }
    }
    if (Object.entries(errors).length !== 0) {
      this.setState({ errors })
      return false
    } else {
      return true
    }
  }

  public render() {
    const { formValues, errors } = this.state
    return (
      <div>
        {
          errors ? (
            <ul>
              { Object.entries(errors).map(([key, value]) => <li key={key.toString()}>{value}</li>) }
            </ul>
          )  : null
        }
        <Form
          onSubmit={values => this.onSubmit(values as IUserFormInput)}
          initialValues={formValues}
          render={({ handleSubmit, submitting, invalid }) => {
            return (
              <div>
                <form onSubmit={handleSubmit}>
                  {
                    this.props.user ? null :
                    <Field
                      name="email"
                      component={InputField}
                      label="Email"
                      type="email"
                      required
                    />
                  }
                  <Field
                    name="display_name"
                    component={InputField}
                    label="Display name"
                  />
                  {
                    this.props.user ? null :
                    <div>
                      <Field
                        name="password"
                        component={InputField}
                        label="Password"
                        type="password"
                        required
                      />
                      <Field
                        name="repeat_password"
                        component={InputField}
                        label="Repeat password"
                        type="password"
                        required
                      />
                    </div>
                  }
                  <Field
                    name="country"
                    component={InputField}
                    label="Country"
                  />
                  <Button
                    type="submit"
                    icon={'check'}
                    disabled={submitting || invalid}
                  >
                    Submit
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
