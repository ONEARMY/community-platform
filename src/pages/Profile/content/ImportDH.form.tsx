import * as React from 'react'
import { DHImport } from 'src/hacks/DaveHakkensNL.hacks'
import { Field, Form } from 'react-final-form'
import Heading from 'src/components/Heading'
import { InputField } from 'src/components/Form/Fields'
import { UserStore } from 'src/stores/User/user.store'
import { IUser } from 'src/models/user.models'
import { inject, observer } from 'mobx-react'

interface IProps {}
interface IInjectedProps extends IProps {
  userStore: UserStore
}
interface IState {
  formValues: {
    DHSite_mention_name: string
  }
}

@inject('userStore')
@observer
export class ImportDHForm extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = { formValues: { DHSite_mention_name: '' } }
  }

  get injected() {
    return this.props as IInjectedProps
  }

  render() {
    const user = this.injected.userStore.user as IUser
    return (
      <div>
        <Heading medium bold mt={4}>
          Dave Hakkens.NL Profile
        </Heading>
        <Form
          // form isn't submitted but instead DHImport button click triggered
          onSubmit={() => undefined}
          initialValues={user}
          render={({ values }) => {
            return (
              <form onSubmit={e => e.preventDefault()}>
                <Field
                  name="DHSite_mention_name"
                  component={InputField}
                  placeholder="Mention Name"
                />
                <DHImport
                  mention_name={values.DHSite_mention_name as string}
                  userStore={this.injected.userStore}
                />
              </form>
            )
          }}
        />
      </div>
    )
  }
}
