alter table "public"."profiles" alter column "username" drop default;

alter table "public"."profiles" alter column "username" drop not null;

CREATE UNIQUE INDEX profiles_username_key ON public.profiles USING btree (username, tenant_id) WHERE (username IS NOT NULL);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.is_username_available(username text)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
  SELECT CASE WHEN $1 IS NULL THEN false
  ELSE NOT EXISTS (
    SELECT 1 FROM profiles
    WHERE username = $1
    AND tenant_id = ((SELECT current_setting('request.headers', true))::json ->> 'x-tenant-id')
  ) END;
$function$
;
