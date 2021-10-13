---
id: emulator-seed-data
title: Working with Seed Data
---

By default the emulators load any data found in the [functions/data/emulated](../../../../functions/data/emulated) folder, which can be previously exported from another firebase app or emulator instance.

By default this data is not committed to the repo and so initial data will be empty, however specific zip files have been generated from site backup files and can be loaded for testing

## Loading seed data
By default when the functions start script runs it will call a script to populate seed data from [scripts/emulator/seed-data](../../../../scripts/emulator/seed-data). There are different versions depending on export date and operating system 
(known issue where data exported on windows won't always run on linux, pending possible fix via node 14 update or firebase exporter bin)
```
yarn workspace oa-scripts emulator:seed
```

This will load the default seed data from the zip file [functions/data/seed](../../../../functions/data/seed/seed-default.zip).

The default data contains a snapshot of most howtos, mappins etc. from the export data of the file (so may not be fully up-to-date). It also includes 2 user profiles for login:

```
username: demo_user@example.com
password: demo_user
```

```
username: demo_admin@example.com
password: demo_admin
```

If you need newer or other data sources contact the repo admins who can hopefully help out.

The fully seeded database should look something like this:

![Seeded DB](./images/firebase-emulator-seeded.png)

## Resetting seed data

When the emulators close they discard any changes made, so seed data documents that have been updated will revert to their original state next time the emulator is loaded.

If manually exported data has been copied to overwrite the seed data, the default seed can be restored using the load script above.

## Updating seed data

From time to time it might be useful to update the seed data, for example to add the latest howtos, mappins etc. to the emulator. This is a task that will usually be carried out by a core admin, as it requires access to production project storage buckets and firebase admin.

:::caution   
Due to filepath handling this is usually best done on a mac/linux device (windows export formattedly inconsistently for linux).

The easiest way to manage this on windows is to use the [Remote - WSL](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-wsl) extension to re-open this repo in a linux subsystem.
However, this may not work if using wsl2, see troubleshooting issue in [Running Emulators](./running-emulators)
:::caution

**Generate a backup**  
The first step in export is to generate a new backup of the production site and populating to the `functions/data/emulated` folder. Steps to create and export a manual backup are describe in [Manual Backups](../Server%20Maintenance/manual-backups.md)

**Test locally**   
This data should be shown the next time the emulators are restarted. Check that data appears as expected when running the platform locally, e.g. via `npm run start:emulated`

**Clean data**   
The default export will contain data for all users as well as various bits or archived or legacy content. There is a dev script currently set up to clean the data and produce a more minimal working set. It also handles creation of the demo users for local development, and can be called by sending a `POST` request to the api endpoint
```
http://localhost:4002/emulator-demo/us-central1/dev/seed-clean-data
```

**Export as seed data**

This can be achieved by passing the `--export-on-exit=./path/to/export/folder` flag to the script that starts the functions emulators. This can be run by modifiying the functions start at [functions/scripts/start.ts](../../../../functions/scripts/start.ts)

```js
// change this value if also wanting to export data
EXPORT_ON_EXIT=false
```
Alternatively this can be done as a one-liner from the command
```sh
sudo firebase --project emulator-demo emulators:start --import=functions/data/emulated --export-on-exit=functions/data/exported
```
This will populate the working data to the `functions/data/emulated`, from where it can be zipped and used to replace the `seed-default.zip` file or added as an additional data source. A script is included to produce the zip file as default zip utilities may throw errors if contents contain empty folders 
```
yarn workspace oa-scripts emulator:generate:zip
```