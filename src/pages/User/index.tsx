import * as React from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { UserStore } from 'src/stores/User/user.store'
import { IUser } from 'src/models/user.models'
import { UserPage } from './UserPage'

interface InjectedProps extends IProps {
  userStore: UserStore
}
interface IProps {}

@(withRouter as any)
@inject('userStore')
@observer
export class SettingsPage extends React.Component<IProps> {
  get injected() {
    return this.props as InjectedProps
  }

  public render() {
    const currentUser = this.injected.userStore.user as IUser
    return currentUser ? (
      <Switch>
        <Route
          exact
          path="/u/:id"
          render={props => {
            const user = this.injected.userStore.getUserProfile(
              props.match.params.id,
            )
            return (
              <UserPage
                {...props}
                user={user}
                userStore={this.injected.userStore}
              />
            )
          }}
        />
      </Switch>
    ) : null
  }
}
