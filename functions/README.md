# Firebase Functions

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

This also only works for specific triggers (namely the api endpoints). If you want to
test a functions triggered in other ways you may first want to create an api endpoint
for testing and later test further with the [firebase functions shell](https://firebase.google.com/docs/functions/local-emulator#install_and_configure_the_cloud_functions_shell), via command `$npm run shell`

Additionally, the functions won't be automatically reloaded on change. This should be possible
(easier when working with JS instead of TS), so if anybody wishes to investigate further they would
be most welcome. Alternatively just restart the serve process on changes.

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
