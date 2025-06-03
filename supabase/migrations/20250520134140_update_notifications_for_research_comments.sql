alter table "public"."notifications" rename column "parent_content_id" to "parent_comment_id";

alter table "public"."notifications" add column "parent_content_id" bigint;

alter table "public"."notifications" alter column "source_content_type" set data type text using "source_content_type"::text;

alter table "public"."subscribers" alter column "content_type" set data type text using "content_type"::text;

