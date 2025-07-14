alter table "public"."news" add column "is_draft" boolean not null default false;

alter table "public"."questions" add column "is_draft" boolean not null default false;
