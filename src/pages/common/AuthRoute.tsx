import * as React from 'react'
import type { RouteProps } from 'react-router'
import { Redirect, Route } from 'react-router'
import { observer } from 'mobx-react'
import type { UserRole } from 'src/models/user.models'
import { Flex, Text } from 'theme-ui'
import { AuthWrapper } from 'src/common/AuthWrapper'

/*
    This provides a <AuthRoute /> component that can be used in place of <Route /> components
    to allow user access only if authenticated.
*/

interface IProps extends RouteProps {
  component: React.ComponentType<any>
  roleRequired?: UserRole
  /** User ids to be treated as admin, e.g. content creator */
  additionalAdmins?: string[]
  /** Page to redirect if role not satisfied (default shows message) */
  redirect?: string
}
interface IState {}
@observer
export class AuthRoute extends React.Component<IProps, IState> {
  static defaultProps: Partial<IProps>

  render() {
    const {
      component: Component,
      roleRequired,
      additionalAdmins,
      ...rest
    } = this.props
    return (
      <AuthWrapper
        additionalAdmins={additionalAdmins}
        roleRequired={roleRequired}
        fallback={
          this.props.redirect ? (
            <Redirect to={this.props.redirect} />
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
  }
}
