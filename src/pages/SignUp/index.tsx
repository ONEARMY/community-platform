import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { Redirect } from 'react-router-dom'

import { UserStore } from 'src/stores/User/user.store'
import { UserForm } from 'src/pages/common/User/Form'

interface InjectedProps {
  userStore: UserStore
}

@inject('userStore')
export class SignUpPage extends React.Component {
  get injected() {
    return this.props as InjectedProps
  }

  public render() {
    let user = this.injected.userStore.user
    return user ? <Redirect to="/" /> : <UserForm userStore={this.injected.userStore}/>
  }
}
