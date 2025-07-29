import React from 'react'
import { observer } from 'mobx-react'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { SITE } from 'src/config/config'
import { getDevSiteRole } from 'src/config/devSiteConfig'

import type { IUserDB, UserRole } from 'oa-shared'

/*
    Simple wrapper to only render a component if the user is logged in (plus optional user role required)
    Optionally provide a fallback component to render if not satisfied
*/
interface IProps {
  children: React.ReactNode
  borderLess?: boolean
  fallback?: React.ReactNode
  roleRequired?: UserRole | UserRole[]
}

export const AuthWrapper = observer((props: IProps) => {
  const { borderLess, children, roleRequired } = props
  const { userStore } = useCommonStores().stores

  const isAuthorized = isUserAuthorized(userStore?.user, roleRequired)

  const childElements =
    roleRequired === 'beta-tester' && !borderLess ? (
      <div className="beta-tester-feature">{children}</div>
    ) : (
      props.children
    )

  return <>{isAuthorized ? childElements : props.fallback || <></>}</>
})

export const isUserAuthorized = (
  user?: IUserDB | null,
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
  if (SITE === 'dev_site' || SITE === 'preview' || SITE === 'test-ci') {
    if (getDevSiteRole()) {
      return rolesRequired.includes(getDevSiteRole())
    }
  }
  // otherwise use logged in user profile values
  if (user && roleRequired) {
    return userRoles.some((role) => rolesRequired.includes(role))
  }

  return false
}
