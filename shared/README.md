## Shared

Various content needs to be shared between different parts of the app, e.g.

- Frontend src
- Backend functions
- Cypress e2e tests

The shared workspace can be used to share functions and constants between other projects

### Known Issues

- Typescript will not be compiled. This might be resolved in the future if migrating to lerna or tweaks to tsconfig files. For now will have to just use untyped constants and functions

For a more general example of workspaces working across typescript projects see:
https://stackoverflow.com/questions/57679322/how-to-use-yarn-workspaces-with-typescript-and-out-folders
