set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_projects(search_query text DEFAULT NULL::text, category_id bigint DEFAULT NULL::bigint, sort_by text DEFAULT 'Newest'::text, limit_val integer DEFAULT 12, offset_val integer DEFAULT 0, current_username text DEFAULT NULL::text)
 RETURNS TABLE(id bigint, created_at timestamp with time zone, created_by bigint, modified_at timestamp with time zone, description text, slug text, cover_image json, category json, tags text[], title text, moderation text, total_views bigint, author json, comment_count integer)
 LANGUAGE plpgsql
 SET search_path TO 'public', 'pg_temp'
AS $function$DECLARE
    ts_query tsquery;
BEGIN
    -- Parse search query once if provided
    IF search_query IS NOT NULL THEN
        ts_query := to_tsquery('english', search_query);
    END IF;

    RETURN QUERY
    SELECT
        p.id,
        p.created_at,
        p.created_by,
        p.modified_at,
        p.description,
        p.slug,
        p.cover_image,
        (SELECT json_build_object('id', c.id, 'name', c.name)
         FROM categories c
         WHERE c.id = p.category) AS category,
        p.tags,
        p.title,
        p.moderation,
        p.total_views,
        (SELECT json_build_object(
          'id', prof.id,
          'display_name', prof.display_name,
          'username', prof.username,
          'country', prof.country,
          'badges', COALESCE(
            (SELECT json_agg(
              json_build_object(
                'id', pb.id,
                'name', pb.name,
                'display_name', pb.display_name,
                'image_url', pb.image_url,
                'action_url', pb.action_url
                )
              )
              FROM profile_badges_relations pbr
              JOIN profile_badges pb ON pb.id = pbr.profile_badge_id
              WHERE pbr.profile_id = prof.id),
              '[]'::json
          )
        ) FROM profiles prof WHERE prof.id = p.created_by) AS author,
        p.comment_count
    FROM projects p
    JOIN profiles prof ON prof.id = p.created_by  -- Add explicit JOIN
    WHERE
        (search_query IS NULL OR
         p.fts @@ ts_query OR
         prof.username ILIKE '%' || search_query || '%'
        ) AND
        (category_id IS NULL OR p.category = category_id) AND
        (p.is_draft IS NULL OR p.is_draft = FALSE) AND
        (p.deleted IS NULL OR p.deleted = FALSE) AND
        (p.moderation = 'accepted' OR prof.username = current_username)
    ORDER BY
        -- Add relevance ranking when search query is provided
        CASE WHEN search_query IS NOT NULL THEN ts_rank_cd(p.fts, ts_query) END DESC NULLS LAST,
        CASE
            WHEN sort_by = 'Newest' THEN extract(epoch from p.created_at)
            WHEN sort_by = 'LatestUpdated' THEN extract(epoch from p.modified_at)
            WHEN sort_by = 'MostComments' THEN p.comment_count
            WHEN sort_by = 'MostDownloads' THEN p.file_download_count
            WHEN sort_by = 'MostUseful' THEN
                (SELECT COALESCE(COUNT(uv.id), 0)
                 FROM useful_votes uv
                 WHERE uv.content_id = p.id AND uv.content_type = 'projects')
            WHEN sort_by = 'MostViews' THEN p.total_views
            ELSE 0
        END DESC NULLS LAST,
        CASE
            WHEN sort_by = 'LeastComments' THEN p.comment_count
        END ASC NULLS LAST,
        p.created_at DESC
    LIMIT limit_val OFFSET offset_val;
END;$function$
;
