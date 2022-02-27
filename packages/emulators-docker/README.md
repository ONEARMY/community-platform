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
[ ] - Provide windows-based docker image (for live-reload on windows)
[ ] - Provide as images on dockerhub
[ ] - Handle sigint to spin down image

Phase 3 - Ready for use/full replacement of legacy methods

[ ] - Migrate seed clean scripts
[ ] - Developer Documentation
[ ] - Integrate emulator build/seed/deploy with CI system
[ ] - Remove all legacy functions code
[ ] - Add docker-compose image for easier customisation/volume mapping (?)

## Known Issues

- Changes made within the workspace package.json will not be reflected in the container.
  Node_modules cannot be bound via volumes as they depend on OS, and so updating package.json will require new build with updated modules. Workaround would be binding full functions src with platform-specific docker image (e.g. node-16-win/node-16-linux) or just documenting required build update (discussion about node-windows support: https://github.com/nodejs/docker-node/pull/362)

- Live-reload function changes (doesn't seem to detect through volumes on WSL)
  https://forums.docker.com/t/file-system-watch-does-not-work-with-mounted-volumes/12038/20
  https://github.com/merofeev/docker-windows-volume-watcher
  Possibly require manual watch on win and exec on image like in L104 https://github.dev/merofeev/docker-windows-volume-watcher/blob/master/docker_volume_watcher/container_notifier.py

- Firebase realtime database emulator does not work. All other emulators support providing a `0.0.0.0` host binding to access the docker host, however the realtime database emulator does not appear to be working when set.
  Requires further investigation, possibly linked to https://github.com/firebase/firebase-tools/issues/2633

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

## Links

https://hub.docker.com/r/goatlab/firebase-emulator

https://hub.docker.com/r/andreysenov/firebase-tools

https://hub.docker.com/r/mtlynch/firestore-emulator

https://github.com/goat-io/fluent/blob/master/src/Docker/Database/Firebase/Dockerfile
