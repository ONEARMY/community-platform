import React from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { UserStore } from 'src/stores/User/user.store'
import { UserPage } from './content/UserPage/UserPage'
import { NotFoundPage } from '../NotFound/NotFound'

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
        <Route exact path="/u/:id" render={props => <UserPage {...props} />} />
        <Route exact path="/u" render={() => <NotFoundPage />} />
      </Switch>
    )
  }
}
export default UserPageRoutes
