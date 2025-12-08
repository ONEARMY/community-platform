---
id: overview
title: Testing Overview
---

We use Vitest for Unit Tests and Cypress for E2E Tests.

- Unit tests are faster and favored for frontend component logic.
- For other behavior that interacts with the Database, cypress tests are the best option.

## Running tests

### Main App

```bash
## Unit Tests
yarn test:unit
```

```bash
## E2E Tests
yarn test
```

### Component Library

```
yarn test:components
```
