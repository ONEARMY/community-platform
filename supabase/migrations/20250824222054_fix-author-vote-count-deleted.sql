set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_author_vote_counts(author_id bigint)
 RETURNS TABLE(content_type text, vote_count bigint)
 LANGUAGE sql
 STABLE
AS $function$
    SELECT 
        uv.content_type,
        COUNT(*) as vote_count
    FROM useful_votes uv
    WHERE (uv.content_type = 'questions' AND EXISTS (
        SELECT 1 FROM questions q WHERE q.id = uv.content_id AND q.created_by = author_id and (q.deleted is null or q.deleted = false)
    ))
    OR (uv.content_type = 'projects' AND EXISTS (
        SELECT 1 FROM projects p WHERE p.id = uv.content_id AND p.created_by = author_id and (p.deleted is null or p.deleted = false)
    ))
    OR (uv.content_type = 'news' AND EXISTS (
        SELECT 1 FROM news n WHERE n.id = uv.content_id AND n.created_by = author_id and (n.deleted is null or n.deleted = false)
    ))
    OR (uv.content_type = 'research' AND EXISTS (
        SELECT 1 FROM research r WHERE r.id = uv.content_id AND r.created_by = author_id and (r.deleted is null or r.deleted = false)
    ))
    GROUP BY uv.content_type
    ORDER BY vote_count DESC;
$function$
;
