set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_projects_count(search_query text DEFAULT NULL::text, category_id integer DEFAULT NULL::integer, current_username text DEFAULT NULL::text)
 RETURNS integer
 LANGUAGE plpgsql
 SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
  ts_query tsquery;
BEGIN
    IF search_query IS NOT NULL THEN
      ts_query := to_tsquery('english', search_query);
    END IF;

  RETURN (
    SELECT COUNT(*)
    FROM projects p
    INNER JOIN profiles prof ON prof.id = p.created_by
    WHERE
      (search_query IS NULL OR p.fts @@ to_tsquery('english', search_query)) AND
      (category_id IS NULL OR p.category = category_id) AND
      (p.is_draft IS NULL OR p.is_draft = FALSE) AND
      (p.deleted IS NULL OR p.deleted = FALSE) AND
      (p.moderation = 'accepted' OR prof.username = current_username)
  );
END;
$function$
;


