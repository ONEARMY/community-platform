import * as React from 'react'
import { withRouter, Switch, Route } from 'react-router'
import { AuthRoute } from '../common/AuthRoute'
import { AdminTags } from './content/AdminTags'
import { AdminUsers } from './content/AdminUsers'
import { AdminCategories } from './content/AdminCategories'
import { AdminBetaTesters } from './content/AdminBetaTesters'
import { AuthWrapper } from 'src/common/AuthWrapper'
import { Flex, Box, Text } from 'theme-ui'
import { Link } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import type { AdminStore } from 'src/stores/Admin/admin.store'

const ADMIN_ROUTES = [
  { name: 'Users', slug: 'users', component: AdminUsers },
  { name: 'Tags', slug: 'tags', component: AdminTags },
  { name: 'Categories', slug: 'categories', component: AdminCategories },
  {
    name: 'Beta Testers',
    slug: 'beta-testers',
    component: AdminBetaTesters,
  },
]

interface IProps {}
interface IInjectedProps extends IProps {
  adminStore: AdminStore
}
@inject('adminStore')
@observer
class AdminPage extends React.Component<IProps, any> {
  componentDidMount() {
    this.injected.adminStore.init()
  }
  get injected() {
    return this.props as IInjectedProps
  }
  public render() {
    return (
      <div id="AdminPage">
        <Switch>
          <Route
            exact
            path="/admin"
            render={() => (
              <>
                <Text sx={{ display: 'block', marginTop: 3, marginBottom: 3 }}>
                  NOTE - This content is only viewable by admins
                </Text>
                <AuthWrapper roleRequired="admin">
                  <Flex>
                    {ADMIN_ROUTES.map((route) => (
                      <Box key={route.name} bg="white" p={2} m={2}>
                        <Link to={`/admin/${route.slug}`}>
                          {route.name} Admin
                        </Link>
                      </Box>
                    ))}
                  </Flex>
                </AuthWrapper>
              </>
            )}
          />
          {ADMIN_ROUTES.map((route) => (
            <AuthRoute
              key={route.name}
              path={`/admin/${route.slug}`}
              component={route.component}
              roleRequired="admin"
            />
          ))}
        </Switch>
      </div>
    )
  }
}
export default withRouter(AdminPage as any)
