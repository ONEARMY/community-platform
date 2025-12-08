### What is React Router 7?
A React Fullstack Framework that provides server-side rendering and an API Layer.
https://reactrouter.com/start/modes#framework

## Routing
Each route is a normal React component file that should include a [loader](https://reactrouter.com/start/framework/data-loading#server-data-loading) function, that function runs exclusively on the server (or clientLoader for browser only).

Parts of the component might be rendered client side, for that we can use React.lazy or wrap them with `<ClientOnly>` component from `remix-utils`.

Additionally, routes could also export [Links](https://reactrouter.com/api/components/Links#links) and [Meta](https://reactrouter.com/api/components/Meta#meta) functions that will be added to the html head.

For the API, we can use [action/loader](https://reactrouter.com/start/framework/actions#server-actions) routes.
