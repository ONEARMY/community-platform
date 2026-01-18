DROP FUNCTION public.get_user_projects(username_param text);
CREATE OR REPLACE FUNCTION public.get_user_projects(username_param text)
 RETURNS TABLE(id bigint, comment_count integer, cover_image json, title text, slug text, total_useful bigint)
 LANGUAGE plpgsql
 SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    pr.id,
    pr.comment_count,
    pr.cover_image,
    pr.title,
    pr.slug,
    COALESCE(COUNT(uv.id), 0)::BIGINT AS total_useful
  FROM projects pr
  INNER JOIN profiles p ON p.id = pr.created_by
  LEFT JOIN useful_votes uv ON uv.content_id = pr.id AND uv.content_type = 'projects'
  WHERE p.username = username_param
  AND (pr.deleted IS NULL OR pr.deleted = FALSE)
  AND (pr.is_draft IS NULL OR pr.is_draft = FALSE)
  AND (pr.moderation = 'accepted')
  GROUP BY pr.id, pr.title, pr.slug;
END;
$function$
;

DROP FUNCTION public.get_user_questions(username_param text);
CREATE OR REPLACE FUNCTION public.get_user_questions(username_param text)
 RETURNS TABLE(id bigint, comment_count bigint, images json[], title text, slug text, total_useful bigint)
 LANGUAGE plpgsql
 SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    q.id,
    q.comment_count,
    q.images,
    q.title,
    q.slug,
    COALESCE(COUNT(uv.id), 0)::BIGINT AS total_useful
  FROM questions q
  INNER JOIN profiles p ON p.id = q.created_by
  LEFT JOIN useful_votes uv ON uv.content_id = q.id AND uv.content_type = 'questions'
  WHERE p.username = username_param
  AND (q.deleted IS NULL OR q.deleted = FALSE)
  GROUP BY q.id, q.title, q.slug;
END;
$function$
;

DROP FUNCTION "public"."get_user_research"(username_param text);
CREATE OR REPLACE FUNCTION "public"."get_user_research"(username_param text) 
 RETURNS TABLE("id" bigint, image json, title text, slug text, total_useful bigint)
 LANGUAGE "plpgsql"
 SET search_path = public, pg_temp
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id,
    r.image,
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
$$;
