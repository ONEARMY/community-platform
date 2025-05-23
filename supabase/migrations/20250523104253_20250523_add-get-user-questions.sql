CREATE OR REPLACE FUNCTION public.get_user_questions(username_param text)
 RETURNS TABLE(id bigint, title text, slug text, total_useful bigint)
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    q.id,
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


