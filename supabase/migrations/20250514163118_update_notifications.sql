alter table "public"."notifications" add column "parent_content_id" bigint;

alter table "public"."notifications" alter column "source_content_id" drop not null;

alter table "public"."notifications" alter column "source_content_type" drop not null;


