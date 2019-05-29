import * as React from 'react'
import { Route, Redirect, RouteProps } from 'react-router'
import { inject, observer } from 'mobx-react'
import { UserStore } from 'src/stores/User/user.store'
import { UserRole } from 'src/models/user.models'

/*
    This provides a <AuthRoute /> component that can be used in place of <Route /> components
    to allow user access only if authenticated. Could also be used to direct to login and back,
    example here: https://tylermcginnis.com/react-router-protected-routes-authentication/
*/

interface IProps extends RouteProps {
  userStore?: UserStore
  redirectPath: string
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
    const { component: Component, redirectPath, ...rest } = this.props
    return (
      <Route
        {...rest}
        render={props =>
          isAuthenticated === true ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: redirectPath,
                state: { from: props.location },
              }}
            />
          )
        }
      />
    )
  }
}
AuthRoute.defaultProps = {
  redirectPath: '/',
}
