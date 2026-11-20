drop function if exists "public"."get_news_feed"(p_user_profile_id bigint, p_is_admin boolean, p_search text, p_sort text, p_skip integer, p_limit integer);

drop function if exists "public"."get_news_feed_by_content"(p_user_profile_id bigint, p_is_admin boolean, p_search text, p_sort text, p_skip integer, p_limit integer);

alter table "public"."profile_badges" add column "action_label" text;

alter table "public"."profile_badges" add column "available_to" text;

alter table "public"."profile_badges" add column "grants_badge_id" bigint;

alter table "public"."profile_badges" add column "is_audience" boolean not null default true;

alter table "public"."profile_badges" add constraint "profile_badges_audience_fields_check" CHECK ((is_audience OR ((available_to IS NULL) AND (action_label IS NULL)))) not valid;

alter table "public"."profile_badges" validate constraint "profile_badges_audience_fields_check";

alter table "public"."profile_badges" add constraint "profile_badges_available_to_check" CHECK ((available_to = ANY (ARRAY['space'::text, 'non_space'::text, 'all'::text]))) not valid;

alter table "public"."profile_badges" validate constraint "profile_badges_available_to_check";

alter table "public"."profile_badges" add constraint "profile_badges_grants_badge_id_fkey" FOREIGN KEY (grants_badge_id) REFERENCES public.profile_badges(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."profile_badges" validate constraint "profile_badges_grants_badge_id_fkey";

alter table "public"."profile_badges" add constraint "profile_badges_grants_not_self_check" CHECK ((grants_badge_id <> id)) not valid;

alter table "public"."profile_badges" validate constraint "profile_badges_grants_not_self_check";

alter table "public"."profile_badges" add constraint "profile_badges_offer_fields_check" CHECK (((available_to IS NULL) OR ((COALESCE(action_label, ''::text) <> ''::text) AND (COALESCE(action_url, ''::text) <> ''::text)))) not valid;

alter table "public"."profile_badges" validate constraint "profile_badges_offer_fields_check";


set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_news_access(p_user_profile_id bigint DEFAULT NULL::bigint, p_is_admin boolean DEFAULT false, p_news_id bigint DEFAULT NULL::bigint)
 RETURNS TABLE(news_id bigint, is_readable boolean, cta_badge_id bigint)
 LANGUAGE sql
 STABLE
 SET search_path TO 'public', 'pg_temp'
AS $function$
  WITH RECURSIVE
  viewer AS (
    SELECT CASE WHEN bool_or(pt.is_space) THEN 'space' ELSE 'non_space' END AS kind
    FROM profiles p
    JOIN profile_types pt ON pt.id = p.profile_type
    WHERE p.id = p_user_profile_id
  ),
  held (badge_id) AS (
    SELECT pbr.profile_badge_id
    FROM profile_badges_relations pbr
    WHERE pbr.profile_id = p_user_profile_id
    UNION
    SELECT pb.grants_badge_id
    FROM held h
    JOIN profile_badges pb ON pb.id = h.badge_id
    WHERE pb.grants_badge_id IS NOT NULL
  ),
  offered (audience_id, badge_id) AS (
    SELECT pb.id, pb.id
    FROM profile_badges pb
    CROSS JOIN viewer v
    WHERE pb.available_to IN (v.kind, 'all')
    UNION
    SELECT o.audience_id, pb.grants_badge_id
    FROM offered o
    JOIN profile_badges pb ON pb.id = o.badge_id
    WHERE pb.grants_badge_id IS NOT NULL
  ),
  restricted AS (
    SELECT nbr.news_id, p_is_admin OR bool_or(h.badge_id IS NOT NULL) AS is_readable
    FROM news_badges_relations nbr
    LEFT JOIN held h ON h.badge_id = nbr.profile_badge_id
    WHERE p_news_id IS NULL OR nbr.news_id = p_news_id
    GROUP BY nbr.news_id
  ),
  cta AS (
    SELECT DISTINCT ON (nbr.news_id) nbr.news_id, o.audience_id
    FROM news_badges_relations nbr
    JOIN offered o ON o.badge_id = nbr.profile_badge_id
    JOIN profile_badges a ON a.id = o.audience_id
    WHERE p_news_id IS NULL OR nbr.news_id = p_news_id
    ORDER BY nbr.news_id, a.premium_tier NULLS LAST, a.id
  )
  SELECT
    r.news_id,
    r.is_readable,
    CASE WHEN r.is_readable THEN NULL ELSE c.audience_id END AS cta_badge_id
  FROM restricted r
  LEFT JOIN cta c ON c.news_id = r.news_id;
$function$
;

CREATE OR REPLACE FUNCTION public.get_news_feed_by_content(p_user_profile_id bigint DEFAULT NULL::bigint, p_is_admin boolean DEFAULT false, p_search text DEFAULT NULL::text, p_sort text DEFAULT 'Newest'::text, p_skip integer DEFAULT 0, p_limit integer DEFAULT 20, p_include_locked boolean DEFAULT false)
 RETURNS TABLE(id bigint, created_at timestamp with time zone, created_by bigint, modified_at timestamp with time zone, published_at timestamp with time zone, is_draft boolean, comment_count bigint, content jsonb, content_search_text text, slug text, summary text, tags bigint[], title text, total_views bigint, hero_image json, content_reach public.content_reach, profile_badges json, is_locked boolean, cta_badge_id bigint, total_count bigint)
 LANGUAGE sql
 STABLE
 SET search_path TO 'public', 'pg_temp'
AS $function$
  WITH viewer_access AS (
    SELECT * FROM get_news_access(p_user_profile_id, p_is_admin)
  )
  SELECT
    n.id,
    n.created_at,
    n.created_by,
    n.modified_at,
    n.published_at,
    n.is_draft,
    n.comment_count,
    CASE WHEN l.is_locked THEN NULL ELSE n.content END AS content,
    CASE WHEN l.is_locked THEN NULL ELSE n.content_search_text END AS content_search_text,
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
    l.is_locked,
    va.cta_badge_id,
    COUNT(*) OVER () AS total_count
  FROM news n
  LEFT JOIN viewer_access va ON va.news_id = n.id
  CROSS JOIN LATERAL (SELECT COALESCE(NOT va.is_readable, false) AS is_locked) l
  WHERE
    n.is_draft = false
    AND (n.deleted IS NULL OR n.deleted = FALSE)
    AND (NOT l.is_locked OR (p_include_locked AND va.cta_badge_id IS NOT NULL))
    AND (
      p_search IS NULL
      OR (NOT l.is_locked AND n.content_fts @@ plainto_tsquery('english', p_search))
      OR (
        l.is_locked
        AND to_tsvector('english', COALESCE(n.title, '') || ' ' || COALESCE(n.summary, ''))
          @@ plainto_tsquery('english', p_search)
      )
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

CREATE OR REPLACE FUNCTION public.get_profiles_by_badge_ids(p_badge_ids bigint[], p_tenant_id text)
 RETURNS TABLE(profile_id bigint, profile_created_at timestamp with time zone, display_name text, username text, roles text[], email text, comments boolean, replies boolean, research_updates boolean, is_unsubscribed boolean, content_reach public.content_reach, badge_ids bigint[])
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
  RETURN QUERY
  WITH RECURSIVE granting (badge_id) AS (
    SELECT unnest(p_badge_ids)
    UNION
    SELECT pb.id
    FROM profile_badges pb
    JOIN granting g ON pb.grants_badge_id = g.badge_id
  )
  SELECT DISTINCT
    p.id AS profile_id,
    p.created_at AS profile_created_at,
    p.display_name,
    p.username,
    COALESCE(p.roles, ARRAY[]::text[]) AS roles,
    au.email::text,
    COALESCE(np.comments, true) AS comments,
    COALESCE(np.replies, true) AS replies,
    COALESCE(np.research_updates, true) AS research_updates,
    COALESCE(np.is_unsubscribed, false) AS is_unsubscribed,
    np.content_reach,
    ARRAY[]::bigint[] AS badge_ids
  FROM profile_badges_relations pbr
  INNER JOIN profiles p ON pbr.profile_id = p.id
  LEFT JOIN auth.users au ON p.auth_id = au.id
  LEFT JOIN notifications_preferences np ON p.id = np.user_id
  WHERE pbr.profile_badge_id IN (SELECT g.badge_id FROM granting g)
  AND p.tenant_id = p_tenant_id;
END;
$function$
;
