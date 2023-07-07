import { Redirect, Route } from 'react-router'
import { observer } from 'mobx-react'
import { Flex, Text } from 'theme-ui'
import { AuthWrapper } from 'src/common/AuthWrapper'
import type { UserRole } from 'src/models/user.models'

/*
    This provides a <AuthRoute /> component that can be used in place of <Route /> components
    to allow user access only if authenticated.
*/

export const AuthRoute = observer(
  (props: {
    component: React.ComponentType<any>
    roleRequired?: UserRole
    /** User ids to be treated as admin, e.g. content creator */
    additionalAdmins?: string[]
    /** Page to redirect if role not satisfied (default shows message) */
    redirect?: string
  }) => {
    const {
      component: Component,
      roleRequired,
      additionalAdmins,
      redirect,
      ...rest
    } = props

    return (
      <AuthWrapper
        additionalAdmins={additionalAdmins}
        roleRequired={roleRequired}
        fallback={
          redirect ? (
            <Redirect to={redirect} />
          ) : (
            <Flex
              sx={{ justifyContent: 'center' }}
              mt="40px"
              data-cy="auth-route-deny"
            >
              <Text>
                {roleRequired
                  ? `${roleRequired} role required to access this page`
                  : 'Please login to access this page'}
              </Text>
            </Flex>
          )
        }
      >
        <Route {...rest} render={(props) => <Component {...props} />} />
      </AuthWrapper>
    )
  },
)
