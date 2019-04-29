import * as React from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import PageContainer from 'src/components/Layout/PageContainer'
import { BoxContainer } from 'src/components/Layout/BoxContainer'
import { UserStore } from 'src/stores/User/user.store'
import { IUser } from 'src/models/user.models'
import { UserProfile } from './content/UserProfile'

interface InjectedProps extends IProps {
  userStore: UserStore
}
interface IProps {}

@(withRouter as any)
@inject('userStore')
@observer
export class ProfilePage extends React.Component<IProps> {
  get injected() {
    return this.props as InjectedProps
  }

  public render() {
    const currentUser = this.injected.userStore.user as IUser
    return currentUser ? (
      <PageContainer>
        <BoxContainer p={0}>
          <Switch>
            {/* own profile */}
            <Route
              exact
              path="/profile"
              render={props => (
                <UserProfile
                  {...props}
                  user={currentUser}
                  userStore={this.injected.userStore}
                />
              )}
            />
            {/* other profile */}
            {/* <Route
              exact
              path="/profile/:id"
              render={props => {
                const user = this.injected.userStore.getUserProfile(
                  props.match.params.id,
                )
                return (
                  <UserProfile
                    {...props}
                    user={user}
                    userStore={this.injected.userStore}
                  />
                )
              }}
            /> */}
          </Switch>
        </BoxContainer>
      </PageContainer>
    ) : null
  }
}
