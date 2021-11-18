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

If using multiple projects (e.g. staging/prodcution) these can be configured in different contexts.

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

Send slack notificatons on deploy success/fail/approval-hold:

```
SLACK_DEFAULT_CHANNEL
SLACK_ACCESS_TOKEN
```

Currently passed with `circle-ci-slack-context` context
See [circleci slack orb](https://github.com/CircleCI-Public/slack-orb) for info)

### Runtime Variables

Any variables prefixed with `REACT_APP_` are automatically included with the runtime build. Currently we require:

Algolia places location lookup

```
REACT_APP_ALGOLIA_PLACES_API_KEY
REACT_APP_ALGOLIA_PLACES_APP_ID
```

Firebase configuration

```
REACT_APP_FIREBASE_API_KEY
REACT_APP_FIREBASE_AUTH_DOMAIN
REACT_APP_FIREBASE_DATABASE_URL
REACT_APP_FIREBASE_MESSAGING_SENDER_ID
REACT_APP_FIREBASE_PROJECT_ID
REACT_APP_FIREBASE_STORAGE_BUCKET
```

Sentry error tracking

```
REACT_APP_SENTRY_DSN
```

Google Analytics

```
REACT_APP_GA_TRACKING_ID
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

Additional config used in cloud functions has also been included via `firebase functions:config:set`
E.g. `discord_webhook`, `slack_webhook`,

TODO - This requires further documentation (and possibly merging)
