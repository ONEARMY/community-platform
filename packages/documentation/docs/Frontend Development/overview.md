---
id: overview
title: Overview
---

## Tech Stack

The platform is built in [React](https://reactjs.org/), [Mobx](https://mobx.js.org/index.html),[Typescript](https://www.typescriptlang.org/docs/handbook/basic-types.html) and [theme-ui](https://theme-ui.com)

## Styling

For styling we use the popular _CSS in JS_ library [emotion](https://emotion.sh/docs/introduction).
Alongside this we use [theme-ui](https://theme-ui.com/) to encourage a theme orientated constraint-based design approach.

If you never used it before don't worry, it makes a lot of sense and you'll just need a bit of further reading and to dive into our codebase. I recommend [this article](https://medium.com/styled-components/build-better-component-libraries-with-styled-system-4951653d54ee) to understand more about the Design System philosophy behind it.

In the long term, we would like to allow easy theme swapping by simply changing the theme file for anyone.

All of the current themes can be within `packages/themes/`, currently there are 3 available:

- Precious Plastic
- Project Kamp
- Fixing Fashion

:::note
Make sure .SVG images are optimised before adding them to the repository. This is a good tool to use https://jakearchibald.github.io/svgomg/
:::

## Components

You can find all the basic stateless components in `src/packages/components`, there are more information available within the [README for this package](https://github.com/ONEARMY/community-platform/tree/master/packages/components)
