## Quickstart

### Creating a new docker image

Populate data for import in the `./import` directory. This should be an export from firestore with individual collection namespaces selected (not all namespaces)

Run the build script

```
yarn workspace oa-emulators-docker build
```

Optionally repo and tag args can be passed if planning to upload to dockerhub

```
yarn workspace oa-emulators-docker build --repo=my_docker_repo --tag=v1
```

### Running a docker image

```
yarn workspace oa-emulators-docker start --repo=my_docker_repo --tag=v1
```

With repo and tag args specified from build step (or left as defaults). An example build can be run directly via

```
yarn workspace oa-emulators-docker start --repo=chrismclarke
```

This will start the emulators with a dashboard available at `http://localhost:4001`

### Using with frontend

Once the emulators are up and running you can spin up the platform on port 4000 (which defaults to using emulators)

```
yarn cross-env PORT=4000 yarn start:platform
```

As you use the platform you should see changes happen within the firebase emulator dashboard
`shared\mocks\auth-users.ts`. E.g. you can login as

```
user: demo_admin@example.com
pass: demo_admin
```

### Modifying functions

The emulators bind to the `functions/dist` folder so that changes made will be reflected in the emulators. On linux these changes should be picked up immediately, and so live-reload can be added for functions development via `yarn workspace functions watch`

If running on windows the changes are not always detected, and may require spinning the emulators down and then starting back up

## About

This workspace aims at providing a fully configured and seeded suite of firebase emulators within a docker container for use with the oa-community-platform.

Whilst it is possible to download and execute firebase emulators directly, there are a few problems related to do so including:

- Required java download
- Configuring service account and/or additional auth
- Manual seed data required
- Handling port bindings

By providing a docker image we can address all issues above and provide better pathways for future integration with additional dockerised services

## TODO

Phase 1 - Dockerised emulators working locally with seed data, providing a solid environment testing frontend/UI changes against replica live data

[x] - Create dockerfile for base firebase emulator environment
[x] - Handle service account authentication
[x] - Add scripts to handle build (including functions compile, copy, docker build etc.)
[x] - Add scripts to handle start
[x] - Populate seed data
[x] - Integrate as backend for app start

Phase 2 - Dockerised emulators also support local functions development/testing (on linux)

[?] - Support live-reload for functions (linux)
[x] - Provide as images on dockerhub
[x] - Add support for pulling from remote image
[x] - Integrate auth user account seeding
[x] - Add logging output override to correct information (e.g. docker port)
[x] - Handle sigint to spin down image

Phase 3 - Ready for use/full replacement of legacy methods

[x] - Migrate seed clean scripts
[ ] - Optimise image size
[ ] - Developer Documentation
[ ] - Integrate emulator build/seed/deploy with CI system
[ ] - Improve tagging to include project (e.g. precious-plastic), date and raw/cleaned data
(requires fix to existing staging site export/restore actions)
[ ] - Remove all legacy functions code
[ ] - Consider binding functions src folder and not dist (will require configuring yarn workspaces to populate shared as required, known issue below)
[ ] - Add docker-compose image for easier customisation/volume mapping (?)
[ ] - Provide windows-based docker image (for live-reload on windows)

## Known Issues

~- DB updates made from frontend (e.g updating user profile) are not written to the database. Not sure why this is, possibly has already been fixed if updating to firebase 9. So for now it works as read-only, or testing triggers from manual db update via dashboard. The [Client SDK availability](https://firebase.google.com/docs/emulator-suite/install_and_configure#client_sdk_availability) docs suggest that (currently) the emulators only work with sdk `8.0.0`~

- DB can only make write updates from client sdk if project names match, and so the DOCKER file may need to be updated if using a project name that is not the same as the one hardcoded into the frontend (currently `community-platform-emulated`)

- According to the [Client SDK availability](https://firebase.google.com/docs/emulator-suite/install_and_configure#client_sdk_availability) docs the current sdk version supported is `8.0.0`, so it is unclear if the emulators will continue to work if upgrading firebase further

- Changes made within the workspace package.json will not be reflected in the container.
  Node_modules cannot be bound via volumes as they depend on OS, and so updating package.json will require new build with updated modules. Workaround would be binding full functions src with platform-specific docker image (e.g. node-16-win/node-16-linux) or just documenting required build update (discussion about node-windows support: https://github.com/nodejs/docker-node/pull/362)

- Live-reload function changes (doesn't seem to detect through volumes on WSL)
  https://forums.docker.com/t/file-system-watch-does-not-work-with-mounted-volumes/12038/20
  https://github.com/merofeev/docker-windows-volume-watcher
  Possibly require manual watch on win and exec on image like in L104 https://github.dev/merofeev/docker-windows-volume-watcher/blob/master/docker_volume_watcher/container_notifier.py

- Ideally we would want to just copy functions src code into the docker volume and execute directly from there (would avoid issue with livereload), however as the functions depend on other workspaces (namely shared and the main src workspace) binding these will have the same issue as node_modules.

  It might be possible to manually build and create symlinks within the docker volume node_modules (in the same way yarn workspaces makes symlinks to the real workspaces), however this adds considerable overhead. It would be more viable once shared src types moved to shared folder, so at least only one shared workspace to bind

- Firebase realtime database emulator does not work. All other emulators support providing a `0.0.0.0` host binding to access the docker host, however the realtime database emulator does not appear to be working when set.
  Requires further investigation, possibly linked to https://github.com/firebase/firebase-tools/issues/2633

- Boxen, globby and log-update packages have been pinned to older versions as newer require es module imports, which is not currently supported by dockerode (https://github.com/apocas/dockerode/issues/632)

## Quickstart

### Install Docker

Follow instructions at: https://docs.docker.com/get-docker/

Ensure running `docker -v`

### Build image

```
yarn workspace oa-emulators-docker build
```

### Run image

```
yarn workspace oa-emulators-docker start
```

NOTE - the emulator ui will be available on http://localhost:4001
(not http://0.0.0.0:4001 as logs state - this is internal docker binding)

## Troubleshooting

Failed Build

- Check firebase-debug.log on container

Misc

- Retart docker

Container access

- Start shell from docker-desktop or use vscode [Remote-Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension to `attach to running container` and open vscode directly in docker container

## Links

https://hub.docker.com/r/goatlab/firebase-emulator

https://hub.docker.com/r/andreysenov/firebase-tools

https://hub.docker.com/r/mtlynch/firestore-emulator

https://github.com/goat-io/fluent/blob/master/src/Docker/Database/Firebase/Dockerfile
