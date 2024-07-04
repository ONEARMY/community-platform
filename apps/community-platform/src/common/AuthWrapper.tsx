import React from 'react'
import { observer } from 'mobx-react'

import { useCommonStores } from '../common/hooks/useCommonStores'
import { DEV_SITE_ROLE, SITE } from '../config/config'
import { isTestEnvironment } from '../utils/isTestEnvironment'

import type { UserRole } from '@onearmy.apps/shared'
import type { IUserPPDB } from '../models'

/*
    Simple wrapper to only render a component if the user is logged in (plus optional user role required)
    Optionally provide a fallback component to render if not satisfied
*/
interface IProps {
  roleRequired?: UserRole | UserRole[]
  fallback?: React.ReactNode
  children: React.ReactNode
}

export const AuthWrapper = observer((props: IProps) => {
  const { userStore } = useCommonStores().stores
  const isAuthorized = isUserAuthorized(userStore?.user, props.roleRequired)
  const childElements =
    props.roleRequired === 'beta-tester' ? (
      <div className="beta-tester-feature">{props.children}</div>
    ) : (
      props.children
    )

  if (isAuthorized) {
    return childElements
  }

  return props.fallback || null
})

const isUserAuthorized = (
  user?: IUserPPDB | null,
  roleRequired?: UserRole | UserRole[],
) => {
  const userRoles = user?.userRoles || []

  // If no role required just check if user is logged in
  if (!roleRequired || roleRequired.length === 0) {
    return user ? true : false
  }

  const rolesRequired = Array.isArray(roleRequired)
    ? roleRequired
    : [roleRequired]

  // if running dev or preview site allow wwwuser-overridden permissions (ignoring db user role)
  if (!isTestEnvironment && (SITE === 'dev_site' || SITE === 'preview')) {
    if (DEV_SITE_ROLE) {
      return rolesRequired.includes(DEV_SITE_ROLE)
    }
  }
  // otherwise use logged in user profile values
  if (user && roleRequired) {
    return userRoles.some((role) => rolesRequired.includes(role))
  }

  return false
}
