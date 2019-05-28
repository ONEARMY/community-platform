import * as React from 'react'

import { withRouter, Switch, Route } from 'react-router'
import { AuthRoute } from '../common/AuthRoute'
import { AdminTags } from './content/AdminTags'
import { AuthWrapper } from 'src/components/Auth/AuthWrapper'
import { Link } from 'react-router-dom'
import Heading from 'src/components/Heading'

class AdminPageClass extends React.Component<null, null> {
  public render() {
    return (
      <div id="AdminPage">
        <Switch>
          <Route
            exact
            path="/admin"
            render={props => (
              <AuthWrapper roleRequired="super-admin">
                <Heading small>Super Admins Portal</Heading>
                <Link to="/admin/tags">Tags Admin</Link>
              </AuthWrapper>
            )}
          />
          <AuthRoute
            path="/admin/tags"
            component={AdminTags}
            redirectPath="/admin"
            roleRequired="super-admin"
          />
        </Switch>
      </div>
    )
  }
}
export const AdminPage = withRouter(AdminPageClass as any)
