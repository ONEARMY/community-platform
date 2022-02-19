# Installing your own instance

Requirements

- A [Google Firebase project](https://console.firebase.google.com/)
  - A [Firebase Web App](https://firebase.google.com/docs/projects/learn-more#adding_apps_to_a_project)
  - [FireBase Hosting enabled](https://firebase.google.com/docs/hosting/quickstart#install-cli)
  - [Cloud Firestore](https://firebase.google.com/docs/firestore/quickstart)
  - [Authentication](https://firebase.google.com/docs/auth?authuser=0) with the Sign-in providers **Email/Password** enabled.
- [Firebase CLI tools](https://firebase.google.com/docs/cli) locally
- [Create an application](https://console.cloud.google.com/appengine/start/create)
  - Your project must be on the Blaze pay as you go pricing plan
  - [Configure `cors.json` on the storage bucket](https://cloud.google.com/storage/docs/configuring-cors) to support your deployed origin. See: functions/src/config/cors.md

Deploying:

```
firebase use <my-new-project-id>
firebase deploy
```
