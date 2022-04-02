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
