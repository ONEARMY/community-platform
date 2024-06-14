## Cypress

[Cypress](https://www.cypress.io/) is a next generation front end testing tool built for the modern web. We address the key pain points developers and QA engineers face when testing modern applications.

[Best practices to be followed](https://docs.cypress.io/guides/references/best-practices)

### Folder Structure

- `scripts`: Contains scripts necessary to run the tests.
  - `paths.ts`: Stores all the paths needed to execute the tests.
  - `start.ts`: Script to automate the process of running end-to-end (E2E) tests using Cypress CI and Manual
- `src`: Contains the source code for the Cypress project.
  - `data`: Holds index.ts which is responsible for managing data.
  - `fixtures`: Stores data, images, and files used in the tests.
  - `integration`: Contains spec.ts files which hold the actual test scripts.
  - `plugins`: Contains Cypress plugins.
  - `support`: Contains support files for Cypress tests.
    - `db`: database scripts related(seed, clear, query, delete)
    - `commands.ts`: Defines general custom Cypress commands.
    - `commandsUI.ts`: Defines UI-related custom Cypress commands.
    - `customAssertions.ts`: Contains custom Cypress assertions.
    - `hooks.ts`: Defines Cypress hooks.
    - `index.ts`: Index file for exporting all plugins.
    - `rules.ts`: Contains rules for Cypress.
  - `utils`: Holds utility functions for the Cypress project.

### Test data SEED

The seed data is maintained in the `/shared/mocks/data directory`.

### How Tests Run

- Before All: Set up the DB_PREFIX and DB seed.
- Before Each (Global): Set the DB_PREFIX variable on the platform session storage.
- Before Each (Local): Perform pre-set actions for the scenario.
- Main Section of Test: Steps according to the scenario.
- Assert Section of Test: Validation to the scenario.

### Execution Steps

Running Cypress E2E Tests

`yarn test` to start local environment and open the cypress UI
