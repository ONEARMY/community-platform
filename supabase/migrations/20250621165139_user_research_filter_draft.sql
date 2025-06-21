CREATE OR REPLACE FUNCTION public.get_user_research(username_param text)
 RETURNS TABLE(id bigint, title text, slug text, total_useful bigint)
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    r.id,
    r.title,
    r.slug,
    COALESCE(COUNT(uv.id), 0)::BIGINT AS total_useful
  FROM research r
  INNER JOIN profiles p ON p.id = r.created_by
  LEFT JOIN useful_votes uv ON uv.content_id = r.id AND uv.content_type = 'research'
  WHERE p.username = username_param
  AND (r.deleted IS NULL OR r.deleted = FALSE)
  AND (r.is_draft IS NULL OR r.is_draft = FALSE)
  GROUP BY r.id, r.title, r.slug;
END;
$function$
;
