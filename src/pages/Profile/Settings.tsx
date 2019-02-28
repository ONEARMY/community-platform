import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { withRouter } from 'react-router-dom'

import { IUserFormInput } from 'src/models/user.models'
import { UserForm } from 'src/pages/common/User/Form'

@(withRouter as any)
@inject('userStore')
@observer
export class SettingsPage extends React.Component<any> {
  public onSubmit = async (formValues: IUserFormInput) => {
    let user = this.props.userStore.user
    await this.props.userStore.updateUserProfile(user, formValues)
    this.props.history.push('/profile')
  }

  public render() {
    let user = this.props.userStore.user;
    return user ? <UserForm user={user} onSubmit={this.onSubmit} /> : null
  }
}
