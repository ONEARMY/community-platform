alter table "public"."notifications" alter column "action_type" set data type text using "action_type"::text;

drop type "public"."notification_action_types";


