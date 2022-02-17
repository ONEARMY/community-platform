---
id: overview
title: Overview
---

## Tech Stack

The platform is built in [React](https://reactjs.org/), [Mobx](https://mobx.js.org/index.html),[Typescript](https://www.typescriptlang.org/docs/handbook/basic-types.html) and [styled-components](https://www.styled-components.com/)

## Styling

For styling we use the popular _CSS in JS_ library [styled-components](https://www.styled-components.com/).
On top of it, we use [styled-system](https://styled-system.com) to encourage a theme & prop based styling.

If you never used it before don't worry, it makes a lot of sense and you'll just need a bit of further reading and to dive into our codebase. I recommend [this article](https://medium.com/styled-components/build-better-component-libraries-with-styled-system-4951653d54ee) to understand more about the Design System philosophy behind it.

The main style variables are described in the [theme file](https://github.com/OneArmyWorld/onearmy/blob/module/discussion/src/themes/styled.theme.tsx) to keep a high level of consistency everywhere in the app. Also, in a long term vision, we would like to allow easy theme swapping by simply changing the theme file for anyone.

## Components

You can find all the basic stateless components in `src/components` and some more complex & statefull components in `src/pages/common`.

### Containers

Path : `src/components/Layout`

Available containers :

- PageContainer
- BoxContainer
- FlexContainer

Use them to wrap the content depending on your need.

### Button

Path : `src/components/Button`

Basic button with variant outline :

```js
<Button variant="outline">button text</Button>
```

You can add an icon to the button by using the `icon` props :

```js
<Button m={50} icon={'icon-name'} variant="outline">
  button text
</Button>
```

### Icons

Path : `src/components/Icons`

We use [react-icons](https://react-icons.netlify.com/#/) lightweight library to provide icons. We may need a custom implementation in the futur but for now it's enough.
How to use :

```js
<Icon glyph={'your-icon-name'} />
```

To add a new icon :

- check the one you need in the list https://react-icons.netlify.com/#/icons/md
- Import it in the `Icons` component from react-icons like so

```js
import { MdFileDownload } from 'react-icons/md'
```

- Add a case for the imported icon to the `Glyph` const.
  Then you'll be able to use the new icon anywere in the project by importing the `Icons` component and use it as described above.

## Inconsistencies

When development first started in 2018 many modern react features were either not available or less common (e.g. hooks, functional components, scss support, etc.), and had multiple iterations on architecture and styling approaches. As such you'll likely find rough patches and inconsistencies throughout the codebase, and remnants of old code snippets no longer relevant.

If you're interested in helping to upgrade older parts of the codebase and help to make the overall system more consistent and developer-friendly, we support a [Maintainer Role](../Contributing/maintainer.md) position that could be perfect for you!
