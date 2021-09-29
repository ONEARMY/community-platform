## Shared
Various content needs to be shared between different parts of the app, e.g.

- Frontend src
- Backend functions
- Cypress e2e tests

The shared workspace can be used to share functions and constants between other projects

### Known Issues
- In order to use typings, the code must be compiled first. That means any other workspaces importing the code will need to trigger the build script first, e.g.
```
yarn workspace oa-shared build && npm run start
```
Any changes made in these files will require reload (TODO - add watch/live-reload)