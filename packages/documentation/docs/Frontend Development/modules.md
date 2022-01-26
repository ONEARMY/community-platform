---
id: modules
title: Modules
---

The platform consists of multiple _modules_ which provide the building blocks the app features and core functionality. Examples include features such as _howtos_, _events_ and _research_, alongside core modules such as _database_ and _user_

A module can consist of a combination of frontend pages, components, stores, as well as backend db endpoints, methods and triggers. Currently there is a significant level of overlap between (what should ideally be) standalone modules, however new modules should try to roughly design themselves in the following way:

## Module Folder

All frontend code should sit in a single module folder

```

modules
├── myModule
    ├── components
        ├── component_a.tsx
        ├── component_b.tsx
        └── index.tsx
    ├── myModule.routes.tsx
    ├── myModule.store.tsx
    └── index.tsx
```

## Adding Routes

If the module contains routable pages they should be defined in a single routes file, and where possible use lazy loading to define any child routes

_myModule.routes.tsx_

```tsx
import { Suspense, lazy } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import { IPageMeta } from 'src/pages/PageList'

const moduleName = 'myModule'

const pages: IPageMeta[] = [
  {
    component: lazy(() => import('./component_a')),
    title: 'Component A',
    description: 'This page displays component a',
    path: 'component_a',
    moduleName,
  },
]

const routes = () => (
  <Suspense fallback={<div></div>}>
    <Switch>
      {pages.map(page => (
        <Route
          key={page.path}
          path={`/${moduleName}/${page.path}`}
          component={page.component}
        />
      ))}
    </Switch>
  </Suspense>
)

export default withRouter(routes)
```

With the module routes defined they can be imported into the main PageList to be made available in the platform

_src\pages\PageList.tsx_

```tsx
import MyModule from 'src/modules/myModule'
// ...
export const COMMUNITY_PAGES: IPageMeta[] = [
  // ...
  MyModule,
]
```
