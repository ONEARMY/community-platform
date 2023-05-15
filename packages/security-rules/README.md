# Security Rules

> Firebase Security Rules stand between your data and malicious users. You can write simple or complex rules that protect your app's data to the level of granularity that your specific app requires.
> Source: https://firebase.google.com/docs/rules

This workspace contains a suite of tests to validate the Firestore Security Rules used within our platform.

These tests are intended to run against an emulator locally, however you will need to provide the project id for a real firebase project.

## Getting Started

`yarn install`

Create a `.env` file in the root of this project which contains:

```
PROJECT_ID=<firebase-project-id>
```

Run the tests against the project rules using `yarn test-with-emulator`
