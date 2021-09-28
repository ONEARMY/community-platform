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

   NOTE - the recommended version of node to use is v12 as this is what also runs in the production environment. If running a higher version and experiencing issues please file a bug report. 
   Alternatively you can install/use multiple versions via tools like [nvm](https://github.com/nvm-sh/nvm)

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
