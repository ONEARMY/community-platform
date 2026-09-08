alter table "public"."news" add column "content" jsonb;
alter table "public"."news" add column "content_search_text" text;
alter table "public"."news" add column "content_fts" tsvector generated always as (to_tsvector('english'::regconfig, (((COALESCE(title, ''::text) || ' '::text) || COALESCE(content_search_text, ''::text)) || (' '::text || COALESCE(summary, ''::text))))) stored;

CREATE INDEX news_content_fts_idx ON public.news USING gin (content_fts);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_news_feed_by_content(p_user_profile_id bigint DEFAULT NULL::bigint, p_is_admin boolean DEFAULT false, p_search text DEFAULT NULL::text, p_sort text DEFAULT 'Newest'::text, p_skip integer DEFAULT 0, p_limit integer DEFAULT 20)
 RETURNS TABLE(id bigint, created_at timestamp with time zone, created_by bigint, modified_at timestamp with time zone, published_at timestamp with time zone, is_draft boolean, comment_count bigint, content jsonb, content_search_text text, slug text, summary text, tags bigint[], title text, total_views bigint, hero_image json, content_reach public.content_reach, profile_badges json, total_count bigint)
 LANGUAGE sql
 STABLE
 SET search_path TO 'public', 'pg_temp'
AS $function$
  SELECT
    n.id,
    n.created_at,
    n.created_by,
    n.modified_at,
    n.published_at,
    n.is_draft,
    n.comment_count,
    n.content,
    n.content_search_text,
    n.slug,
    n.summary,
    n.tags,
    n.title,
    n.total_views,
    n.hero_image,
    n.content_reach,
    (
      SELECT COALESCE(
        json_agg(json_build_object('profile_badges', row_to_json(pb))),
        '[]'::json
      )
      FROM news_badges_relations nbr
      JOIN profile_badges pb ON pb.id = nbr.profile_badge_id
      WHERE nbr.news_id = n.id
    ) AS profile_badges,
    COUNT(*) OVER () AS total_count
  FROM news n
  WHERE
    n.is_draft = false
    AND (n.deleted IS NULL OR n.deleted = FALSE)
    AND (
      p_is_admin
      OR NOT EXISTS (
        -- news has ANY badge restriction
        SELECT 1 FROM news_badges_relations nbr
        WHERE nbr.news_id = n.id
      )
      OR (
        -- news has badge restrictions AND user has at least one matching badge
        p_user_profile_id IS NOT NULL
        AND EXISTS (
          SELECT 1
          FROM news_badges_relations nbr
          JOIN profile_badges_relations pbr
            ON pbr.profile_badge_id = nbr.profile_badge_id
          WHERE nbr.news_id = n.id
            AND pbr.profile_id = p_user_profile_id
        )
      )
    )
    AND (
      p_search IS NULL
      OR n.content_fts @@ plainto_tsquery('english', p_search)
    )
  ORDER BY
    CASE WHEN p_sort = 'Newest'       THEN n.published_at   END DESC NULLS LAST,
    CASE WHEN p_sort = 'Comments'     THEN n.comment_count  END DESC NULLS LAST,
    CASE WHEN p_sort = 'LeastComments' THEN n.comment_count END ASC  NULLS LAST,
    n.published_at DESC  -- stable tiebreaker
  LIMIT p_limit
  OFFSET p_skip;
$function$
;
