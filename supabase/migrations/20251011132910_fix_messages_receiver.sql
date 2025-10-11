alter table "public"."messages" drop constraint "messages_from_fkey";

alter table "public"."messages" drop constraint "messages_sender_id_fkey";

alter table "public"."banners" drop constraint "banner_pkey";

alter table "public"."questions" drop constraint "question_pkey";

alter table "public"."research_updates" drop constraint "research_update_pkey";

drop index if exists "public"."banner_pkey";

drop index if exists "public"."question_pkey";

drop index if exists "public"."research_update_pkey";

alter type "public"."content_types" rename to "content_types__old_version_to_be_dropped";

create type "public"."content_types" as enum ('questions', 'projects', 'research', 'news', 'comments');

alter table "public"."categories" alter column type type "public"."content_types" using type::text::"public"."content_types";

drop type "public"."content_types__old_version_to_be_dropped";

alter table "public"."profiles" alter column "is_contactable" drop default;

CREATE UNIQUE INDEX banners_pkey ON public.banners USING btree (id);

CREATE UNIQUE INDEX questions_pkey ON public.questions USING btree (id);

CREATE UNIQUE INDEX research_updates_pkey ON public.research_updates USING btree (id);

alter table "public"."banners" add constraint "banners_pkey" PRIMARY KEY using index "banners_pkey";

alter table "public"."questions" add constraint "questions_pkey" PRIMARY KEY using index "questions_pkey";

alter table "public"."research_updates" add constraint "research_updates_pkey" PRIMARY KEY using index "research_updates_pkey";

alter table "public"."messages" add constraint "messages_receiver_fkey" FOREIGN KEY (receiver_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."messages" validate constraint "messages_receiver_fkey";

alter table "public"."messages" add constraint "messages_sender_fkey" FOREIGN KEY (sender_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."messages" validate constraint "messages_sender_fkey";


