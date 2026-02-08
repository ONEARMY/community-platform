CREATE UNIQUE INDEX profiles_username_key ON public.profiles USING btree (username, tenant_id);

alter table "public"."profiles" add constraint "profiles_username_key" UNIQUE using index "profiles_username_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.is_username_available(username text)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
  SELECT NOT EXISTS (
    SELECT 1 FROM profiles
    WHERE username = $1
    AND tenant_id = ((SELECT current_setting('request.headers', true))::json ->> 'x-tenant-id')
  );
$function$
;
