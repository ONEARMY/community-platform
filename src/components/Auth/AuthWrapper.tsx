import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { UserStore } from 'src/stores/User/user.store'
import { UserRole } from 'src/models/user.models'
import { SITE } from 'src/config/config'

/*
    Simple wrapper to only render a component if the user is logged in (plus optional user role required)
    Optionally provide a fallback component to render if not satisfied
*/

interface IProps {
  userStore?: UserStore
  roleRequired?: UserRole
  fallback?: React.ReactNode
}
interface IState {}
@inject('userStore')
@observer
export class AuthWrapper extends React.Component<IProps, IState> {
  isUserAuthenticated() {
    // allow full access to all pages when developing in localhost
    if (SITE === 'localhost') {
      return true
    }
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
    const isAuthenticated = this.isUserAuthenticated()
    const fallback = this.props.fallback || null
    return isAuthenticated === true ? this.props.children : fallback
  }
}
