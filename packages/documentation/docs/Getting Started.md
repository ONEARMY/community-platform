---
slug: /
title: Local Setup
---

<!-- Use custom top-meta to ensure shows on first page -->

## Prerequisites

1. Download and install [Git](https://git-scm.com/downloads)  
   This will be used to download the repository

2. Download and install [Node v20](https://nodejs.org/en/download/)  
   This will be used to run the local server. It included the `npm` package manager

3. [Download and install Yarn](https://yarnpkg.com/getting-started/install) (v3)

4. (Optional) Download and install [Docker](https://docs.docker.com/get-docker/)
   This will be used for running the emulator if doing local backend development

## Run locally

Clone the repo

```
git clone https://github.com/ONEARMY/community-platform
```

Change directory into the cloned repo to run future commands

```
cd community-platform
```

Install dependencies

```
yarn install
```

   :::tip
   We recommend using [VSCode](https://code.visualstudio.com/download) along with the following extensions

   Additionally there are a couple extensions that work well with our current technology stack:

   - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) to auto-format and enforce code conventions.
   - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) to type-check code
   :::

### Running the web app

There are two options:

#### Cloud based backend 

This option is simple but only starts the frontend. The backend services are hosted on the internet (https://precious-plastics-v4-dev.firebaseapp.com) and may be accessed by many developers.

This setup is:

- Ideal for starting
- Ideal for frontend development
- Not great for backend development

Simply run:

```
yarn start
```

In this case:

- frontend: http://localhost:3000

#### Emulator based backend (Advanced)

This option is slightly more complicated but allows you to run the frontend and backend system locally (except for sending emails.) This option is experimental.

This setup is ideal for full stack development.

See the details [here](/Backend Development/firebase-emulator).

## Troubleshooting

Sometimes dependencies can get into an outdated or bad state. As a general fix, deleting all existing 3rd party dependencies and installing clean may fix many issues. There is a helper script available to do this:

```
yarn install:clean
```

Otherwise possible solutions to some specific issues are also listed below

### Module not found

If whilst attempting to run the app a `module-not-found` (or similar) error appears, it is likely because dependencies have been updated and require install again. Running the `yarn install` command again should fix.

### Installation freezes

Some of the larger packages that require binaries to be built can get themselves into a bad state during install. If this happens usually the easiest way to resolve is to try installing individual workspaces, e.g.

```
yarn workspace functions install
yarn workspace oa-cypress install
yarn workspace oa-docs install
```

### Error: ENOENT: no such file or directory

If you see an error message suggesting that a particular folder/file could not be installed, there is a chance that the previous command would have installed/fixed anyway and things might just work.

If they don't, then try deleting the `node_modules` folder in the workspace mentioned in the error message (e.g. `./packages/documentation/node_modules` or similar)
