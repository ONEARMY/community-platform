import React from 'react'
import { Form, Field } from 'react-final-form'
import { Button } from 'src/components/Button'
import { InputField } from 'src/components/Form/Fields'
import { IUserFormInput } from 'src/models/user.models'
import { UserStore } from 'src/stores/User/user.store'
import { USER_TEMPLATE_DATA } from './Template'

interface IState {
  formValues: IUserFormInput
  formSaved: boolean
}

interface IProps {
  userStore: UserStore
}

export class UserForm extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props)
    this.state = {
      formValues: { ...USER_TEMPLATE_DATA },
      formSaved: false,
    }
  }
  public onSubmit = (formValues: IUserFormInput) => {
    console.log(formValues)
  }

  public render() {
    const { formValues } = this.state
    return (
      <div>
        <Form
          onSubmit={values => this.onSubmit(values as IUserFormInput)}
          initialValues={formValues}
          render={({ handleSubmit, submitting, invalid }) => {
            return (
              <div>
                <form onSubmit={handleSubmit}>
                  <Field
                    name="email"
                    component={InputField}
                    label="Email"
                  />
                  <Field
                    name="display_name"
                    component={InputField}
                    label="Display name"
                  />
                  <Field
                    name="password"
                    component={InputField}
                    label="Password"
                  />
                  <Field
                    name="repeat_password"
                    component={InputField}
                    label="Repeat password"
                  />
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
