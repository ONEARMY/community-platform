import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { UserStore } from 'src/stores/User/user.store'
import { UserRole } from 'src/models/user.models'

/*
    Simple wrapper to only render a component if the user is logged in (plus optional user role required)
*/

interface IProps {
  userStore?: UserStore
  roleRequired?: UserRole
}
interface IState {}
@inject('userStore')
@observer
export class AuthWrapper extends React.Component<IProps, IState> {
  isUserAuthenticated() {
    const { user } = this.props.userStore!
    const { roleRequired } = this.props
    if (user) {
      if (roleRequired) {
        return user.userRoles && user.userRoles.includes(roleRequired)
      } else {
        return true
      }
    }
    return false
  }

  render() {
    // user ! to let typescript know property will exist (injected) instead of additional getter method
    const isAuthenticated = this.isUserAuthenticated()
    return isAuthenticated === true ? this.props.children : null
  }
}
