# Deployment via CircleCI

We use CircleCI to handle automated build-test-deploy cycles when PRs and releases are created from the GitHub Repository

## Environment Variables

The following environment variables should be set within the [CircleCI Environment](https://circleci.com/docs/2.0/env-vars/), or via [CircleCI Contexts](https://circleci.com/docs/2.0/contexts/)

### Firebase Deployment

The most secure way to provide the CI system access to deploy to firebase is by creating a service worker account with relevant permissions
and storing the credentials as an environment variable (see this [Github Issue](https://github.com/firebase/firebase-tools/issues/825) for more info)

```
GOOGLE_APPLICATION_CREDENTIALS_JSON
```

If using multiple projects (e.g. staging/production) these can be configured in different contexts.

When configuring a service account the following permissions should be assigned:

```
Firebase Admin SDK Administrator Service Agent
Cloud Functions Service Agent
Cloud Functions Admin
Firebase Hosting Admin
Cloud RuntimeConfig Admin
```

Alternatively, a `FIREBASE_TOKEN` environment variable can be created and set (See the [Firebase Docs](https://firebase.google.com/docs/cli#cli-ci-systems)),
however this is less preferable as the token would provide access to all a user's firebase projects

### Slack Notifications

Send slack notifications on deploy success/fail/approval-hold:

```
SLACK_DEFAULT_CHANNEL
SLACK_ACCESS_TOKEN
```

Currently passed with `circle-ci-slack-context` context
See [circleci slack orb](https://github.com/CircleCI-Public/slack-orb) for info)

### Runtime Variables

Any variables prefixed with `VITE_` are automatically included with the runtime build. Currently we require:

Firebase configuration

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_DATABASE_URL
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
```

Sentry error tracking

```
VITE_SENTRY_DSN
```

Google Analytics

```
VITE_GA_TRACKING_ID
```

### Misc Variables

Proposed (but not currently implemented)

```
LIGHTHOUSE_API_KEY
```

## Google APIs

To deploy from service_account the following APIs will also need to be enabled for the project:

- [Firebase Hosting API](https://console.cloud.google.com/apis/api/firebasehosting.googleapis.com)

## Functions Variables

Additional configuration variables used in Cloud Functions can be setup with `firebase functions:config:set` (example: `discord_webhook`)

To change the configuration:

1. You need the firebase-cli setup on your local computer.
2. You need a Google account that has privileges for the deployment you want to change.
3. Be inside of the project.
4. Run `firebase use x` where x is the deployment you want to modify (found in the `.firebaserc` file.)
5. It is recommended to do `firebase functions:config:get` for backup.
6. Run `firebase functions:config:set key="value"`
7. You should get a message that the changes will take affect once the functions are deployed again.

External documentation:
https://firebase.google.com/docs/functions/config-env?gen=1st#set_environment_configuration_with_the
