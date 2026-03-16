CREATE TYPE "public"."content_types" AS ENUM (
    'questions',
    'projects',
    'research',
    'news',
    'comments'
);

CREATE OR REPLACE FUNCTION "public"."get_user_email_by_id"("id" "uuid") RETURNS TABLE("email" character varying)
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET search_path = public, pg_temp
    AS $_$
BEGIN
  RETURN QUERY SELECT au.email FROM auth.users au WHERE au.id = $1;
END;
$_$;

CREATE OR REPLACE FUNCTION "public"."get_user_email_by_profile_id"("id" bigint) RETURNS TABLE("email" character varying)
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET search_path = public, pg_temp
    AS $_$
BEGIN
  RETURN QUERY SELECT au.email FROM auth.users au inner join public.profiles p on au.id = p.auth_id WHERE p.id = $1;
END;
$_$;

CREATE OR REPLACE FUNCTION "public"."get_user_email_by_username"("username" "text") RETURNS TABLE("email" character varying)
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET search_path = public, pg_temp
    AS $_$
BEGIN
  RETURN QUERY SELECT au.email FROM auth.users au WHERE au.raw_user_meta_data->>'username' = $1;
END;
$_$;

CREATE OR REPLACE FUNCTION "public"."get_user_id_by_email"("email" "text") RETURNS TABLE("id" "uuid")
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET search_path = public, pg_temp
    AS $_$BEGIN
  RETURN QUERY SELECT au.id FROM auth.users au WHERE au.email = $1;
END;$_$;
