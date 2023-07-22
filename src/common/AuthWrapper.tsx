import * as React from 'react'
import { inject, observer } from 'mobx-react'
import type { UserStore } from 'src/stores/User/user.store'
import type { UserRole, IUser } from 'src/models/user.models'
import { SITE, DEV_SITE_ROLE } from 'src/config/config'

/*
    Simple wrapper to only render a component if the user is logged in (plus optional user role required)
    Optionally provide a fallback component to render if not satisfied
*/

interface IProps {
  roleRequired?: UserRole | UserRole[]
  fallback?: React.ReactNode
  /** Optional additional user IDs that have admin rights (e.g. content creators) */
  additionalAdmins?: string[]
  children: React.ReactNode
}

interface IInjectedProps extends IProps {
  userStore: UserStore
}

@inject('userStore')
@observer
export class AuthWrapper extends React.Component<IProps> {
  get injected() {
    return this.props as IInjectedProps
  }

  render() {
    const { roleRequired, additionalAdmins, children, fallback } = this.props
    const currentUser = this.injected.userStore.user as IUser
    const isAuthorized = isUserAuthorized(
      currentUser,
      roleRequired,
      additionalAdmins,
    )
    const childElements =
      roleRequired === 'beta-tester' ? (
        <div className="beta-tester-feature">{children}</div>
      ) : (
        children
      )
    return isAuthorized === true ? childElements : fallback || null
  }
}

const isUserAuthorized = (user, roleRequired, additionalAdmins) => {
  // provide access to named users
  if (additionalAdmins && user?._id && additionalAdmins.includes(user?._id)) {
    return true
  }

  const userRoles = user?.userRoles || []

  // If no role required just check if user is logged in
  if (!roleRequired || roleRequired.length === 0) {
    return user ? true : false
  }

  if (roleRequired) {
    const rolesRequired = Array.isArray(roleRequired)
      ? roleRequired
      : [roleRequired]

    // if running dev or preview site allow wwwuser-overridden permissions (ignoring db user role)
    if (
      process.env.NODE_ENV !== 'test' &&
      (SITE === 'dev_site' || SITE === 'preview')
    ) {
      if (DEV_SITE_ROLE) {
        return rolesRequired.includes(DEV_SITE_ROLE)
      }
    }
    // otherwise use logged in user profile values
    if (user) {
      return userRoles.some((role) => rolesRequired.includes(role))
    }
  }

  return false
}
