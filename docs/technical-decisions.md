# Technical Decisions

## Multi-tenant

Multi-tenancy is a requirement because:

- Single login for all websites.
- Easier maintenance and migrations.

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

## Comment Counts

Currently we can sort questions/research/library by the number of comments.
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
- From the source_type it will update the according content total (library, research, questions) that matches the source_id

## Research Search

Research is composed by:

1. research main item
2. research updates

When searching for `research`, we want to search both the main item and its updates.
To search using postgres textSearch, all info needs to be stored in a vector column.
If updates were stored in the main research item as json, it would be straightforward to index.
Having updates being stored in their own table is beneficial:

- easier CRUD
- enforcing a schema ensures data integrity and structure compared to json
- easier to extract metrics

The solution is to have a `tsvector` column that also contains update data which comes from the `research_updates` table.
To build the column data, a `combined_research_search_fields(research_id)` is used to combine all data (main + updates).
To automate indexing from `research_update` an INSERT/UPDATE trigger is needed.

## Local firebase sync testing/debugging

_This is temporary until we fully migrate to supabase!_
We can create and deploy the sync function to the firebase dev environment.
Then, using ngrok, expose our local supabase url to the internet, and point the firebase function to it.
(ngrok http http://127.0.0.1:54321)

To authenticate, we need to create these 3 secrets, for each firebase project:
firebase functions:secrets:set SUPABASE_API_URL
firebase functions:secrets:set SUPABASE_API_KEY
firebase functions:secrets:set TENANT_ID
(Check values with firebase functions:secrets:access SECRET_NAME)
