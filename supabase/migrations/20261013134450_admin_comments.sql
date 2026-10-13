CREATE FUNCTION public.get_admin_comments(p_page bigint DEFAULT 1, p_page_size integer DEFAULT 20) RETURNS jsonb
    LANGUAGE plpgsql STABLE SECURITY INVOKER
    SET search_path TO 'public', 'pg_temp'
    AS $$
DECLARE
  request_tenant_id text := current_setting('request.headers', true)::json ->> 'x-tenant-id';
  page_size integer := LEAST(GREATEST(COALESCE(p_page_size, 20), 1), 100);
  page_number bigint;
  total_pages bigint;
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM profiles
    WHERE auth_id = auth.uid()
      AND tenant_id = request_tenant_id
      AND roles @> ARRAY['admin']::text[]
  ) THEN
    RAISE EXCEPTION 'Admin access required' USING ERRCODE = '42501';
  END IF;

  SELECT GREATEST(1, (COUNT(*) + page_size - 1) / page_size)
  INTO total_pages
  FROM comments
  WHERE tenant_id = request_tenant_id;

  page_number := LEAST(GREATEST(COALESCE(p_page, 1), 1), total_pages);

  RETURN jsonb_build_object(
    'page', page_number,
    'total_pages', total_pages,
    'comments', COALESCE((
      SELECT jsonb_agg(to_jsonb(comment_row) ORDER BY comment_row.created_at DESC, comment_row.id DESC)
      FROM (
        SELECT
          c.id,
          c.comment,
          c.source_type,
          c.source_id,
          c.parent_id,
          c.created_at,
          c.deleted,
          CASE WHEN p.id IS NOT NULL THEN
            jsonb_build_object('username', p.username, 'display_name', p.display_name)
          END AS profile,
          (
            SELECT COUNT(*)
            FROM notifications n
            WHERE n.tenant_id = c.tenant_id
              AND n.content_id = c.id
              AND n.content_type::text IN ('comments', 'comment', 'reply')
          ) AS notification_count,
          CASE WHEN c.deleted IS NOT TRUE AND (
            c.parent_id IS NULL OR (
              parent.id IS NOT NULL
              AND parent.parent_id IS NULL
              AND parent.source_id = c.source_id
              AND parent.source_type = c.source_type
            )
          ) THEN
            CASE c.source_type
              WHEN 'projects' THEN '/library/' || project.slug
              WHEN 'questions' THEN '/questions/' || question.slug
              WHEN 'news' THEN '/news/' || news.slug
              WHEN 'research_updates' THEN '/research/' || research.slug || '?update_' || research_update.id
            END || '#comment:' || c.id
          END AS live_url
        FROM (
          SELECT *
          FROM comments
          WHERE tenant_id = request_tenant_id
          ORDER BY created_at DESC, id DESC
          LIMIT page_size
          OFFSET (page_number - 1) * page_size
        ) c
        LEFT JOIN profiles p ON p.id = c.created_by AND p.tenant_id = c.tenant_id
        LEFT JOIN comments parent ON parent.id = c.parent_id AND parent.tenant_id = c.tenant_id
        LEFT JOIN projects project ON c.source_type = 'projects'
          AND project.id = c.source_id AND project.tenant_id = c.tenant_id
          AND project.deleted IS NOT TRUE
        LEFT JOIN questions question ON c.source_type = 'questions'
          AND question.id = c.source_id AND question.tenant_id = c.tenant_id
          AND question.deleted IS NOT TRUE
        LEFT JOIN news ON c.source_type = 'news'
          AND news.id = c.source_id AND news.tenant_id = c.tenant_id
          AND news.deleted IS NOT TRUE
        LEFT JOIN research_updates research_update ON c.source_type = 'research_updates'
          AND research_update.id = c.source_id AND research_update.tenant_id = c.tenant_id
          AND research_update.deleted IS NOT TRUE AND research_update.is_draft IS NOT TRUE
        LEFT JOIN research ON research.id = research_update.research_id
          AND research.tenant_id = c.tenant_id AND research.deleted IS NOT TRUE
      ) comment_row
    ), '[]'::jsonb)
  );
END;
$$;


CREATE INDEX comments_tenant_created_at_id_idx ON public.comments USING btree (tenant_id, created_at DESC, id DESC);

CREATE INDEX notifications_tenant_content_idx ON public.notifications USING btree (tenant_id, content_id);

REVOKE EXECUTE ON FUNCTION public.get_admin_comments(bigint, integer) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.get_admin_comments(bigint, integer) TO authenticated;
