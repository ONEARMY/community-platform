drop function if exists "public"."is_username_available"(username text);

alter table "public"."profiles" alter column "username" drop default;

alter table "public"."profiles" alter column "username" drop not null;

UPDATE "public"."profiles" SET username = NULL WHERE username = '';

DROP INDEX IF EXISTS "public"."profiles_username_tenant_id_key";

CREATE UNIQUE INDEX profiles_username_tenant_id_key ON public.profiles USING btree (username, tenant_id) WHERE (username IS NOT NULL);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.is_username_available(username text, exclude_profile_id integer DEFAULT NULL::integer)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
  SELECT CASE WHEN $1 IS NULL THEN false
  ELSE NOT EXISTS (
    SELECT 1 FROM profiles
    WHERE LOWER(profiles.username) = LOWER($1)
      AND ($2 IS NULL OR profiles.id != $2)
      AND tenant_id = ((SELECT current_setting('request.headers', true))::json ->> 'x-tenant-id')
  ) END;
$function$
;
