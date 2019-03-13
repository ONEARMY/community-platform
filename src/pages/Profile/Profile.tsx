import * as React from 'react'
import { Route, Switch, withRouter} from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { Box } from 'rebass'
import PageContainer from 'src/components/Layout/PageContainer'
import { BoxContainer } from 'src/components/Layout/BoxContainer'
import { Link } from 'src/components/Links'
import { UserStore } from 'src/stores/User/user.store'
import { IUser } from 'src/models/user.models'
import { UserDetail } from 'src/pages/common/User/Detail'

interface InjectedProps {
  userStore: UserStore
}

@(withRouter as any)
@inject('userStore')
@observer
export class ProfilePage extends React.Component<any> {
  get injected() {
    return this.props as InjectedProps
  }

  public render() {
    let currentUser = this.injected.userStore.user as IUser
    return currentUser ? (
      <PageContainer>
        <BoxContainer>
          <Switch>
            <Route
              exact path="/profile"
              render={props => <CurrentUserProfile {...props} user={currentUser} />}
            />
            <Route
              exact path="/profile/:id"
              render={props => {
                let user = this.props.userStore.getUserProfile(
                  props.match.params.id,
                )
                return <UserProfile {...props} user={user} />
              }}
            />
          </Switch>
        </BoxContainer>
      </PageContainer>
    ) : null
  }
}
interface IUserProfile {
  user: IUser | null
}

class CurrentUserProfile extends React.Component<IUserProfile> {
  public render() {
    return (
      <>
        <Box mb={2}>
          <Link to="/settings">Profile settings</Link>
        </Box>
        <UserDetail user={this.props.user as IUser}/>
      </>
    )
  }
}

class UserProfile extends React.Component<IUserProfile> {
  public state: IUserProfile = {
    user: null,
  }
  async componentDidMount() {
    let user = await this.props.user
    this.setState({ user })
  }
  public render() {
    return this.state.user ? (
      <>
        <Box mb={2}>
          <Link to="/message">Send message</Link>
        </Box>
        <UserDetail user={this.state.user as IUser} />
      </>
    ) : null
  }
}
