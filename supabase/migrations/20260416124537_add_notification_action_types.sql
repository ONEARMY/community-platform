alter table "public"."news" alter column "body" set not null;

create type "public"."notification_action_types" as enum ('newComment', 'newContent', 'newReply', 'newNews');

alter table "public"."notifications" alter column "action_type" set data type public.notification_action_types using "action_type"::public.notification_action_types;
