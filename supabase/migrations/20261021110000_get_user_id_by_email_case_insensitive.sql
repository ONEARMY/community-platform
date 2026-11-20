CREATE OR REPLACE FUNCTION "public"."get_user_id_by_email"("email" "text") RETURNS TABLE("id" "uuid")
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'pg_temp'
    AS $_$BEGIN
  -- is_sso_user = false matches auth.users' partial index on email, avoiding a full table scan
  RETURN QUERY SELECT au.id FROM auth.users au WHERE au.email = lower($1) AND au.is_sso_user = false;
END;$_$;
