drop policy "tenant_isolation" on "public"."patreon_settings";

revoke delete on table "public"."patreon_settings" from "anon";

revoke insert on table "public"."patreon_settings" from "anon";

revoke references on table "public"."patreon_settings" from "anon";

revoke select on table "public"."patreon_settings" from "anon";

revoke trigger on table "public"."patreon_settings" from "anon";

revoke truncate on table "public"."patreon_settings" from "anon";

revoke update on table "public"."patreon_settings" from "anon";

revoke delete on table "public"."patreon_settings" from "authenticated";

revoke insert on table "public"."patreon_settings" from "authenticated";

revoke references on table "public"."patreon_settings" from "authenticated";

revoke select on table "public"."patreon_settings" from "authenticated";

revoke trigger on table "public"."patreon_settings" from "authenticated";

revoke truncate on table "public"."patreon_settings" from "authenticated";

revoke update on table "public"."patreon_settings" from "authenticated";

revoke delete on table "public"."patreon_settings" from "service_role";

revoke insert on table "public"."patreon_settings" from "service_role";

revoke references on table "public"."patreon_settings" from "service_role";

revoke select on table "public"."patreon_settings" from "service_role";

revoke trigger on table "public"."patreon_settings" from "service_role";

revoke truncate on table "public"."patreon_settings" from "service_role";

revoke update on table "public"."patreon_settings" from "service_role";

alter table "public"."patreon_settings" drop constraint "patreon_settings_pkey";

drop index if exists "public"."patreon_settings_pkey";

drop table "public"."patreon_settings";
