import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { Route, Switch, withRouter } from 'react-router-dom'
import { IUserFormInput } from 'src/models/user.models'
import { UserForm } from 'src/pages/common/User/Form'
import {
  Links,
  LinkButton,
} from 'src/pages/common/Header/CommunityHeader/elements'
import { ChangePasswordPage } from './Settings/ChangePassword'

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
    let user = this.props.userStore.user
    return user ? (
      <div>
        <Links>
          <LinkButton className="nav-link" to="/settings">
            Settings
          </LinkButton>
          <LinkButton className="nav-link" to="/settings/change-password">
            Change password
          </LinkButton>
        </Links>
        <Switch>
          <Route
            exact
            path="/settings"
            render={() => <UserForm user={user} onSubmit={this.onSubmit} />}
          />
          <Route
            exact
            path="/settings/change-password"
            component={ChangePasswordPage}
          />
        </Switch>
      </div>
    ) as React.ReactNode
    : null
  }
}
