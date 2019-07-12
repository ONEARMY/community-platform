import * as React from 'react'
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
export class User extends React.Component<IProps, any> {
  constructor(props: IProps) {
    super(props)
  }
  public render() {
    return (
      <Switch>
        <Route exact path="/u/:id" render={props => <UserPage {...props} />} />
        <Route exact path="/u" render={props => <NotFoundPage />} />
      </Switch>
    )
  }
}
