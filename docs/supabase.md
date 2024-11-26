### What is Supabase?

Supabase is an open source Firebase alternative, based on Postgres.

## Getting Started

To install the supabase locally, follow https://supabase.com/docs/guides/local-development/cli/getting-started?queryGroups=platform&platform=windows
Installing as a dev dependency doesn't always work well, so it is recommended to install for your OS.

Install Docker Desktop.
Make sure you have the docker app open.

Run `supabase start` (Ensure you run it on the project folder root.)

## Migrations

After making schema changes, use the this command to create a migration file:
`supabase db diff --file [migration_name]`

## Technical Decisions

# Multi-tenant

Multi-tenancy is a requirement because:

- Single login for all websites.
- Easier maintenence and migrations.

With supabase there are a few ways we can do multi-tenancy:

1. Have Multiple projects
2. Have a Single project with multiple schemas
3. Have a Single project, with 1 common schema, using RLS (Row Level Security) to ensure data separation

Decision: 3. Why?

- A single project is easier to manage and deploy
- Same for a single common schema... and multiple schemas wouldn't give any security benefits
- With RLS, we can ensure, based on a Environment Variable, only the respective rows of that tenant are queried.

How?

- Each table has a tenant_id column
- On each request, to supabase (via it's sdk) we pass a header 'x-tenant-id' with the process.env.TENANT_ID variable, which is set for each app, via Fly.io secret.

# Comment Counts

Currently we can sort questions/research/howtos by the number of comments.
With supabase there are a few ways we can do this:

1. A comment count view
2. A comment count materialized view
3. Triggers, where the main table has a comment_count column which is updated when a comment is inserted/deleted

Decision: 3. Why?

- A simple view isn't performant, would be querying for the total on each query.
- A materialized view keeps state and is simple enough to update it, but doesn't support RLS. (Would be a better contender if it supported RLS)

How?

- Whenever a comment is created or deleted, it triggers the update_comment_count function.
- The function checks the Operation kind (Insert/Delete), the source_type and source_id.
- Fron the source_type it will update the according content total (howtos, research, questions) that matches the source_id

# Local firebase sync testing/debugging

We can create and deploy the sync function to the firebase dev environment.
Then, using ngrok, expose our local supabase url to the internet, and point the firebase function to it.
(ngrok http http://127.0.0.1:54321)

To authenticate, we need to create these 3 secrets, for each firebase project:
firebase functions:secrets:set SUPABASE_API_URL
firebase functions:secrets:set SUPABASE_API_KEY
firebase functions:secrets:set TENANT_ID
