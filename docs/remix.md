### What is Remix?
A React Fullstack Framework that provides server-side rendering and an API Layer.

## Routing
It follows a [File System Route Convention](https://remix.run/docs/en/main/start/v2#file-system-route-convention) where each route is defined in the *routes* folder.

Each route is a normal React component file that should include a [loader](https://remix.run/docs/en/main/route/loader) function, that function runs exclusively on the server (or clientLoader for browser only).
Parts of the component might be rendered client side, for that we can use React.lazy or wrap them with <ClientOnly> component from `remix-utils`.

Additionally, routes could also export [Links](https://remix.run/docs/en/main/route/links) and [Meta](https://remix.run/docs/en/main/route/meta) functions that will be added to the html head.

For the API, we can use [action](https://remix.run/docs/en/main/route/action) routes.

## Migration
- Most files have changes only to update the imports from 'react-router' to '@remix-run/react'.
- MapPin.tsx file name changed to MapPin.client.tsx [so it's not run server-side](https://remix.run/docs/en/main/discussion/server-vs-client#splitting-up-client-and-server-code). Without this change, it throws an error 'window' isn't defined - from the leaflet package.
- A `routes` folder was created, following [Remix routing convention](https://remix.run/docs/en/main/file-conventions/routes)
  - Notice the $ in `academy.$.tsx` it ensures academy sub-routes still load the academy page.
  - _index.tsx was created to replicate the current behaviour of redirecting to the Academy page. Later it could be used for the `HubPage`.
  - All routes have already been migrated
  - More routing details in the link above 😊

- Current issues
  - unit and e2e tests are not passing
  - localStorage/sessionStorage/window usage might need a refactor
  - DevSiteHeader (minor) -> needs a navigation/refresh after changing theme