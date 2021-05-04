import * as React from 'react'
import { Route, RouteProps } from 'react-router'
import { inject, observer } from 'mobx-react'
import { UserStore } from 'src/stores/User/user.store'
import { UserRole } from 'src/models/user.models'
import Text from 'src/components/Text'
import Flex from 'src/components/Flex'

/*
    This provides a <AuthRoute /> component that can be used in place of <Route /> components
    to allow user access only if authenticated.
*/

interface IProps extends RouteProps {
  userStore?: UserStore
  redirectPath: string // TODO - show a link to this path if exists
  component: React.ComponentClass
  roleRequired?: UserRole
}
interface IState {}
@inject('userStore')
@observer
export class AuthRoute extends React.Component<IProps, IState> {
  static defaultProps: Partial<IProps>

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
    const { component: Component, roleRequired, ...rest } = this.props
    return (
      <Route
        {...rest}
        render={props =>
          isAuthenticated === true ? (
            <Component {...props} />
          ) : (
            <Flex justifyContent="center" mt="40px" data-cy="auth-route-deny">
              <Text regular>
                {roleRequired
                  ? `${roleRequired} role required to access this page`
                  : 'Please login to access this page'}
              </Text>
            </Flex>
          )
        }
      />
    )
  }
}
AuthRoute.defaultProps = {
  redirectPath: '/',
}
