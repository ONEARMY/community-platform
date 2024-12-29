create type "public"."content_types" as enum ('questions', 'projects', 'research');

create table "public"."subscribers" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text),
    "user_id" bigint not null,
    "content_id" bigint not null,
    "content_type" content_types not null,
    "tenant_id" text not null
);


alter table "public"."subscribers" enable row level security;

create table "public"."tags" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "name" text not null,
    "tenant_id" text not null
);


alter table "public"."tags" enable row level security;

create table "public"."useful_votes" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "content_id" bigint not null,
    "content_type" content_types not null,
    "user_id" bigint not null,
    "tenant_id" text not null
);


alter table "public"."useful_votes" enable row level security;

alter table "public"."categories" add column "type" content_types;

alter table "public"."profiles" add column "impact" json;

alter table "public"."profiles" add column "is_blocked_from_messaging" boolean;

alter table "public"."profiles" add column "is_contactable" boolean;

alter table "public"."profiles" add column "is_supporter" boolean;

alter table "public"."profiles" add column "links" json;

alter table "public"."profiles" add column "location" json;

alter table "public"."profiles" add column "notification_settings" json;

alter table "public"."profiles" add column "patreon" json;

alter table "public"."profiles" add column "tags" text[];

alter table "public"."profiles" add column "total_useful" integer;

alter table "public"."profiles" add column "total_views" integer;

alter table "public"."profiles" add column "type" text;

alter table "public"."questions" add column "images" json[];

CREATE INDEX comments_created_by_idx ON public.comments USING btree (created_by);

CREATE INDEX questions_category_idx ON public.questions USING btree (category);

CREATE INDEX questions_created_by_idx ON public.questions USING btree (created_by);

CREATE UNIQUE INDEX subscribers_pkey ON public.subscribers USING btree (id);

CREATE UNIQUE INDEX tags_pkey ON public.tags USING btree (id);

CREATE UNIQUE INDEX useful_votes_pkey ON public.useful_votes USING btree (id);

alter table "public"."subscribers" add constraint "subscribers_pkey" PRIMARY KEY using index "subscribers_pkey";

alter table "public"."tags" add constraint "tags_pkey" PRIMARY KEY using index "tags_pkey";

alter table "public"."useful_votes" add constraint "useful_votes_pkey" PRIMARY KEY using index "useful_votes_pkey";

alter table "public"."subscribers" add constraint "subscribers_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."subscribers" validate constraint "subscribers_user_id_fkey";

alter table "public"."useful_votes" add constraint "useful_votes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."useful_votes" validate constraint "useful_votes_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.questions_search_fields(questions)
 RETURNS text
 LANGUAGE sql
AS $function$
  SELECT $1.title || ' ' || $1.description;
$function$
;

grant delete on table "public"."subscribers" to "anon";

grant insert on table "public"."subscribers" to "anon";

grant references on table "public"."subscribers" to "anon";

grant select on table "public"."subscribers" to "anon";

grant trigger on table "public"."subscribers" to "anon";

grant truncate on table "public"."subscribers" to "anon";

grant update on table "public"."subscribers" to "anon";

grant delete on table "public"."subscribers" to "authenticated";

grant insert on table "public"."subscribers" to "authenticated";

grant references on table "public"."subscribers" to "authenticated";

grant select on table "public"."subscribers" to "authenticated";

grant trigger on table "public"."subscribers" to "authenticated";

grant truncate on table "public"."subscribers" to "authenticated";

grant update on table "public"."subscribers" to "authenticated";

grant delete on table "public"."subscribers" to "service_role";

grant insert on table "public"."subscribers" to "service_role";

grant references on table "public"."subscribers" to "service_role";

grant select on table "public"."subscribers" to "service_role";

grant trigger on table "public"."subscribers" to "service_role";

grant truncate on table "public"."subscribers" to "service_role";

grant update on table "public"."subscribers" to "service_role";

grant delete on table "public"."tags" to "anon";

grant insert on table "public"."tags" to "anon";

grant references on table "public"."tags" to "anon";

grant select on table "public"."tags" to "anon";

grant trigger on table "public"."tags" to "anon";

grant truncate on table "public"."tags" to "anon";

grant update on table "public"."tags" to "anon";

grant delete on table "public"."tags" to "authenticated";

grant insert on table "public"."tags" to "authenticated";

grant references on table "public"."tags" to "authenticated";

grant select on table "public"."tags" to "authenticated";

grant trigger on table "public"."tags" to "authenticated";

grant truncate on table "public"."tags" to "authenticated";

grant update on table "public"."tags" to "authenticated";

grant delete on table "public"."tags" to "service_role";

grant insert on table "public"."tags" to "service_role";

grant references on table "public"."tags" to "service_role";

grant select on table "public"."tags" to "service_role";

grant trigger on table "public"."tags" to "service_role";

grant truncate on table "public"."tags" to "service_role";

grant update on table "public"."tags" to "service_role";

grant delete on table "public"."useful_votes" to "anon";

grant insert on table "public"."useful_votes" to "anon";

grant references on table "public"."useful_votes" to "anon";

grant select on table "public"."useful_votes" to "anon";

grant trigger on table "public"."useful_votes" to "anon";

grant truncate on table "public"."useful_votes" to "anon";

grant update on table "public"."useful_votes" to "anon";

grant delete on table "public"."useful_votes" to "authenticated";

grant insert on table "public"."useful_votes" to "authenticated";

grant references on table "public"."useful_votes" to "authenticated";

grant select on table "public"."useful_votes" to "authenticated";

grant trigger on table "public"."useful_votes" to "authenticated";

grant truncate on table "public"."useful_votes" to "authenticated";

grant update on table "public"."useful_votes" to "authenticated";

grant delete on table "public"."useful_votes" to "service_role";

grant insert on table "public"."useful_votes" to "service_role";

grant references on table "public"."useful_votes" to "service_role";

grant select on table "public"."useful_votes" to "service_role";

grant trigger on table "public"."useful_votes" to "service_role";

grant truncate on table "public"."useful_votes" to "service_role";

grant update on table "public"."useful_votes" to "service_role";

create policy "tenant_isolation"
on "public"."subscribers"
as permissive
for all
to public
using ((tenant_id = ((current_setting('request.headers'::text, true))::json ->> 'x-tenant-id'::text)));


create policy "tenant_isolation"
on "public"."tags"
as permissive
for all
to public
using ((tenant_id = ((current_setting('request.headers'::text, true))::json ->> 'x-tenant-id'::text)));


create policy "tenant_isolation"
on "public"."useful_votes"
as permissive
for all
to public
using ((tenant_id = ((current_setting('request.headers'::text, true))::json ->> 'x-tenant-id'::text)));


