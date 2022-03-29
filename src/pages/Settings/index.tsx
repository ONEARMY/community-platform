import * as React from 'react'
import {
  Route,
  Switch,
  withRouter,
  RouteComponentProps,
} from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { UserStore } from 'src/stores/User/user.store'
import { IUser } from 'src/models/user.models'
import { UserSettings } from './SettingsPage'
import { Text } from 'src/components/Text'
import Flex from 'src/components/Flex'

interface InjectedProps extends IProps {
  userStore: UserStore
}
type IProps = RouteComponentProps

@inject('userStore')
@observer
class SettingsPage extends React.Component<IProps> {
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
      <Flex sx={{justifyContent: "center"}} mt="40px">
        <Text regular>
          {' '}
          You can only access the settings page if you are logged in
        </Text>
      </Flex>
    )
  }
}
export default withRouter(SettingsPage)
