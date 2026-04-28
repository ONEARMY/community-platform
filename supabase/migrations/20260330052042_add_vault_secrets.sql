create extension if not exists "supabase_vault" with schema "vault";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.read_secret(secret_name text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
  secret_value text;
BEGIN
  SELECT decrypted_secret INTO secret_value
  FROM vault.decrypted_secrets
  WHERE name = secret_name
  LIMIT 1;

  RETURN secret_value;
END;
$function$;

REVOKE EXECUTE ON FUNCTION "public"."read_secret"("text") FROM "anon";
REVOKE EXECUTE ON FUNCTION "public"."read_secret"("text") FROM "authenticated";
