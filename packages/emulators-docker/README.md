## Quick start

See [documentation](../../packages/documentation/docs/Backend%20Development/firebase-emulators-docker.md)

## About

This workspace aims at providing a fully configured and seeded suite of firebase emulators within a docker container for use with the oa-community-platform.

Whilst it is possible to download and execute firebase emulators directly, there are a few problems related to do so including:

- Required java download
- Configuring service account and/or additional auth
- Manual seed data required
- Handling port bindings

By providing a docker image we can address all issues above and provide better pathways for future integration with additional dockerised services

## TODO

[?] - Support live-reload for functions (linux)
[ ] - Optimise image size (reduce RUN commands, possible multi-stage build)
[ ] - Remove all legacy functions code
[ ] - Add tests to ensure data is exported as expected (e.g all collections exist)
[ ] - Consider binding functions src folder and not dist (will require configuring yarn workspaces to populate shared as required, known issue below)
[ ] - Find means to have functions-specific lock file and use as part of build process
[ ] - Automate seed data update (cron action to export and make pr)
[ ] - Add docker-compose image for easier customisation/volume mapping (?)
[ ] - Possible option to use without functions dist (currently requires functions build during start)
[ ] - Provide windows-based docker image (for live-reload on windows)

## Known Issues

- DB can only make write updates from client sdk if project names match, and so the DOCKER file may need to be updated if using a project name that is not the same as the one hardcoded into the frontend (currently `community-platform-emulated`)

- Changes made within the workspace package.json will not be reflected in the container.
  Node_modules cannot be bound via volumes as they depend on OS, and so updating package.json will require new build with updated modules. Workaround would be binding full functions src with platform-specific docker image (e.g. node-18-win/node-18-linux) or just documenting required build update (discussion about node-windows support: https://github.com/nodejs/docker-node/pull/362)

- Live-reload function changes (doesn't seem to detect through volumes on WSL)
  https://forums.docker.com/t/file-system-watch-does-not-work-with-mounted-volumes/12038/20
  https://github.com/merofeev/docker-windows-volume-watcher
  Possibly require manual watch on win and exec on image like in L104 https://github.dev/merofeev/docker-windows-volume-watcher/blob/master/docker_volume_watcher/container_notifier.py

- Ideally we would want to just copy functions src code into the docker volume and execute directly from there (would avoid issue with livereload), however as the functions depend on other workspaces (namely shared and the main src workspace) binding these will have the same issue as node_modules.

  It might be possible to manually build and create symlinks within the docker volume node_modules (in the same way yarn workspaces makes symlinks to the real workspaces), however this adds considerable overhead. It would be more viable once shared src types moved to shared folder, so at least only one shared workspace to bind

- Firebase realtime database emulator does not work. All other emulators support providing a `0.0.0.0` host binding to access the docker host, however the realtime database emulator does not appear to be working when set.
  Requires further investigation, possibly linked to https://github.com/firebase/firebase-tools/issues/2633

- [Boxen](https://www.npmjs.com/package/boxen), globby and log-update packages have been pinned to older versions as newer require es module imports, which is not currently supported by dockerode (https://github.com/apocas/dockerode/issues/632)

## Links

https://hub.docker.com/r/goatlab/firebase-emulator

https://hub.docker.com/r/andreysenov/firebase-tools

https://hub.docker.com/r/mtlynch/firestore-emulator

https://github.com/goat-io/fluent/blob/master/src/Docker/Database/Firebase/Dockerfile
