# Firebase Functions

## What are they?

Firebase functions are backend functions, triggered either via https requests, cloud pub/sub or other specific Firebase events (e.g. database writes). They run within a nodejs environment and have full ability to interact with the firebase platform.
https://firebase.google.com/docs/functions/

## How are they used at One Army?

Currently

- Database backups

Future

- Image compression on upload

## How to build and deploy

The functions are integrated into the ci pipeline for master and production branches.
Functions have access to environment variables set in the root `scripts/deploy.sh` scripts,
and include access to service worker variables via the config() firebase function import
E.g. to recreate:

```
{
  "type": "service_account",
  "project_id": config().project_id,
  "private_key_id": config().private_key_id,
  "private_key": config().private_key,
  "client_email": config().client_email,
  "client_id": config().client_id,
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": (not currently stored)
}

```

To view console logs and events from deployed functions request project access from one of the admins.

If wanting to test locally before deploy the easiest method would be to hardcode the above environment variables. Make sure to change these to config() functions before PR

You can access a copy of the dev environment variables [here](https://www.dropbox.com/s/54l093zumid9kxu/precious-plastics-v4-dev-service-account-key.json?dl=0)

DO NOT COMMIT THESE VARIABLES TO THE REPO!

(security notice - the service account has permissions for firebase admin only, so afraid you can't turn the whole project into a crypto miner just yet!)

## Adding cron tasks

Both production and live have small app-engine instances that run cron tasks, schedules can be seen in ../functions-cron.

If changing either of these remember to deploy both to production and development servers
