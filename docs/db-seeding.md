# Supabase seeding

This file describes how supabase seeding works.

## Snaplet

Snaplet is a tool used to seed mostly PostgresSQL databases. Read through their documentation to understand better how it works here: https://snaplet-seed.netlify.app/seed/getting-started/quick-start

To initialize snaplet:

```sh
npx @snaplet/seed init
```

To sync snaplet (essentially generate snaplet models and docs from `seed.config.ts`):

> Note: every time the config file is changed, this command has to be ran.

```sh
yarn db:reset
```

Or if you need to run the commands seperately:

```sh
npx supabase db reset
npx @snaplet/seed sync
npx tsx seed.ts > seed.sql
yarn format
```
