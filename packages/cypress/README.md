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
    - `commandsAdmin.ts`: Defines commands for admin panel tables and dialogs.
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

### Writing tests

Our specs are documentation. Someone who has never seen a feature should be able to read its spec and understand what people can do and what happens when they do it.

```ts
it('[Admin can manage questions]', () => {
  cy.signIn(admin.email, admin.password);
  cy.visit('/admin/questions');
  cy.contains('h1', 'Questions');

  cy.step('Delete asks for confirmation and can be cancelled');
  cy.adminAction('Delete', question.title);
  cy.contains('[data-slot=dialog-footer] button', 'Cancel').click();
  cy.get('[data-slot=dialog-content]').should('not.exist');

  cy.step('Admin can delete a question');
  cy.adminAction('Delete', question.title);
  cy.confirmDialog();
  cy.expectToast('Question deleted');
});
```

#### Tests

- **Each test is a user journey.** Steps that naturally follow on from each other belong in one test, split up with `cy.step`. A test should never be a single set of expectations.
- **End-to-end only.** Test what a person does in the browser. Don't call the API directly from a test.
- **Each page's spec tests that page.** Reach and check the page inside the spec that tests it, rather than in a separate navigation spec.
- **Keep the specifics in the spec.** Paths, headings and names a reader needs to follow the journey stay in the test. A helper that hides what page you're on or what you're checking is too DRY.
- **No loops.** Instead of `forEach` over cases, write a small named function and call it once per case.
- **Take seeded values from `MOCK_DATA`** rather than typing them into the spec.

#### Commands

- **Selectors and DOM details belong in commands**, so the test body reads as steps.
- **One job per command.** Name it after what a person does or sees, for example `confirmDialog` or `expectToast`.
- **No `if` statements.** If a command needs to branch, split it into two commands, like `expectFormError` and `expectFieldError`.
- **Log one plain-English line** with `Cypress.log`, and pass `{ log: false }` to the commands inside, so the command log reads like the test.
- **Reuse before adding.** Check `commands.ts`, `commandsUi.ts` and `commandsAdmin.ts` first. For example, use `cy.expectToast` rather than a hand-written toast selector.

### Execution Steps

Running Cypress E2E Tests

`bun test` to start local environment and open the cypress UI
