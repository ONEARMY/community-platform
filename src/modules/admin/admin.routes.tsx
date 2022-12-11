import { Suspense, lazy } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import type { IPageMeta } from 'src/pages/PageList'
import { MODULE } from '..'

const moduleName = MODULE.ADMIN

interface IAdminPageMeta extends IPageMeta {
  disabled?: boolean // mark if section ready for use or not
}

export const ADMIN_PAGES: IAdminPageMeta[] = [
  {
    component: lazy(() => import('./pages/adminApprovals')),
    title: 'Approvals',
    description: '',
    path: '',
    moduleName,
  },
  {
    component: lazy(() => import('./pages/adminUsers')),
    title: 'Users',
    description: 'Browse Users',
    path: '/users',
    moduleName,
  },
  {
    component: lazy(() => import('./pages/adminMappins')),
    title: 'Map Pins',
    description: 'Browse Map Pins',
    path: '/map-pins',
    moduleName,
    disabled: true,
  },
  {
    component: lazy(() => import('./pages/adminTags')),
    title: 'Tags',
    description: 'Browse Tags',
    path: '/tags',
    moduleName,
    disabled: true,
  },
  {
    component: lazy(() => import('./pages/adminHowtos')),
    title: 'Howtos',
    description: 'Browse Howtos',
    path: '/howtos',
    moduleName,
  },

  {
    component: lazy(() => import('./pages/adminResearch')),
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
]

const routes = () => (
  <Suspense fallback={<div></div>}>
    <Switch>
      {ADMIN_PAGES.map((page) => (
        <Route
          key={page.path}
          path={`/${moduleName}${page.path}`}
          component={page.component}
          exact={true}
        />
      ))}
    </Switch>
  </Suspense>
)
export default withRouter(routes)
