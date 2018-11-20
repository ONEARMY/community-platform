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

The functions are not integrated into the existing CI pipeline for automated deployment as they require
a specific config file which is not shared in the public git repository.

As such to deploy you must first populate the src/config file (available from repo admin), and then run scripts
from the main repo

Select either development or production site (always use development site first)
`npm use [default/prod]`

Deploy
`Firebase deploy --only functions`
