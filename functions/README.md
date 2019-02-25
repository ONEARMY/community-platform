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
Simply make a PR and once approved the function will be deployed

## Testing locally

If the code is built you can run firebase serve from the main repo and the functions will also be made available. More info: https://firebase.google.com/docs/functions/local-emulator

Note, this will require authentication for the firebase project. You can request to be added to the project from any of the admins. Alternatively you can use the service account below.

## Handling headers and redirects

By default firebase redirects most requests to the main index file. Custom rewrite has
been added for /api requests and some other exports.
If specific rewrite needs to be handled you can update the root `firebase.json` file.

## Accessing service account

Functions have access to environment variables set in the root `scripts/deploy.sh` scripts,
and include access to service account variables via the config() firebase function import.
More info: https://firebase.google.com/docs/functions/config-env
E.g. can recreate service account json via:

```
{
  "type": "service_account",
  "project_id": config().service.project_id,
  "private_key_id": config().service.private_key_id,
  "private_key": config().service.private_key,
  "client_email": config().service.client_email,
  "client_id": config().service.client_id,
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": (not currently stored)
}

```

To view console logs and events from deployed functions request project access from one of the admins.

If wanting to test locally before deploy the easiest method would be to hardcode the above environment variables. Make sure to change these to config() functions before PR

More info: https://firebase.google.com/docs/functions/local-emulator

You can access a copy of the dev environment variables [here](https://www.dropbox.com/s/54l093zumid9kxu/precious-plastics-v4-dev-service-account-key.json?dl=0)

DO NOT COMMIT THESE VARIABLES TO THE REPO!

(security notice - the service account has limited permissions, so afraid you can't turn the whole project into a crypto miner just yet!)

## Adding cron tasks

Both production and live have small app-engine instances that run cron tasks, schedules can be seen in ../functions-cron.

If changing either of these remember to deploy both to production and development servers
