import { inject, observer } from 'mobx-react'
import * as React from 'react'
import type { RouteComponentProps } from 'react-router-dom'
import { Route, Switch, withRouter } from 'react-router-dom'
import type { IUser } from 'src/models/user.models'
import type { UserStore } from 'src/stores/User/user.store'
import { Flex, Text } from 'theme-ui'
import { UserSettings } from './UserSettings'

interface InjectedProps extends IProps {
  userStore: UserStore
}
type IProps = RouteComponentProps

@inject('userStore')
@observer
class Settings extends React.Component<IProps> {
  get injected() {
    return this.props as InjectedProps
  }

  public render() {
    const currentUser = this.injected.userStore.user as IUser
    return currentUser ? (
      <Switch>
        {/* own profile settings */}
        <Route exact path="/settings" render={() => <UserSettings />} />
      </Switch>
    ) : (
      <Flex sx={{ justifyContent: 'center' }} mt="40px">
        <Text> You can only access the settings page if you are logged in</Text>
      </Flex>
    )
  }
}
export default withRouter(Settings)
