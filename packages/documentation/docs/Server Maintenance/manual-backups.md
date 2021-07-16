---
id: manualBackups
title: Manual Backups
---

In order to fully backup the platform there are 3 areas that need to be backed up:

1. Firestore Database
   https://console.cloud.google.com/firestore/import-export?project=onearmyworld

   Use in interactive export tool to create a backup of the database. If the data is simply for re-importing later the entire database can be selected. If only some specific data collections are likely to be imported, or tools like bigquery will be used to analyse the exported data then individual collections should be specified (e.g. `v3_howtos`)

   ![](images/firestore-backup-1.png)

   The backup can be made to the existing `onearmyworld-exports` bucket, or a personal storage bucket. Exports should be named in a consistent way, prefixed with a timestamp (`yyyy-mm-dd`)

   The backup can also be downloaded locally using the [gsutil](https://cloud.google.com/storage/docs/gsutil) tool

   ```
   gsutil cp -r gs://onearmyworld-exports/name-of-backup ./my-local-backup-folder
   ```

2. Firebase Storage
   This is a bucket in firebase cloud storage, and so can be handled in a similar way to the firestore database, via the gcloud console

   ![](images/firestore-backup-2.png)

   Additionally, files can be downloaded to backup locally or to another storage provider via [gsutil](https://cloud.google.com/storage/docs/gsutil) run from a local command line, e.g.

   ```
   gsutil cp -r \
   gs://onearmyworld.appspot.com/uploads \
   ./my-local-backup-folder
   ```

3. Firbase Auth Users  
   See documentation: https://firebase.google.com/docs/cli/auth

## Importing Data from a Backup

The same graphical interface can be used to import data. However care should be taken before importing in case of unintended side-effects.

Specifically firebase functions should first be disabled and data may need to first be deleted from the target project.

:::danger

If functions are triggered on database changes they will be triggered for every document that is imported
:::
:::caution
When importing a collection any existing data will be merged with the import.
:::

## Migrate/Clone

In order to migrate the data to another server similar steps must be taken and permissions

## Service worker

- activate required api: https://console.cloud.google.com/apis/api/cloudresourcemanager.googleapis.com
- creating
- permissions (easiest to assign as viewer for source, and datastore import/export target)
  - Source firestore - viewer
  - Target firestore - viewer, datastore import/export
  - Storage bucket - storage admin
  - Service Account User
- https://cloud.google.com/firestore/docs/security/iam#roles
- https://cloud.google.com/iam/docs/granting-changing-revoking-access
- - Check

```
gcloud projects list
```

```
gcloud auth list
```
