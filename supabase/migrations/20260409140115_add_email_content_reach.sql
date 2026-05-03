CREATE TYPE "public"."content_reach" AS ENUM ('all', 'important');
ALTER TYPE "public"."content_reach" OWNER TO "postgres";

alter table "public"."news" add column "content_reach" "public"."content_reach";
alter table "public"."notifications_preferences" add column "content_reach" "public"."content_reach";
