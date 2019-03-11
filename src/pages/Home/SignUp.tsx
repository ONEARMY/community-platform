import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { Text } from 'rebass'
import { IUserFormInput } from 'src/models/user.models'
import { UserStore } from 'src/stores/User/user.store'
import { UserForm } from 'src/pages/common/User/Form'
import PageContainer from 'src/components/Layout/PageContainer'
import { BoxContainer } from 'src/components/Layout/BoxContainer'

interface InjectedProps {
  userStore: UserStore
}

interface IState {
  formSubmitted: boolean
}

@inject('userStore')
@observer
export class SignUpPage extends React.Component<any, IState> {
  public state: IState = {
    formSubmitted: false,
  }

  get injected() {
    return this.props as InjectedProps
  }

  public onSubmit = async (formValues: IUserFormInput) => {
    await this.props.userStore.signUpUser(formValues)
    this.setState({ formSubmitted: true })
  }

  public render() {
    return (
      <PageContainer>
        <BoxContainer>
          {this.state.formSubmitted ? (
            <Text textAlign={'center'}>
              A verification link has been sent to your email account.
            </Text>
          ) : (
            <UserForm onSubmit={this.onSubmit} />
          )}
        </BoxContainer>
      </PageContainer>
    )
  }
}
