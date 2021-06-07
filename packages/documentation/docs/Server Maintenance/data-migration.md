---
id: dataMigration
title: Automated Backup and Migration
---

The platform consists of many interacting components, including local cache and server databases, frontend code, backend code and serverless functions, and cloud file storage.

From time to time (such as ahead of large updates), it might be useful to migrate all data to a In order to fully ensure major updates aren't breaking, a full preview deployment is a useful way to check for legacy or unexepected issues.

Currently this can be done in a semi-automated way using a script in the scripts folder to take a copy of the production site database and copy it to a preview site.

```
cd scripts
ts-node ./maintenance/reset-staging-site.ts
```

:::note
This script requires access to a service worker with specific permissions for source and target projects, and intermediate storage buckets.
:::

For more information about the script and known limitations see the source code at [scripts/maintenance/reset-staging-site.ts](https://github.com/ONEARMY/community-platform/blob/master/scripts/maintenance/reset-staging-site.ts).

The script is currently run weekly via the github action, see the source code at [.github/workflows/reset-staging-site.yml](https://github.com/ONEARMY/community-platform/blob/master/.github/workflows/reset-staging-site.yml))
