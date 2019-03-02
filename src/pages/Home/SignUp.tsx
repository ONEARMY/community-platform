import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { Redirect, withRouter } from 'react-router-dom'
import { IUserFormInput } from 'src/models/user.models'
import { UserStore } from 'src/stores/User/user.store'
import { UserForm } from 'src/pages/common/User/Form'
import PageContainer from 'src/components/Layout/PageContainer'
import { BoxContainer } from 'src/components/Layout/BoxContainer'

interface InjectedProps {
  userStore: UserStore
}

@(withRouter as any)
@inject('userStore')
@observer
export class SignUpPage extends React.Component<any> {
  get injected() {
    return this.props as InjectedProps
  }

  public onSubmit = async (formValues: IUserFormInput) => {
    await this.props.userStore.signUpUser(formValues);
    this.props.history.push('/');
  }

  public render() {
    let user = this.injected.userStore.user
    return (
      <PageContainer>
        <BoxContainer>
          { user ? <Redirect to="/" /> : <UserForm onSubmit={this.onSubmit}/> }
        </BoxContainer>
      </PageContainer>
    )
  }
}
