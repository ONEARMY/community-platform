import * as React from 'react'
import { Redirect, Route, RouteProps } from 'react-router'
import { observer } from 'mobx-react'
import { UserRole } from 'src/models/user.models'
import Text from 'src/components/Text'
import Flex from 'src/components/Flex'
import { AuthWrapper } from 'src/components/Auth/AuthWrapper'

/*
    This provides a <AuthRoute /> component that can be used in place of <Route /> components
    to allow user access only if authenticated.
*/

interface IProps extends RouteProps {
  component: React.ComponentType<any>
  roleRequired?: UserRole
  /** Page to redirect if role not satisfied (default shows message) */
  redirect?: string
}
interface IState {}
@observer
export class AuthRoute extends React.Component<IProps, IState> {
  static defaultProps: Partial<IProps>

  render() {
    const { component: Component, roleRequired, ...rest } = this.props
    return (
      <AuthWrapper
        roleRequired={roleRequired}
        fallback={
          this.props.redirect ? (
            <Redirect to={this.props.redirect} />
          ) : (
            <Flex sx={{justifyContent: "center"}} mt="40px" data-cy="auth-route-deny">
              <Text regular>
                {roleRequired
                  ? `${roleRequired} role required to access this page`
                  : 'Please login to access this page'}
              </Text>
            </Flex>
          )
        }
      >
        <Route {...rest} render={props => <Component {...props} />} />
      </AuthWrapper>
    )
  }
}
