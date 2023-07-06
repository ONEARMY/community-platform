import { Suspense, lazy } from 'react'
import { Switch, withRouter } from 'react-router-dom'
import type { IPageMeta } from 'src/pages/PageList'
import { MODULE } from '..'
import { AuthRoute } from 'src/pages/common/AuthRoute'

const moduleName = MODULE.ADMIN

interface IAdminPageMeta extends IPageMeta {
  disabled?: boolean // mark if section ready for use or not
}

export const ADMIN_PAGES: IAdminPageMeta[] = [
  {
    component: lazy(
      () =>
        import(
          /* webpackChunkName: "adminApprovals" */ './pages/adminApprovals'
        ),
    ),
    title: 'Approvals',
    description: '',
    path: '',
    moduleName,
  },
  {
    component: lazy(
      () => import(/* webpackChunkName: "adminUsers" */ './pages/adminUsers'),
    ),
    title: 'Users',
    description: 'Browse Users',
    path: '/users',
    moduleName,
  },
  {
    component: lazy(
      () =>
        import(
          /* webpackChunkName: "adminBetaTesters" */ './pages/adminBetaTesters'
        ),
    ),
    title: 'Beta Testers',
    description: 'Beta Tester Management',
    path: '/beta_testers',
    moduleName,
  },
  {
    component: lazy(
      () =>
        import(
          /* webpackChunkName: "adminAdminUsers" */ './pages/adminAdminUsers'
        ),
    ),
    title: 'Admin Users',
    description: 'Admin User Management',
    path: '/admin_users',
    moduleName,
  },
  {
    component: lazy(
      () =>
        import(/* webpackChunkName: "adminMappins" */ './pages/adminMappins'),
    ),
    title: 'Map Pins',
    description: 'Browse Map Pins',
    path: '/map-pins',
    moduleName,
    disabled: true,
  },
  {
    component: lazy(
      () =>
        import(
          /* webpackChunkName: "adminCategories" */ './pages/adminCategories'
        ),
    ),
    title: 'Categories',
    description: 'Browse Categories',
    path: '/categories',
    moduleName,
  },
  {
    component: lazy(
      () => import(/* webpackChunkName: "adminTags" */ './pages/adminTags'),
    ),
    title: 'Tags',
    description: 'Browse Tags',
    path: '/tags',
    moduleName,
  },
  {
    component: lazy(
      () => import(/* webpackChunkName: "adminHowtos" */ './pages/adminHowtos'),
    ),
    title: 'Howtos',
    description: 'Browse Howtos',
    path: '/howtos',
    moduleName,
  },

  {
    component: lazy(
      () =>
        import(/* webpackChunkName: "adminResearch" */ './pages/adminResearch'),
    ),
    title: 'Research',
    description: 'Browse Research',
    path: '/research',
    moduleName,
    disabled: true,
  },
  {
    component: lazy(() => import('./pages/adminNotifications')),
    title: 'Notifications',
    description: 'Manage Notifications',
    path: '/notifications',
    moduleName,
  },
  {
    component: lazy(() => import('./pages/adminDatabase')),
    title: 'DB',
    description: 'DB Tasks',
    path: '/db',
    requiredRole: 'super-admin',
    moduleName,
  },
]

const routes = () => (
  <Suspense fallback={<div></div>}>
    <Switch>
      {ADMIN_PAGES.map((page) => (
        <AuthRoute
          key={page.path}
          path={`/${moduleName}${page.path}`}
          component={page.component}
          exact={true}
          roleRequired={page.requiredRole || 'admin'}
        />
      ))}
    </Switch>
  </Suspense>
)
export default withRouter(routes)
