---
id: modules
title: Modules
---

The platform consists of multiple _modules_ which provide the building blocks for app features and core functionality. Examples include _howtos_, _events_ and _research_. These modules are designed to be drop-in/drop-out to allow for different combinations of modules to included in specific deployments.

A module can consist of any combination of frontend pages, components, stores, as well as backend db endpoints, methods and triggers. They can import code from shared components folders, common stores and providers (e.g. user, database), but should avoid importing code directly from other modules; if code from another standalone module is required, it is better to try and refactor to a shared reuseable component instead.

## Integrated Module Folder Structure

If developing a new module, the proposed simplest structure to include all relevant frontend code in a single directory is a follows:

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
    component: lazy(() => import('./main_page_component')),
    path: '',
    moduleName,
  },
  {
    component: lazy(() => import('./child_page_component')),
    path: 'child_route',
    moduleName,
  },
]

const routes = () => (
  <Suspense fallback={<div></div>}>
    <Switch>
      {pages.map((page) => (
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

The nested child routes should be consumed by a single entrypoint via the module index file.
This is also a place where a store could be provided or additional subheader component.

_myModule/index.tsx_

```tsx
export const MyModule: IPageMeta = {
  moduleName,
  path: `/my-module`,
  component: <MyModuleContainer />,
}

function MyModuleContainer() {
  return <Route component={myModuleRoutes} />
}
```

With the module routes defined they can be imported into the main PageList to be made available in the platform

_src\pages\PageList.tsx_

```tsx
import { MyModule } from 'src/modules/myModule'
// ...
export const COMMUNITY_PAGES: IPageMeta[] = [
  // ...
  MyModule,
]
```
