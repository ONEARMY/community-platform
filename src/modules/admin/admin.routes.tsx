import { Suspense, lazy } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import { IPageMeta } from 'src/pages/PageList'
import { MODULE } from '..'

const moduleName = MODULE.ADMIN

export const ADMIN_PAGES: IPageMeta[] = [
  {
    component: lazy(() => import('./pages/admin-approvals')),
    title: 'Approvals',
    description: '',
    path: '',
    moduleName,
  },
  {
    component: lazy(() => import('./pages/admin-users')),
    title: 'Users',
    description: 'Browse Users',
    path: '/users',
    moduleName,
  },

  {
    component: lazy(() => import('./pages/admin-mappins')),
    title: 'Map Pins',
    description: 'Browse Map Pins',
    path: '/map-pins',
    moduleName,
  },
  {
    component: lazy(() => import('./pages/admin-tags')),
    title: 'Tags',
    description: 'Browse Tags',
    path: '/tags',
    moduleName,
  },
  {
    component: lazy(() => import('./pages/admin-howtos')),
    title: 'Howtos',
    description: 'Browse Howtos',
    path: '/howtos',
    moduleName,
  },

  {
    component: lazy(() => import('./pages/admin-research')),
    title: 'Research',
    description: 'Browse Research',
    path: '/research',
    moduleName,
  },
]

const routes = () => (
  <Suspense fallback={<div></div>}>
    <Switch>
      {ADMIN_PAGES.map(page => (
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
