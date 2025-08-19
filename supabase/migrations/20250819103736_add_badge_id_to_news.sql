alter table "public"."news" add column "profile_badge" bigint;

alter table "public"."news" add constraint "news_profile_badge_fkey" FOREIGN KEY (profile_badge) REFERENCES profile_badges(id) ON DELETE SET NULL not valid;

alter table "public"."news" validate constraint "news_profile_badge_fkey";

