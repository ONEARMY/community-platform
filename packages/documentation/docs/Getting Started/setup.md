---
slug: /
title: Local Setup
---

<!-- Use custom top-meta to ensure shows on first page -->

## Prerequisites

1. Download and install [Git](https://git-scm.com/downloads)  
   This will be used to download the repository

2. Download and install [Node](https://nodejs.org/en/download/)  
   This will be used to run the local server. It included the `npm` package manager

   :::tip
   The recommended version of node to use is **node 12** as this is what also runs in the production environment. If running a higher version and experiencing issues please file a bug report.

   You can use tools like [fnm](https://github.com/Schniz/fnm) or [nvm](https://github.com/nvm-sh/nvm) to run multiple versions of node on the same machine
   :::

3. Download and install Yarn (v2)

```
npm i -g yarn
```

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

Run the platform

```
yarn start
```

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
