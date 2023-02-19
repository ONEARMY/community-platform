---
id: tests
title: Tests
---

Backend tests are written with [Jest](https://jestjs.io/docs/getting-started) and executed against a set of emulators for core services

## Prerequisites

You will need to support the running of [Firebase Emulators](https://firebase.google.com/docs/emulator-suite/install_and_configure#install_the_local_emulator_suite)

## Running Locally

```
yarn workspace functions test:watch
```

This will startup the firebase emulator suite, compile functions, and watch for any changes to function or spec test files

:::info  
The emulator console can be viewed on [localhost:4001](http://localhost:4001)
:::

To run just a single test the interactive prompts can be used to provide a matching filename path, e.g.

```sh
$ yarn workspace functions test:watch

$ Watch Usage
> Press p to filter by a filename regex pattern

$ pattern › mySpec

```

This will automatically watch for changes to any files that match the regular expression `/mySpec/`

## Writing Tests

Tests are written in [Jest](https://jestjs.io/docs/getting-started), with filenames ending `.spec.ts`

## Utilities and Examples

### Mocking Methods

Mocks are a useful tool to reduce the number of additional services a test interacts with, making them more resilient to changes in the codebase.

There are various ways to achieve this, many of which are outlines in the Jest [Mock Functions](https://jestjs.io/docs/mock-functions) documentation

A few methods commonly used in the codebase include:

**Imports**
Return a set of mock methods or utilities in place of an import. An example from the frontend code is when we want to avoid importing all stores, but instead just mock a single method

```ts
jest.mock('src/index', () => {
  return {
    useCommonStores() {
      return {
        stores: {
          userStore: {
            fetchAllVerifiedUsers: jest.fn(),
          },
        },
      }
    },
  }
})
```

**Class Methods**
Replace specific class method with an alternative mock method. E.g. if the code relates to the active user, a mock stub could be used instead. An an artificial example:

```ts
import UserMethods from './userMethods'

UserMethods.activeUser = jest.fn().mockReturnValue({ id: 'fake_user' })
```

**Replace or extend multiple class methods with mocks**
Similarly, entire mock classes can be used where appropriate

```ts
import UserMethods from './userMethods'

class MockUserMethods implements Partial<UserMethods>{
  activeUser: () => jest.fn().mockReturnValue({ id: 'fake_user' })
  setUser: () => jest.fn()
}
```

### Execute Functions Directly

It is possible to directly execute any function within the test environment without its required trigger.
A utility `FirebaseEmulatedTest` class is used to wrap the function invocation so that it can be used async, e.g.

_myFunction.ts_

```ts
import functions from 'firebase-functions'

exports.default = functions.firestore
  .document(`mockEndpoint/{id}`)
  .onUpdate((change) => {
    return doSomething(change)
  })
```

_myFunction.spec.ts_

```ts
import { FirebaseEmulatedTest } from '../test/Firebase/emulator'
import myFunction from './myFunction.ts'

const beforeData = { field: 'initialValue' }
const afterData = { field: 'changedValue' }

const change = FirebaseEmulatedTest.mockFirestoreChangeObject(
  beforeData,
  afterData,
  'mockEndpoint',
  'mockDocId',
)

await FirebaseEmulatedTest.run(myFunction, change)
```

Additional utilities can also be used to provide a mock of the triggering context. In the example above a mock `before` and `after` data snapshot is created to mimic the firestore document change trigger used by the function

### Seed and Teardown Data

The test utilities also have methods for seeding and clearing the Firestore DB if required for tests.

_myFunction.spec.ts_

```ts
beforeEach(async () => {
  await FirebaseEmulatedTest.seedFirestoreDB('users', [{ _id: 'user1 ' }])
})
afterEach(async () => {
  await FirebaseEmulatedTest.clearFirestoreDB()
})
```

Additionally all emulator data will be cleared when scripts are terminated

:::caution  
If your test function interacts directly with an empty database endpoint it may throw an error  
(various issues on github, should review in the future)
:::

The easiest workaround is to seed the endpoint without any docs, which will allow the emulators to return an empty array from queries.

```
await FirebaseEmulatedTest.seedFirestoreDB('empty_endpoint',[])
```

### Production Data

There may also be some cases where methods want to be tested against production data to check for any additional edge-cases or give a preview new feature development.

There currently isn't a single automated way to do this, however you can see an example of the manual steps involved in the `test_functions` step of the [CircleCI pipeline](https://github.com/ONEARMY/community-platform/blob/feat/aggregation-tests/.circleci/config.yml#L244-L245)

Alternatively developers can follow the steps in [Firebase Emulators Docker](./firebase-emulators-docker.md) to run the docker emulators locally and manually invoke functions
