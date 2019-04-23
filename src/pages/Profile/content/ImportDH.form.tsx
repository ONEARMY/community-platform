import * as React from 'react'
import { DHImport } from 'src/hacks/DaveHakkensNL.hacks'
import { Field, Form } from 'react-final-form'
import Heading from 'src/components/Heading'
import { InputField } from 'src/components/Form/Fields'
import { UserStore } from 'src/stores/User/user.store'
import { IUser } from 'src/models/user.models'

interface IProps {
  userStore: UserStore
}
export class ImportDHForm extends React.PureComponent<IProps> {
  constructor(props: IProps) {
    super(props)
    this.state = { formValues: { mentionName: '' } }
  }
  render() {
    const user = this.props.userStore.user as IUser
    const mentionName = user.DHSite_mention_name ? user.DHSite_mention_name : ''
    return (
      <div>
        <Heading medium bold mt={4}>
          Dave Hakkens.NL Profile
        </Heading>
        <Form
          // form isn't submitted but instead DHImport button click triggered
          onSubmit={() => undefined}
          initialValues={{ formValues: { mentionName } }}
          render={({ values }) => {
            return (
              <form onSubmit={e => e.preventDefault()}>
                <Field
                  name="mentionName"
                  component={InputField}
                  label="Mention Name"
                />
                <DHImport
                  mention_name={values.mentionName}
                  userStore={this.props.userStore}
                />
              </form>
            )
          }}
        />
      </div>
    )
  }
}
