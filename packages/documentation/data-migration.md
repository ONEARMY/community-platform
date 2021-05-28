# Data Migration

The platform consists of many interacting components, including local cache and server databases, frontend code, backend code and serverless functions, and cloud file storage.

From time to time (such as ahead of large updates), it might be useful to migrate all data to a In order to fully ensure major updates aren't breaking, a full preview deployment is a useful way to check for legacy or unexepected issues.

Currently this can be done in a semi-automated way using a script in the scripts folder, however this requires the user to have various softwares installed on their computer as well as access to any/all projects used.

```
cd scripts
ts-node ./maintenance/firebase-project-migrate.ts
```
