# E2E Testing

We use [Cypress](https://www.cypress.io/), and tests run on a dedicated supabase cloud project.

## Getting Started

```
yarn test
```

### Data Seeding

The seed runs when tests start and cleanup after tests complete.

### CI testing

Tests are automatically run on every pull request, and can be viewed on the cypress dashboard. A link to the specific test run will be populated into the PR, or publicly viewable at: https://dashboard.cypress.io/projects/4s5zgo/runs

### Browser testing

Tests are run against Chrome. We used to run against firefox as well, but it caused too many flaky tests which caused a slow development and deployment flow.
