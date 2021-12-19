import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { UserStore } from 'src/stores/User/user.store'
import { UserRole } from 'src/models/user.models'
import { SITE, DEV_SITE_ROLE } from 'src/config/config'

/*
    Simple wrapper to only render a component if the user is logged in (plus optional user role required)
    Optionally provide a fallback component to render if not satisfied
*/

interface IProps {
  userStore?: UserStore
  roleRequired?: UserRole
  fallback?: React.ReactNode
  /** Optional additional user IDs that have admin rights (e.g. content creators) */
  additionalAdmins?: string[]
}
interface IState {}
@inject('userStore')
@observer
export class AuthWrapper extends React.Component<IProps, IState> {
  isUserAuthorized() {
    const { user } = this.props.userStore!
    const { additionalAdmins } = this.props

    // provide access to named users
    if (additionalAdmins && user?._id && additionalAdmins.includes(user?._id)) {
      return true
    }

    const { roleRequired } = this.props
    let userRoles = user?.userRoles || []

    // if running dev or preview site allow user-overridden permissions (ignoring db user role)
    if (
      process.env.NODE_ENV !== 'test' &&
      (SITE === 'dev_site' || SITE === 'preview')
    ) {
      // default ignore existing user roles
      if (user) {
        userRoles = []
      }
      if (DEV_SITE_ROLE) {
        return DEV_SITE_ROLE === roleRequired
      }
    }
    // otherwise use logged in user profile values
    if (user) {
      if (roleRequired) {
        return userRoles.includes(roleRequired)
      } else {
        return true
      }
    }
    return false
  }

  render() {
    const isAuthorized = this.isUserAuthorized()
    const fallback = this.props.fallback || null
    return isAuthorized === true ? this.props.children : fallback
  }
}
