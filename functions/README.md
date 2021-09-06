# Firebase Functions

**Update 2021-08-11**

This documentation likely requires updating, and the information provided may no longer be fully valid. Please feel free to create a new issue for any specific items identified as conflict/confusing or possibly no longer valid.

Some additional, newer information can also be found in [Firebase Emulators Docs](../packages/documentation/docs/Backend%20Development/firebase-emulators.md)

---

## What are they?

Firebase functions are backend functions, triggered either via https requests, cloud pub/sub or other specific Firebase events (e.g. database/storage writes). They run within a nodejs environment and have full ability to interact with the firebase platform.
https://firebase.google.com/docs/functions/

## How are they used at One Army?

Currently

- Database backups
- Image compression
- DHSite tracking and migration

Future

- Analytics

## How to build and deploy

The functions are integrated into the ci pipeline for master and production branches.
Simply make a PR and once approved the function will be deployed

## Testing locally

```
cd functions
npm run start
```

This spins up concurrent tasks to build and watch for changes to the typescript code, and run
the firebase emulator which will hot-reload when the compiled code changes. This combination
should mean that changes to functions can be tested locally, via the given endpoint, e.g.  
`http://localhost:5001/precious-plastics-v4-dev/us-central1/api`
More info: https://firebase.google.com/docs/functions/local-emulator

It is recommended that you use a good API testing software, such as [Postman](https://www.getpostman.com/) or [Insomnia](https://insomnia.rest/) for this

Note, this will require authentication for the firebase project. You can request to be added to the project from any of the admins. Once authenticated, you can login to firebase within your own console
and the relevant config will automatically be made available
(viewable with command `firebase functions:config:get`)

This also only works for specific triggers (namely the https callable functions, api endpoints). For more information see https://firebase.google.com/docs/functions/local-emulator.

NOTE - if running a function that requires access to the live database (and not just emulated), use `npm run serve:only:functions`, which will exclude db emulator and default to live project db

## Handling headers and redirects

By default firebase redirects most requests to the main index file. Custom rewrite has
been added for /api requests and some other exports.
If specific rewrite needs to be handled you can update the root `firebase.json` file.

## Accessing environment variables (e.g. service account)

Functions have a config:set method which makes environment variables available to
all instances running on the project. These can be set and retrieved by anybody with
appropriate access rights on the repository (if you need them just ask Chris or one of
the other project admins)

When testing locally you can run the `serve` script which also takes a copy of the
server config and copies locally (to `.runtimeconfig.json` ) so that it can be accessed
by localhost functions also.

## Viewing console logs

To view console logs and events from deployed functions request project access from one of the admins.

## Adding cron tasks

Both production and live have small app-engine instances that run cron tasks, schedules can be seen in ../functions-cron.

If changing either of these remember to deploy both to production and development servers

# Using functions for data migrations

If making changes across the entire DB it is likely that backend functions will be used to do so.
A couple tips to help implementing:

1. Create backups of all the collection points potentially affected.
   (note, you will need admin access to the project, and initialise using gcloud. Confirm access via `gcloud config list` and select project via `gcloud init`)

```
gcloud firestore export gs://[BUCKET_NAME] --collection-ids=[COLLECTION_ID_1],[COLLECTION_ID_2]
```

E.g. for the staging server, updating howtos and events:

```
gcloud firestore export gs://precious-plastics-v4-dev-exports/2020-10-12 --collection-ids=v3_howtos,v3_events
```

Or production

```
gcloud firestore export gs://onearmyworld-exports/2020-10-12_manual_backup --collection-ids=v3_events,v3_howtos,v3_mappings,v3_tags,v3_users
```

(note - whilst the full database can be backed up without specifying collection ids, this makes it harder to re-import a single collection)
For more info see https://firebase.google.com/docs/firestore/manage-data/export-import#export_specific_collections

1. For any data that you want to be reflected immediately, also change the `modified` field so that user caches will update as required

2. If less confident or making large scale changes, consider populating to a new db endpoint, e.g. `v4_howtos`
   (this will need to also be updated in the models for both functions and frontend)
