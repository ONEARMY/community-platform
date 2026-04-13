alter table "public"."notifications" drop constraint "notifications_triggered_by_id_fkey";
alter table "public"."notifications" add constraint "notifications_triggered_by_id_fkey"
  FOREIGN KEY (triggered_by_id) REFERENCES profiles(id)
  ON UPDATE CASCADE ON DELETE SET NULL;

alter table "public"."notifications_preferences" drop constraint "notifications_preferences_user_id_fkey";
alter table "public"."notifications_preferences" add constraint "notifications_preferences_user_id_fkey"
  FOREIGN KEY (user_id) REFERENCES profiles(id)
  ON UPDATE CASCADE ON DELETE CASCADE;
