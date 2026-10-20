REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON ALL TABLES IN SCHEMA "public" FROM "anon";
REVOKE ALL ON ALL SEQUENCES IN SCHEMA "public" FROM "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON TABLES FROM "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" REVOKE ALL ON SEQUENCES FROM "anon";

GRANT INSERT ON TABLE "public"."profiles" TO "anon";
GRANT UPDATE ("total_views") ON TABLE "public"."profiles" TO "anon";
GRANT UPDATE ("total_views") ON TABLE "public"."projects" TO "anon";
GRANT UPDATE ("total_views") ON TABLE "public"."news" TO "anon";
GRANT UPDATE ("total_views") ON TABLE "public"."questions" TO "anon";
GRANT UPDATE ("total_views") ON TABLE "public"."research" TO "anon";
GRANT INSERT ON TABLE "public"."organisation_applications" TO "anon";
GRANT INSERT, UPDATE ON TABLE "public"."notifications_preferences" TO "anon";

REVOKE EXECUTE ON FUNCTION "public"."read_secret"("text") FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION "public"."get_user_email_by_id"("uuid") FROM PUBLIC, "anon";
REVOKE EXECUTE ON FUNCTION "public"."get_user_email_by_profile_id"(bigint) FROM PUBLIC, "anon";
REVOKE EXECUTE ON FUNCTION "public"."get_user_email_by_username"("text") FROM PUBLIC, "anon";
REVOKE EXECUTE ON FUNCTION "public"."get_profiles_with_any_badge"("text") FROM PUBLIC, "anon";
REVOKE EXECUTE ON FUNCTION "public"."get_profiles_by_badge_ids"(bigint[], "text") FROM PUBLIC, "anon";
REVOKE EXECUTE ON FUNCTION "public"."get_staff_profiles"("text") FROM PUBLIC, "anon";
REVOKE EXECUTE ON FUNCTION "public"."get_subscribed_users_emails_to_notify"(bigint, "text") FROM PUBLIC, "anon";
REVOKE EXECUTE ON FUNCTION "public"."get_supporters"("text") FROM PUBLIC, "anon";

CREATE OR REPLACE FUNCTION "public"."protect_profile_roles"()
    RETURNS trigger
    LANGUAGE "plpgsql"
    SET search_path = public, pg_temp
    AS $$
BEGIN
  IF current_user IN ('anon', 'authenticated') AND (
    (TG_OP = 'INSERT' AND coalesce(cardinality(NEW.roles), 0) > 0)
    OR (TG_OP = 'UPDATE' AND NEW.roles IS DISTINCT FROM OLD.roles)
  ) THEN
    RAISE EXCEPTION 'profiles.roles is read-only' USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER "protect_profile_roles" BEFORE INSERT OR UPDATE ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."protect_profile_roles"();
