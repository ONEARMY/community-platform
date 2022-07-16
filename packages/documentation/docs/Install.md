# Installing your own instance

Requirements

1. A [Google Firebase project](https://console.firebase.google.com/)
1. A [Firebase Web App](https://firebase.google.com/docs/projects/learn-more#adding_apps_to_a_project)
1. [FireBase Hosting enabled](https://firebase.google.com/docs/hosting/quickstart#install-cli)
1. [Authentication](https://firebase.google.com/docs/auth?authuser=0) with the Sign-in providers **Email/Password** enabled.
1. [Cloud Firestore](https://firebase.google.com/docs/firestore/quickstart)
1. [Realtime Database](https://firebase.google.com/docs/database?authuser=0&hl=en)
1. Firebase CLI tools](https://firebase.google.com/docs/cli) locally
1. Create an application](https://console.cloud.google.com/appengine/start/create)
1. Your project must be on the Blaze pay as you go pricing plan
1. Configure `cors.json` on the storage bucket](https://cloud.google.com/storage/docs/configuring-cors) to support your deployed origin. See: functions/src/config/cors.md

Deploying:

```
firebase use <my-new-project-id>
firebase deploy
```

Troubleshooting:

1. `Error: Can't determine Firebase Database URL`
   If you see this message it is likely you skipped adding the [Realtime Database](https://firebase.google.com/docs/database?authuser=0&hl=en). Easily done!

2. `The caller does not have permission`
   This occurs more commonly when deploying from a CI environment, and usually signifies additional permissions are required for the service account that is used for deployment. You can view the service account details from the [GCP Logs Explorer](https://console.cloud.google.com/logs), filtering by severity and expanding to see more information.

   Examples of previously noted permissions required can be found in [Deployment via CircleCI](Deployment/circle-ci.md) and [Firestore DB Backup](./Backend%20Development//firestore-backup.md)

## Community Platform Maintainers

We deploy to our instances directly from the `master` and `production` branches of the git repository.

You will need to set up a CircleCI context for each target environment. This context should contain the following variables:

- `FIREBASE_TOKEN`
- `GOOGLE_APPLICATION_CREDENTIALS_JSON`
- `REACT_APP_BRANCH`
- `REACT_APP_FIREBASE_API_KEY`
- `REACT_APP_FIREBASE_AUTH_DOMAIN`
- `REACT_APP_FIREBASE_DATABASE_URL`
- `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
- `REACT_APP_FIREBASE_PROJECT_ID`
- `REACT_APP_FIREBASE_STORAGE_BUCKET`
- `REACT_APP_GA_TRACKING_ID`
- `REACT_APP_PLATFORM_THEME`
- `REACT_APP_PLATFORM_PROFILES` - comma separated list of available profiles. Use `ProfileType` from modules/profile/index for guidance here. For example: `member,workspace`
- `REACT_APP_SUPPORTED_MODULES` – comma separated list of available modules. See `/src/modules/index.ts` for the definitions.
- `SITE_NAME`
