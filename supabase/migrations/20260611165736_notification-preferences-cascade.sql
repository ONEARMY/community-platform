alter table "public"."notifications" drop constraint "notifications_owned_by_id_fkey";

alter table "public"."notifications_preferences" drop constraint "notifications_preferences_user_id_fkey";

alter table "public"."notifications" add constraint "notifications_owned_by_id_fkey" FOREIGN KEY (owned_by_id) REFERENCES public.profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."notifications" validate constraint "notifications_owned_by_id_fkey";

alter table "public"."notifications_preferences" add constraint "notifications_preferences_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."notifications_preferences" validate constraint "notifications_preferences_user_id_fkey";

drop function if exists "public"."get_profiles_by_badge"(p_badge_id bigint)