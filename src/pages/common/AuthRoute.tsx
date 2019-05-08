import * as React from 'react'
import { Route, Redirect, RouteProps } from 'react-router'
import { inject, observer } from 'mobx-react'
import { UserStore } from 'src/stores/User/user.store'

/*
    This provides a <AuthRoute /> component that can be used in place of <Route /> components
    to allow user access only if authenticated. Could also be used to direct to login and back,
    example here: https://tylermcginnis.com/react-router-protected-routes-authentication/
*/

interface IProps extends RouteProps {
  userStore?: UserStore
  redirectPath: string
  component: React.ComponentClass
}
interface IState {}
@inject('userStore')
@observer
export class AuthRoute extends React.Component<IProps, IState> {
  static defaultProps: Partial<IProps>
  render() {
    // user ! to let typescript know property will exist (injected) instead of additional getter method
    const isAuthenticated = this.props.userStore!.user ? true : false
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
