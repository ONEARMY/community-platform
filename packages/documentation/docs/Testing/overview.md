---
id: overview
title: Testing Overview
---

In the earlier stages of our platform when it consisted of a small number of modules and use cases, we relied on user testing and strict TypeScript typings. However, as the platform grew in complexity, we acknowledged the need for a more comprehensive testing strategy and first started introducing end-to-end (E2E) tests, focusing primarily on core modules like reading and creating how-tos, updating user profiles, etc. For E2E testing, we use Cypress, which has proven to be a valuable asset in our testing arsenal.

While this approach has served us well, we are continuously evolving our testing strategies to ensure the robustness of our platform. Recently, we've expanded our tools to adopt [`@testing-library`](https://testing-library.com/) so that we can continue to write tests which mimic user interactions but run significantly faster than the Cypress E2E test suites.

There are two specific aims of this approach:

- Speed up local development workflows by providing fast feedback after changes have been made
- Reduce the cost around introducing new tests so that it is easier for contributors to include tests as part of their changes.

## Running tests

### Core application

```bash
yarn test:unit
## Application e2e
yarn test
```

### Components

```
yarn test
```

### Functions

```
yarn test
```
