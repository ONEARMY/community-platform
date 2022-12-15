---
id: firestore-migration
title: Firestore Migration
---

One of the challenges with working with Firestore database is the lack of clear database schema and migration tooling to ensure data is consistent across collections.

As such we may find on occasion the need to peform bulk database updates or migration scripts. This is handled using custom firebase functions

## Create Migration

All migrations are defined in individual migration files, named in execution order so that one migration can be applied after another. Migrations should contain both an `Up` and a `Down` method which handle logic for migration and rollback respectively

E.g. `functions/src/migrations/migration/001-test-migration.ts`

```ts
  _id = '001-test-migration'

  async up() {
    return setDoc('migrations_test' as any, '001-test', { hello: 'example' })
  }

  async down() {
    return deleteDoc('migrations_test' as any, '001-test')
  }
```

## Run Migration

All migrations should be exported in the corresponding `functions\src\migrations\migration\index.ts` file.

Any exported migrations will automatically process in sequence on next functions deployment. Migrations already processed will skipped.

After execution the result of the migration will be stored into the `migrations` collection of the database, e.g.

```ts
{
  _id: '001-test'
  _processed: true
  _rollback: false
}
```

## Rollback Migration

Any migration should include `down` code that can be used to restore the database to its previous state.

To trigger the rollback simply toggle the `_rollback` field to `true`. This will apply the `down` method to revert changes as defined in the method.

```ts
{
  _id: '001-test'
  _processed: true
  _rollback: true
}
```

After a migration has been rolled back it will not be reprocessed if functions are redeployed. Instead a new migration should be created, or migration code updated and the database entry deleted

## Testing Locally

The best way to test migration code is to run in the [database emulator](firebase-emulators-docker.md). As of 2022-12 firebase does not automatically invoke the tasks system that is used to process migrations, however it can be manually called by sending a POST request to the generated function endpoint

This can be done either using a rest client such as [Insomnia](https://insomnia.rest/), or manually from the terminal

### OS/Linux

```sh
curl --request POST \
  --url http://127.0.0.1:4002/community-platform-emulated/us-central1/migrations-schedule \
  --header 'Content-Type: application/json' \
  --data '{
	"data":{}
}'
```

### Windows

```ps1
$headers=@{}
$headers.Add("Content-Type", "application/json")
$response = Invoke-WebRequest -Uri 'http://127.0.0.1:4002/community-platform-emulated/us-central1/migrations-schedule' -Method POST -Headers $headers -ContentType 'application/json' -Body '{
	"data":{}
}'
```
