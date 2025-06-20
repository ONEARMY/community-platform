CREATE OR REPLACE FUNCTION public.get_user_projects(username_param text)
 RETURNS TABLE(id bigint, title text, slug text, total_useful bigint)
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    pr.id,
    pr.title,
    pr.slug,
    COALESCE(COUNT(uv.id), 0)::BIGINT AS total_useful
  FROM projects pr
  INNER JOIN profiles p ON p.id = pr.created_by
  LEFT JOIN useful_votes uv ON uv.content_id = pr.id AND uv.content_type = 'projects'
  WHERE p.username = username_param
  AND (pr.deleted IS NULL OR pr.deleted = FALSE)
  AND (pr.is_draft IS NULL OR pr.is_draft = FALSE)
  AND (pr.moderation = "accepted")
  GROUP BY pr.id, pr.title, pr.slug;
END;
$function$
;
