alter table "public"."news" drop column "fts";

alter table "public"."news" add column "summary" text;

alter table "public"."news" add column "fts" tsvector generated always as (to_tsvector('english'::regconfig, ((title || ' '::text) || body || (summary || ''::text)))) stored;

