---
slug: /
title: Getting Started
---

<!-- Use custom top-meta to ensure shows on first page -->

# Getting Started
Thanks for being here already! You'll find all the information you need to start contributing to the project. Make sure to read them before submitting your contribution.

If you think something is missing, consider sending us a PR.

## Prerequisites

1. Download and install [Git](https://git-scm.com/downloads)  
   This will be used to download the repository

2. Download and install [Node v20](https://nodejs.org/en/download/)  
   This will be used to run the local server. It included the `npm` package manager

3. [Download and install Yarn](https://yarnpkg.com/getting-started/install) (v3)

4. (Optional) Download and install [Docker](https://docs.docker.com/get-docker/)
   This will be used for running the emulator if doing local backend development

   :::tip
   We recommend using [VSCode](https://code.visualstudio.com/download)

   Additionally there are a couple extensions that work well with our current technology stack:

   - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) to auto-format and enforce code conventions.
   - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) to type-check code
   :::

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

See the details [here](/Backend%20Development/firebase-emulator).
