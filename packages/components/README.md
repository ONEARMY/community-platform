# One Army UI Kit

These components provide a collection of elements that can be reused across the platform.

Components can be combined to help anyone building on the platform to efficiently design consistent experiences for site visitors.

The aim of packaging these components seperately is to:

1. Reduce the overhead for contributors looking to work **only** on the component layer without needing to spin up the entire application locally.
2. Encourage decoupling of presentation layer from business logic, typically stored within the `*.stores.tsx` files.

We are using [Storybook](https://storybook.js.org/) to provide a browser accessible interface for our components.

> Storybook is a tool for UI development. It makes development faster and easier by isolating components. This allows you to work on one component at a time. You can develop entire UIs without needing to start up a complex dev stack, force certain data into your database, or navigate around your application.

(Optional) For anyone unfamiliar with Storybook looking to better understand the tool, we recommend reading their guide on [What's a Story](https://storybook.js.org/docs/react/get-started/whats-a-story).

## Getting started

After [cloning the repo](https://github.com/ONEARMY/community-platform), you can start the Storybook instance, which will make the application available in your browser at [http://localhost:6006](http://localhost:6006/).

```
cd ./packages/components
yarn install
yarn start
```
