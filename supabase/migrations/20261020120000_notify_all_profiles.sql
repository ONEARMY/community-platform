CREATE OR REPLACE FUNCTION "public"."notify_all_profiles"(
  "p_tenant_id" "text",
  "p_action_type" "public"."notification_action_types",
  "p_content_type" "public"."notification_content_types",
  "p_content_id" bigint,
  "p_title" "text",
  "p_triggered_by_id" bigint
)
    RETURNS void
    LANGUAGE "sql"
    SET search_path = public, pg_temp
    AS $$
  INSERT INTO notifications (action_type, content_type, content_id, title, triggered_by_id, owned_by_id, is_read, tenant_id)
  SELECT p_action_type, p_content_type, p_content_id, p_title, p_triggered_by_id, p.id, false, p_tenant_id
  FROM profiles p
  WHERE p.tenant_id = p_tenant_id;
$$;

REVOKE EXECUTE ON FUNCTION "public"."notify_all_profiles"("text", "public"."notification_action_types", "public"."notification_content_types", bigint, "text", bigint) FROM PUBLIC, "anon";
