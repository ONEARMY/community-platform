CREATE INDEX notifications_content_id_idx ON public.notifications USING btree (content_id);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_admin_comments(p_limit integer, p_offset integer)
 RETURNS TABLE(id bigint, comment text, source_type text, source_id bigint, parent_id bigint, created_at timestamp with time zone, deleted boolean, username text, display_name text, notification_count bigint, source_slug text, total_count bigint)
 LANGUAGE plpgsql
 STABLE
 SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.comment,
    c.source_type,
    c.source_id,
    c.parent_id,
    c.created_at,
    c.deleted,
    p.username,
    p.display_name,
    (
      SELECT COUNT(*)
      FROM notifications n
      WHERE n.content_id = c.id
        AND n.content_type IN ('comments', 'comment', 'reply')
    ),
    COALESCE(pr.slug, q.slug, nw.slug, r.slug),
    c.total_count
  FROM (
    SELECT cm.*, COUNT(*) OVER () AS total_count
    FROM comments cm
    ORDER BY cm.created_at DESC, cm.id DESC
    LIMIT p_limit OFFSET p_offset
  ) c
  LEFT JOIN profiles p ON p.id = c.created_by
  LEFT JOIN projects pr ON c.source_type = 'projects' AND pr.id = c.source_id AND pr.deleted IS NOT TRUE
  LEFT JOIN questions q ON c.source_type = 'questions' AND q.id = c.source_id AND q.deleted IS NOT TRUE
  LEFT JOIN news nw ON c.source_type = 'news' AND nw.id = c.source_id AND nw.deleted IS NOT TRUE
  LEFT JOIN research_updates ru ON c.source_type = 'research_updates' AND ru.id = c.source_id AND ru.deleted IS NOT TRUE
  LEFT JOIN research r ON r.id = ru.research_id AND r.deleted IS NOT TRUE
  ORDER BY c.created_at DESC, c.id DESC;
END;
$function$
;
