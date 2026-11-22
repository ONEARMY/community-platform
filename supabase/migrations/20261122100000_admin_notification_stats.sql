-- Aggregates for the admin Notifications dashboard. One round trip, computed in SQL so the
-- page never loads notification rows. Weeks start on Monday (UTC); the newest week is partial.
CREATE OR REPLACE FUNCTION "public"."get_admin_notification_stats"(
  "p_tenant_id" "text",
  "p_weeks" integer DEFAULT 12
)
    RETURNS jsonb
    LANGUAGE "sql"
    STABLE
    SECURITY DEFINER
    SET search_path = public, pg_temp
    AS $$
  SELECT jsonb_build_object(
    'total', (SELECT COUNT(*) FROM notifications WHERE tenant_id = p_tenant_id),
    'weekly', COALESCE((
      SELECT jsonb_agg(jsonb_build_object('week_start', w.week_start, 'total', COALESCE(c.total, 0)) ORDER BY w.week_start)
      FROM (
        SELECT generate_series(
          date_trunc('week', now() AT TIME ZONE 'utc') - make_interval(weeks => GREATEST(p_weeks, 1) - 1),
          date_trunc('week', now() AT TIME ZONE 'utc'),
          interval '1 week'
        )::date AS week_start
      ) w
      LEFT JOIN (
        SELECT date_trunc('week', created_at AT TIME ZONE 'utc')::date AS week_start, COUNT(*) AS total
        FROM notifications
        WHERE tenant_id = p_tenant_id
        GROUP BY 1
      ) c ON c.week_start = w.week_start
    ), '[]'::jsonb),
    'read', COALESCE((
      SELECT jsonb_agg(jsonb_build_object('is_read', is_read, 'total', total) ORDER BY is_read)
      FROM (
        SELECT COALESCE(is_read, false) AS is_read, COUNT(*) AS total
        FROM notifications
        WHERE tenant_id = p_tenant_id
        GROUP BY 1
      ) r
    ), '[]'::jsonb),
    'types', COALESCE((
      SELECT jsonb_agg(jsonb_build_object('action_type', action_type, 'content_type', content_type, 'total', total) ORDER BY total DESC, action_type, content_type)
      FROM (
        SELECT action_type, content_type, COUNT(*) AS total
        FROM notifications
        WHERE tenant_id = p_tenant_id
        GROUP BY 1, 2
      ) t
    ), '[]'::jsonb),
    'preferences', (
      SELECT jsonb_build_object(
        'total', COUNT(*),
        'comments', jsonb_build_object('enabled', COUNT(*) FILTER (WHERE comments), 'disabled', COUNT(*) FILTER (WHERE NOT comments)),
        'replies', jsonb_build_object('enabled', COUNT(*) FILTER (WHERE replies), 'disabled', COUNT(*) FILTER (WHERE NOT replies)),
        'research_updates', jsonb_build_object('enabled', COUNT(*) FILTER (WHERE research_updates), 'disabled', COUNT(*) FILTER (WHERE NOT research_updates)),
        'content_reach', jsonb_build_object('all', COUNT(*) FILTER (WHERE content_reach = 'all'), 'important', COUNT(*) FILTER (WHERE content_reach = 'important'), 'unset', COUNT(*) FILTER (WHERE content_reach IS NULL))
      )
      FROM notifications_preferences
      WHERE tenant_id = p_tenant_id
    ),
    'unsubscribed', (SELECT COUNT(*) FROM notifications_preferences WHERE tenant_id = p_tenant_id AND is_unsubscribed)
  );
$$;

REVOKE EXECUTE ON FUNCTION "public"."get_admin_notification_stats"("text", integer) FROM PUBLIC, "anon", "authenticated";
GRANT EXECUTE ON FUNCTION "public"."get_admin_notification_stats"("text", integer) TO "service_role";
