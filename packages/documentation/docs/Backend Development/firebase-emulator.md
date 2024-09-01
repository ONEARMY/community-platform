---
id: firebase-emulator
title: Firebase Emulator
---

# Introduction

To run backend functions locally, Firebase provides a suite of emulators to mimic most functionality seen online (e.g firestore, storage, functions, triggers, etc.)

For simplicity, although each service is an individual emulator and we are running multiple services, we will refer to them all collectively as a single emulator.

# Getting started

We start the frontend and backend separately, so we have two different commands. Generally, for development, you would have both commands running at the same time in different terminals.

## Prerequisites

The emulator can be a bit tricky to setup and populate with seed data, so we have a Docker image that contains all the necessary setup.

You will need to be able to run `docker-compose` commands on your local machine.

The easiest way to do that is to install [Docker Desktop](https://docs.docker.com/desktop/).

You can ensure it is running with:

```sh
docker-compose -v
# Docker Compose version v2.20.3
```

## Commands

To make things easier, we offer some yarn commands.

### Starting the frontend

```
yarn run frontend:for-emulated-backend:watch
```

This is similar to `yarn run start` but configures the frontend to connect to the local backend.

### Starting the backend

```
yarn run backend:emulator:watch
```

This starts the Firebase emulator, loads code, and watches for changes. The databases are populated with seed data, see the section below for details.

## Note

It is assumed that all of these commands will be ran from the root directory of the project. Running them from elsewhere may cause issues.

## Visiting the frontend

The frontend should start at [localhost:4000](http://localhost:4000). You should see a small banner at the bottom of the page that informs the emulator is in use.

![](./images/emulator-docker-frontend.png)

## Visiting the emulator dashboard

The emulator should start at [localhost:4001](http://localhost:4001).

![Dashboard](./images/firebase-emulator-dashboard.png)

Clicking on tabs will take you to a page similar to the Firebase console, from where you can interact with individual services.

## Seed data

Hardcoded data is loaded into the emulator on start-up. Any changes will be lost the next time the emulator is started.

You may experience some strange data issues, for example incorrectly getting error messages that a user already exists after restarting, but that is probably due to browser caching. You can verify that by using another browser; in that case the original browser's indexeddb cache would need to be manually cleared.

### User logins

The seed comes preloaded with some user accounts. When it is running, you can see a complete list at [localhost:4001/auth](http://localhost:4001/auth).

Examples:

Admin user account:

```
email: admin@example.com
password: wow_backend_development_is_fun
```

Normal user account:

```
email: normal_jim@example.com
password: thanks_emulator_man
```

### Improving it

You can improve the seed data by making changes via the application or Firebase user interface, exporting the data, and making a pull request. This will help make development and testing easier for you and others.

1. Get the container name using `docker ps`.

2. Run the export script:

```
docker exec -it <container_name> /app/containerization/export.cjs
```

3. Transfer the data from the container to your host machine:

```
docker cp <container_name>:/app/dump ./whatever
```

4. Then replace the content of `./containerization/data` with it. But note, each folder in the export must be checked into Git. If not, this will cause problems when the emulator tries to start. By default, Git does not track empty folders, so you must force it to track it by adding a `.gitkeep` file to the folder.

## Function development

### Writing functions code

When you make changes to the functions code, this is shared to the container and then the emulator. These changes should be picked up almost immediately.

### Invoking functions

Functions can be invoked in different ways depending on their trigger type.

For functions triggered by storage or database changes, making changes directly on the dashboard or from the frontend should trigger the corresponding function.

Similarly callable functions should be triggered from the frontend.

For functions triggered by HTTP request, you can call them directly either from command line, web browser or REST client such as [Insomnia](https://insomnia.rest/)

E.g. calling the emulator `seed-users-create` function via a GET request:

```
http://localhost:4002/demo-community-platform-emulated/us-central1/emulator/seed-users-create
```

![](images/emulator-docker-http-req.png)

Read more about [connecting your app to the Cloud Functions Emulator](https://firebase.google.com/docs/emulator-suite/connect_functions).

### Accessing logs

If the emulator throws an error you may want to check generated debug.log files. These are generated on the container and shared to your machine. Just check the root folder, for example: `firestore-debug.log`

You can access the file system within the docker container directly using the
[Remote-Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension for vscode, and running the command to `attach to running container`.

![](images/emulator-docker-remote.png)

Once running in the container you can open the `/app` folder to view files
![](images/emulator-docker-remote-files.png)

Alternatively while the container is running, you can request Docker to execute commands directly on the container:

```
docker exec -it <container_name> ls
docker exec -it <container_name> cat /app/firestore-debug.log
```

(The `container_name` can be retrieved by running `docker ps`.)

## Troubleshooting

See the `./containerization/Dockerfile` file for some debugging tips.
