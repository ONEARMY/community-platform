import React from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import type { UserStore } from 'src/stores/User/user.store'
import { UserPage } from './content'
import { NotFoundPage } from '../NotFound/NotFound'
import { UserSettings } from '../Settings/UserSettings'
import { AuthRoute } from '../common/AuthRoute'

interface IProps {
  userStore?: UserStore
}

@(withRouter as any)
@inject('userStore')
@observer
class UserPageRoutes extends React.Component<IProps, any> {
  public render() {
    return (
      <Switch>
        <Route
          exact
          path="/u/:id"
          render={(props) => (
            <UserPage {...props} key={props.match.params.id} />
          )}
        />
        {/* Allow admins to edit via userSettings as target user */}
        <AuthRoute
          roleRequired="admin"
          path="/u/:id/edit"
          component={(props) => (
            <UserSettings adminEditableUserId={props.match.params.id} />
          )}
        />
        <Route exact path="/u" render={() => <NotFoundPage />} />
      </Switch>
    )
  }
}
export default UserPageRoutes
