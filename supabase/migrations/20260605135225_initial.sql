

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgsodium";

COMMENT ON SCHEMA "public" IS 'standard public schema';

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE TYPE "public"."content_reach" AS ENUM (
    'all',
    'important'
);
ALTER TYPE "public"."content_reach" OWNER TO "postgres";

CREATE TYPE "public"."content_types" AS ENUM (
    'questions',
    'projects',
    'research',
    'news',
    'comments'
);
ALTER TYPE "public"."content_types" OWNER TO "postgres";

CREATE TYPE "public"."notification_action_types" AS ENUM (
    'newComment',
    'newContent',
    'newReply',
    'newNews'
);
ALTER TYPE "public"."notification_action_types" OWNER TO "postgres";

CREATE TYPE "public"."notification_content_types" AS ENUM (
    'news',
    'research',
    'researchUpdate',
    'library',
    'questions',
    'comment',
    'reply',
    'research_updates',
    'comments',
    'projects'
);
ALTER TYPE "public"."notification_content_types" OWNER TO "postgres";

CREATE TYPE "public"."notification_source_content_type" AS ENUM (
    'news',
    'research',
    'researchUpdate',
    'library',
    'questions',
    'projects',
    'research_updates'
);
ALTER TYPE "public"."notification_source_content_type" OWNER TO "postgres";

CREATE TYPE "public"."research_status" AS ENUM (
    'in-progress',
    'complete',
    'archived'
);
ALTER TYPE "public"."research_status" OWNER TO "postgres";

CREATE TYPE "public"."useful_content_types" AS ENUM (
    'questions',
    'projects',
    'research',
    'news',
    'comments'
);
ALTER TYPE "public"."useful_content_types" OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."combined_project_search_fields"("project_id_param" bigint) RETURNS "text"
    LANGUAGE "sql"
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
  SELECT
    (SELECT p.title || ' ' || p.description FROM projects p WHERE p.id = project_id_param) || ' ' ||
    COALESCE(string_agg(ps.title || ' ' || ps.description, ' '), '')
  FROM project_steps ps
  WHERE ps.project_id = project_id_param;
$$;
ALTER FUNCTION "public"."combined_project_search_fields"("project_id_param" bigint) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."combined_research_search_fields"("research_id_param" bigint) RETURNS "text"
    LANGUAGE "sql"
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
  SELECT
    (SELECT r.title || ' ' || r.description FROM research r WHERE r.id = research_id_param) || ' ' ||
    COALESCE(string_agg(ru.title || ' ' || ru.description, ' '), '')
  FROM research_updates ru
  WHERE ru.research_id = research_id_param;
$$;
ALTER FUNCTION "public"."combined_research_search_fields"("research_id_param" bigint) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."comment_authors_by_source_id"("source_id_input" bigint) RETURNS SETOF "text"
    LANGUAGE "sql"
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
  SELECT DISTINCT (p.username)
  FROM comments c
  INNER JOIN profiles p
  ON c.created_by = p.id
  WHERE c.source_id = source_id_input
$$;
ALTER FUNCTION "public"."comment_authors_by_source_id"("source_id_input" bigint) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_author_vote_counts"("author_id" bigint) RETURNS TABLE("content_type" "text", "vote_count" bigint)
    LANGUAGE "sql" STABLE
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
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
$$;
ALTER FUNCTION "public"."get_author_vote_counts"("author_id" bigint) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_comments_with_votes"("p_source_type" "text", "p_source_id" bigint, "p_current_user_id" bigint DEFAULT NULL::bigint) RETURNS TABLE("id" bigint, "comment" "text", "created_at" timestamp with time zone, "modified_at" timestamp with time zone, "deleted" boolean, "source_id" bigint, "source_type" "text", "parent_id" bigint, "created_by" bigint, "profile" "json", "vote_count" bigint, "has_voted" boolean)
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.comment,
    c.created_at,
    c.modified_at,
    c.deleted,
    c.source_id,
    c.source_type,
    c.parent_id,
    c.created_by,
    -- Build the profile JSON structure
    CASE 
      WHEN p.id IS NOT NULL THEN 
        json_build_object(
          'id', p.id,
          'display_name', p.display_name,
          'username', p.username,
          'photo', p.photo,
          'country', p.country,
          'badges', COALESCE(badges_agg.badges_array, '[]'::json)
        )
      ELSE NULL 
    END as profile,
    -- Count of useful votes for this comment
    COALESCE(vote_counts.vote_count, 0) as vote_count,
    -- Whether current user has voted on this comment
    CASE 
      WHEN p_current_user_id IS NOT NULL AND user_votes.content_id IS NOT NULL 
      THEN TRUE 
      ELSE FALSE 
    END as has_voted
  FROM comments c
  LEFT JOIN profiles p ON c.created_by = p.id
  -- Aggregate badges for each profile
  LEFT JOIN (
    SELECT 
      pbr.profile_id,
      json_agg(
        json_build_object(
          'id', pb.id,
          'name', pb.name,
          'display_name', pb.display_name,
          'image_url', pb.image_url,
          'action_url', pb.action_url
        )
      ) as badges_array
    FROM profile_badges_relations pbr
    JOIN profile_badges pb ON pbr.profile_badge_id = pb.id
    GROUP BY pbr.profile_id
  ) badges_agg ON p.id = badges_agg.profile_id
  -- Count useful votes for each comment
  LEFT JOIN (
    SELECT 
      uv.content_id,
      COUNT(*) as vote_count
    FROM useful_votes uv
    WHERE uv.content_type = 'comments'
    GROUP BY uv.content_id
  ) vote_counts ON c.id = vote_counts.content_id
  -- Check if current user has voted on each comment
  LEFT JOIN (
    SELECT DISTINCT uv.content_id
    FROM useful_votes uv
    WHERE uv.content_type = 'comments'
      AND uv.user_id = p_current_user_id
  ) user_votes ON c.id = user_votes.content_id
  WHERE 
    c.source_type = p_source_type
    AND c.source_id = p_source_id
  ORDER BY c.created_at ASC;
END;
$$;
ALTER FUNCTION "public"."get_comments_with_votes"("p_source_type" "text", "p_source_id" bigint, "p_current_user_id" bigint) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_news_feed"("p_user_profile_id" bigint DEFAULT NULL::bigint, "p_is_admin" boolean DEFAULT false, "p_search" "text" DEFAULT NULL::"text", "p_sort" "text" DEFAULT 'Newest'::"text", "p_skip" integer DEFAULT 0, "p_limit" integer DEFAULT 20) RETURNS TABLE("id" bigint, "created_at" timestamp with time zone, "created_by" bigint, "modified_at" timestamp with time zone, "published_at" timestamp with time zone, "is_draft" boolean, "comment_count" bigint, "body" "text", "slug" "text", "summary" "text", "tags" bigint[], "title" "text", "total_views" bigint, "hero_image" "json", "content_reach" "public"."content_reach", "profile_badges" "json", "total_count" bigint)
    LANGUAGE "sql" STABLE
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
  SELECT
    n.id,
    n.created_at,
    n.created_by,
    n.modified_at,
    n.published_at,
    n.is_draft,
    n.comment_count,
    n.body,
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
      OR to_tsvector('english', n.title || ' ' || n.body) @@ plainto_tsquery('english', p_search)
    )
  ORDER BY
    CASE WHEN p_sort = 'Newest'       THEN n.published_at   END DESC NULLS LAST,
    CASE WHEN p_sort = 'Comments'     THEN n.comment_count  END DESC NULLS LAST,
    CASE WHEN p_sort = 'LeastComments' THEN n.comment_count END ASC  NULLS LAST,
    n.published_at DESC  -- stable tiebreaker
  LIMIT p_limit
  OFFSET p_skip;
$$;
ALTER FUNCTION "public"."get_news_feed"("p_user_profile_id" bigint, "p_is_admin" boolean, "p_search" "text", "p_sort" "text", "p_skip" integer, "p_limit" integer) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_profiles_by_badge"("p_badge_id" bigint) RETURNS TABLE("profile_id" bigint, "badges" "jsonb", "notification_preferences" "jsonb", "email" "text")
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public', 'auth'
    AS $$
  select
    p.id as profile_id,
    coalesce(
      jsonb_agg(
        distinct jsonb_build_object(
          'id', pb.id,
          'name', pb.name,
          'display_name', pb.display_name
        )
      ) filter (where pb.id is not null),
      '[]'::jsonb
    ) as badges,
    jsonb_build_object(
      'comments', np.comments,
      'replies', np.replies,
      'research_updates', np.research_updates,
      'is_unsubscribed', np.is_unsubscribed,
      'content_reach', np.content_reach
    ) as notification_preferences,
    u.email::text as email
  from public.profiles p
  left join public.profile_badges_relations pbr_all
    on pbr_all.profile_id = p.id
  left join public.profile_badges pb
    on pb.id = pbr_all.profile_badge_id
  left join public.notifications_preferences np
    on np.user_id = p.id
  left join auth.users u
    on u.id = p.auth_id
  where exists (
    select 1
    from public.profile_badges_relations pbr_filter
    where pbr_filter.profile_id = p.id
      and pbr_filter.profile_badge_id = p_badge_id
  )
  group by
    p.id,
    np.comments,
    np.replies,
    np.research_updates,
    np.is_unsubscribed,
    ecr.id,
    ecr.name,
    ecr.preferences_label,
    ecr.preferences_description,
    ecr.create_content_label,
    ecr.default_option,
    ecr.tenant_id,
    ecr.created_at,
    u.email;
$$;
ALTER FUNCTION "public"."get_profiles_by_badge"("p_badge_id" bigint) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_profiles_by_badge_ids"("p_badge_ids" bigint[], "p_tenant_id" "text") RETURNS TABLE("profile_id" bigint, "profile_created_at" timestamp with time zone, "display_name" "text", "username" "text", "roles" "text"[], "email" "text", "comments" boolean, "replies" boolean, "research_updates" boolean, "is_unsubscribed" boolean, "content_reach" "public"."content_reach", "badge_ids" bigint[])
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
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
  WHERE pbr.profile_badge_id = ANY(p_badge_ids)
  AND p.tenant_id = p_tenant_id;
END;
$$;
ALTER FUNCTION "public"."get_profiles_by_badge_ids"("p_badge_ids" bigint[], "p_tenant_id" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_profiles_with_any_badge"("p_tenant_id" "text") RETURNS TABLE("profile_id" bigint, "profile_created_at" timestamp with time zone, "display_name" "text", "username" "text", "roles" "text"[], "email" "text", "comments" boolean, "replies" boolean, "research_updates" boolean, "is_unsubscribed" boolean, "content_reach" "public"."content_reach", "badge_ids" bigint[])
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
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
  WHERE p.tenant_id = p_tenant_id;
END;
$$;
ALTER FUNCTION "public"."get_profiles_with_any_badge"("p_tenant_id" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_projects"("search_query" "text" DEFAULT NULL::"text", "category_id" bigint DEFAULT NULL::bigint, "sort_by" "text" DEFAULT 'Newest'::"text", "limit_val" integer DEFAULT 12, "offset_val" integer DEFAULT 0, "current_username" "text" DEFAULT NULL::"text", "days_back" integer DEFAULT 7) RETURNS TABLE("id" bigint, "created_at" timestamp with time zone, "created_by" bigint, "modified_at" timestamp with time zone, "description" "text", "slug" "text", "cover_image" "json", "category" "json", "tags" "text"[], "title" "text", "moderation" "text", "total_views" bigint, "author" "json", "comment_count" integer, "useful_votes_last_week" integer)
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public', 'pg_temp'
    AS $$DECLARE
    ts_query tsquery;
BEGIN
    -- Parse search query once if provided, using prefix matching for partial words
    IF search_query IS NOT NULL THEN
        -- Split search query into words and create prefix-matching tsquery with AND logic
        -- Sanitize each word to prevent tsquery injection
        ts_query := to_tsquery('english', 
          array_to_string(
            ARRAY(
              SELECT quote_literal(regexp_replace(lower(word), '[^a-z0-9_-]', '', 'g')) || ':*'
              FROM unnest(string_to_array(trim(search_query), ' ')) AS word
              WHERE word != '' 
                AND regexp_replace(lower(word), '[^a-z0-9_-]', '', 'g') != ''
            ),
            ' & '
          )
        );
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
        p.comment_count,
        (SELECT COALESCE(COUNT(uv.id), 0)::integer
         FROM useful_votes uv
         WHERE uv.content_id = p.id
           AND uv.content_type = 'projects'
           AND uv.created_at >= NOW() - INTERVAL '1 day' * days_back) AS useful_votes_last_week
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
            WHEN sort_by = 'Newest' THEN extract(epoch from p.published_at)
            WHEN sort_by = 'LatestUpdated' THEN extract(epoch from p.modified_at)
            WHEN sort_by = 'MostComments' THEN p.comment_count
            WHEN sort_by = 'MostDownloads' THEN p.file_download_count
            WHEN sort_by = 'MostUseful' THEN
                (SELECT COALESCE(COUNT(uv.id), 0)
                 FROM useful_votes uv
                 WHERE uv.content_id = p.id AND uv.content_type = 'projects')
            WHEN sort_by = 'MostUsefulLastWeek' THEN
                (SELECT COALESCE(COUNT(uv.id), 0)
                 FROM useful_votes uv
                 WHERE uv.content_id = p.id
                   AND uv.content_type = 'projects'
                   AND uv.created_at >= NOW() - INTERVAL '1 day' * days_back)
            WHEN sort_by = 'MostViews' THEN p.total_views
            ELSE 0
        END DESC NULLS LAST,
        CASE
            WHEN sort_by = 'LeastComments' THEN p.comment_count
        END ASC NULLS LAST,
        p.published_at DESC
    LIMIT limit_val OFFSET offset_val;
END;$$;
ALTER FUNCTION "public"."get_projects"("search_query" "text", "category_id" bigint, "sort_by" "text", "limit_val" integer, "offset_val" integer, "current_username" "text", "days_back" integer) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_projects_count"("search_query" "text" DEFAULT NULL::"text", "category_id" integer DEFAULT NULL::integer, "current_username" "text" DEFAULT NULL::"text") RETURNS integer
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
DECLARE
  ts_query tsquery;
BEGIN
    IF search_query IS NOT NULL THEN
      -- Split search query into words and create prefix-matching tsquery with AND logic
      -- Sanitize each word to prevent tsquery injection
      ts_query := to_tsquery('english', 
        array_to_string(
          ARRAY(
            SELECT quote_literal(regexp_replace(lower(word), '[^a-z0-9_-]', '', 'g')) || ':*'
            FROM unnest(string_to_array(trim(search_query), ' ')) AS word
            WHERE word != '' 
              AND regexp_replace(lower(word), '[^a-z0-9_-]', '', 'g') != ''
          ),
          ' & '
        )
      );
    END IF;

  RETURN (
    SELECT COUNT(*)
    FROM projects p
    INNER JOIN profiles prof ON prof.id = p.created_by
    WHERE
      (search_query IS NULL OR
       p.fts @@ ts_query OR
       prof.username ILIKE '%' || search_query || '%'
      ) AND
      (category_id IS NULL OR p.category = category_id) AND
      (p.is_draft IS NULL OR p.is_draft = FALSE) AND
      (p.deleted IS NULL OR p.deleted = FALSE) AND
      (p.moderation = 'accepted' OR prof.username = current_username)
  );
END;
$$;
ALTER FUNCTION "public"."get_projects_count"("search_query" "text", "category_id" integer, "current_username" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_questions"("search_query" "text" DEFAULT NULL::"text", "category_id" bigint DEFAULT NULL::bigint, "sort_by" "text" DEFAULT 'Newest'::"text", "limit_val" integer DEFAULT 20, "offset_val" integer DEFAULT 0) RETURNS TABLE("id" bigint, "created_at" timestamp with time zone, "created_by" bigint, "modified_at" timestamp with time zone, "published_at" timestamp with time zone, "description" "text", "slug" "text", "category" "json", "tags" bigint[], "title" "text", "total_views" bigint, "is_draft" boolean, "comment_count" bigint, "images" "json"[], "author" "json")
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
DECLARE
  ts_query tsquery;
BEGIN
  IF search_query IS NOT NULL THEN
    -- Split search query into words and create prefix-matching tsquery with AND logic
    -- Sanitize each word to prevent tsquery injection
    ts_query := to_tsquery('english', 
      array_to_string(
        ARRAY(
          SELECT quote_literal(regexp_replace(lower(word), '[^a-z0-9_-]', '', 'g')) || ':*'
          FROM unnest(string_to_array(trim(search_query), ' ')) AS word
          WHERE word != '' 
            AND regexp_replace(lower(word), '[^a-z0-9_-]', '', 'g') != ''
        ),
        ' & '
      )
    );
  END IF;

  RETURN QUERY
  SELECT
    q.id,
    q.created_at,
    q.created_by,
    q.modified_at,
    q.published_at,
    q.description,
    q.slug,
    (SELECT json_build_object('id', c.id, 'name', c.name) FROM categories c WHERE c.id = q.category) AS category,
    q.tags,
    q.title,
    q.total_views,
    q.is_draft,
    q.comment_count,
    q.images,
    (SELECT json_build_object(
      'id', p.id,
      'display_name', p.display_name,
      'username', p.username,
      'photo', p.photo,
      'country', p.country,
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
        WHERE pbr.profile_id = p.id),
        '[]'::json
      )
    ) FROM profiles p WHERE p.id = q.created_by) AS author
  FROM questions q
  JOIN profiles prof ON prof.id = q.created_by
  WHERE
    (search_query IS NULL OR
     q.fts @@ ts_query OR
     prof.username ILIKE '%' || search_query || '%'
    ) AND
    (category_id IS NULL OR q.category = category_id) AND
    q.is_draft = FALSE AND
    (q.deleted IS NULL OR q.deleted = FALSE)
  ORDER BY
    CASE WHEN search_query IS NOT NULL THEN ts_rank_cd(q.fts, ts_query) END DESC NULLS LAST,
    CASE
      WHEN sort_by = 'Newest' THEN extract(epoch from q.published_at)
      WHEN sort_by = 'Comments' THEN q.comment_count
      ELSE 0
    END DESC NULLS LAST,
    CASE
      WHEN sort_by = 'LeastComments' THEN q.comment_count
    END ASC NULLS LAST,
    q.published_at DESC
  LIMIT limit_val OFFSET offset_val;
END;
$$;
ALTER FUNCTION "public"."get_questions"("search_query" "text", "category_id" bigint, "sort_by" "text", "limit_val" integer, "offset_val" integer) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_questions_count"("search_query" "text" DEFAULT NULL::"text", "category_id" integer DEFAULT NULL::integer) RETURNS integer
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
DECLARE
  ts_query tsquery;
BEGIN
  IF search_query IS NOT NULL THEN
    -- Split search query into words and create prefix-matching tsquery with AND logic
    -- Sanitize each word to prevent tsquery injection
    ts_query := to_tsquery('english', 
      array_to_string(
        ARRAY(
          SELECT quote_literal(regexp_replace(lower(word), '[^a-z0-9_-]', '', 'g')) || ':*'
          FROM unnest(string_to_array(trim(search_query), ' ')) AS word
          WHERE word != '' 
            AND regexp_replace(lower(word), '[^a-z0-9_-]', '', 'g') != ''
        ),
        ' & '
      )
    );
  END IF;

  RETURN (
    SELECT COUNT(*)
    FROM questions q
    INNER JOIN profiles prof ON prof.id = q.created_by
    WHERE
      (search_query IS NULL OR
       q.fts @@ ts_query OR
       prof.username ILIKE '%' || search_query || '%'
      ) AND
      (category_id IS NULL OR q.category = category_id) AND
      q.is_draft = FALSE AND
      (q.deleted IS NULL OR q.deleted = FALSE)
  );
END;
$$;
ALTER FUNCTION "public"."get_questions_count"("search_query" "text", "category_id" integer) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_research"("search_query" "text" DEFAULT NULL::"text", "category_id" bigint DEFAULT NULL::bigint, "research_status" "public"."research_status" DEFAULT NULL::"public"."research_status", "sort_by" "text" DEFAULT 'Newest'::"text", "limit_val" integer DEFAULT 10, "offset_val" integer DEFAULT 0, "days_back" integer DEFAULT 7) RETURNS TABLE("id" bigint, "created_at" timestamp with time zone, "created_by" bigint, "modified_at" timestamp with time zone, "description" "text", "slug" "text", "image" "json", "status" "public"."research_status", "category" "json", "tags" "text"[], "title" "text", "total_views" integer, "author" "json", "update_count" bigint, "comment_count" bigint, "useful_votes_last_week" integer)
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
DECLARE
  ts_query tsquery;
BEGIN
  -- Parse the search query once if provided, using prefix matching for partial words
  IF search_query IS NOT NULL THEN
    -- Split search query into words and create prefix-matching tsquery with AND logic
    -- Sanitize each word to prevent tsquery injection
    ts_query := to_tsquery('english', 
      array_to_string(
        ARRAY(
          SELECT quote_literal(regexp_replace(lower(word), '[^a-z0-9_-]', '', 'g')) || ':*'
          FROM unnest(string_to_array(trim(search_query), ' ')) AS word
          WHERE word != '' 
            AND regexp_replace(lower(word), '[^a-z0-9_-]', '', 'g') != ''
        ),
        ' & '
      )
    );
  END IF;
 
  RETURN QUERY
  SELECT
    r.id,
    r.created_at,
    r.created_by,
    GREATEST(
      r.modified_at,
      COALESCE(
        (SELECT MAX(ru.modified_at) FROM research_updates ru
         WHERE ru.research_id = r.id
           AND (ru.is_draft IS NULL OR ru.is_draft = FALSE)
           AND (ru.deleted IS NULL OR ru.deleted = FALSE)),
        r.modified_at
      )
    ) AS modified_at,
    r.description,
    r.slug,
    r.image,
    r.status,
    (SELECT json_build_object('id', c.id, 'name', c.name) FROM categories c WHERE c.id = r.category) AS category,
    r.tags,
    r.title,
    r.total_views,
    (SELECT json_build_object(
      'id', p.id,
      'display_name', p.display_name,
      'username', p.username,
      'country', p.country,
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
        WHERE pbr.profile_id = p.id),
        '[]'::json
      )
    ) FROM profiles p WHERE p.id = r.created_by) AS author,
    (SELECT COUNT(*) FROM research_updates ru WHERE ru.research_id = r.id AND (ru.is_draft IS NULL OR ru.is_draft = FALSE)
          AND (ru.deleted IS NULL OR ru.deleted = FALSE)) AS update_count,
    (SELECT COALESCE(SUM(ru.comment_count), 0) FROM research_updates ru WHERE ru.research_id = r.id AND (ru.is_draft IS NULL OR ru.is_draft = FALSE)
          AND (ru.deleted IS NULL OR ru.deleted = FALSE)) AS comment_count,
    (SELECT COALESCE(COUNT(uv.id), 0)::integer
     FROM useful_votes uv
     WHERE uv.content_id = r.id
       AND uv.content_type = 'research'
       AND uv.created_at >= NOW() - INTERVAL '1 day' * days_back) AS useful_votes_last_week
  FROM research r
  JOIN profiles prof ON prof.id = r.created_by
  WHERE
    (search_query IS NULL OR
     r.fts @@ ts_query OR
     prof.username ILIKE '%' || search_query || '%'
    ) AND
    (category_id IS NULL OR r.category = category_id) AND
    (research_status IS NULL OR r.status = research_status) AND
    (r.is_draft IS NULL OR r.is_draft = FALSE) AND
    (r.deleted IS NULL OR r.deleted = FALSE)
  ORDER BY
    -- Add relevance ranking when search query is provided
    CASE WHEN search_query IS NOT NULL THEN ts_rank_cd(r.fts, ts_query) END DESC NULLS LAST,
    CASE
      WHEN sort_by = 'Newest' THEN extract(epoch from r.published_at)
      WHEN sort_by = 'LatestUpdated' THEN extract(epoch from
        GREATEST(
          r.modified_at,
          COALESCE(
            (SELECT MAX(ru.modified_at) FROM research_updates ru
             WHERE ru.research_id = r.id
               AND (ru.is_draft IS NULL OR ru.is_draft = FALSE)
               AND (ru.deleted IS NULL OR ru.deleted = FALSE)),
            r.modified_at
          )
        )
      )
      WHEN sort_by = 'MostComments' THEN
        (SELECT COALESCE(SUM(ru.comment_count), 0) FROM research_updates ru WHERE ru.research_id = r.id AND (ru.is_draft IS NULL OR ru.is_draft = FALSE)
          AND (ru.deleted IS NULL OR ru.deleted = FALSE))
      WHEN sort_by = 'MostUseful' THEN
        (SELECT COALESCE(COUNT(uv.id), 0) FROM useful_votes uv WHERE uv.content_id = r.id AND uv.content_type = 'research')
      WHEN sort_by = 'MostUsefulLastWeek' THEN
        (SELECT COALESCE(COUNT(uv.id), 0) FROM useful_votes uv
         WHERE uv.content_id = r.id
           AND uv.content_type = 'research'
           AND uv.created_at >= NOW() - INTERVAL '1 day' * days_back)
      WHEN sort_by = 'MostUpdates' THEN
        (SELECT COUNT(*) FROM research_updates ru WHERE ru.research_id = r.id AND (ru.is_draft IS NULL OR ru.is_draft = FALSE)
          AND (ru.deleted IS NULL OR ru.deleted = FALSE))
      ELSE 0
    END DESC NULLS LAST,
    CASE
      WHEN sort_by = 'LeastComments' THEN
        (SELECT COALESCE(SUM(ru.comment_count), 0) FROM research_updates ru WHERE ru.research_id = r.id AND (ru.is_draft IS NULL OR ru.is_draft = FALSE)
          AND (ru.deleted IS NULL OR ru.deleted = FALSE))
    END ASC NULLS LAST,
    r.published_at DESC
  LIMIT limit_val OFFSET offset_val;
END;
$$;
ALTER FUNCTION "public"."get_research"("search_query" "text", "category_id" bigint, "research_status" "public"."research_status", "sort_by" "text", "limit_val" integer, "offset_val" integer, "days_back" integer) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_research_count"("search_query" "text" DEFAULT NULL::"text", "category_id" integer DEFAULT NULL::integer, "research_status" "public"."research_status" DEFAULT NULL::"public"."research_status") RETURNS integer
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
DECLARE
  ts_query tsquery;
BEGIN
  IF search_query IS NOT NULL THEN
    -- Split search query into words and create prefix-matching tsquery with AND logic
    -- Sanitize each word to prevent tsquery injection
    ts_query := to_tsquery('english', 
      array_to_string(
        ARRAY(
          SELECT quote_literal(regexp_replace(lower(word), '[^a-z0-9_-]', '', 'g')) || ':*'
          FROM unnest(string_to_array(trim(search_query), ' ')) AS word
          WHERE word != '' 
            AND regexp_replace(lower(word), '[^a-z0-9_-]', '', 'g') != ''
        ),
        ' & '
      )
    );
  END IF;

  RETURN (
    SELECT COUNT(*)
    FROM research r
    INNER JOIN profiles prof ON prof.id = r.created_by
    WHERE
      (search_query IS NULL OR
       r.fts @@ ts_query OR
       prof.username ILIKE '%' || search_query || '%'
      ) AND
      (category_id IS NULL OR r.category = category_id) AND
      (research_status IS NULL OR r.status = research_status) AND
      (r.is_draft IS NULL OR r.is_draft = FALSE) AND
      (r.deleted IS NULL OR r.deleted = FALSE)
  );
END;
$$;
ALTER FUNCTION "public"."get_research_count"("search_query" "text", "category_id" integer, "research_status" "public"."research_status") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_staff_profiles"("p_tenant_id" "text") RETURNS TABLE("profile_id" bigint, "profile_created_at" timestamp with time zone, "display_name" "text", "username" "text", "roles" "text"[], "email" "text", "comments" boolean, "replies" boolean, "research_updates" boolean, "is_unsubscribed" boolean, "content_reach" "public"."content_reach", "badge_ids" bigint[])
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
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
  FROM profiles p
  LEFT JOIN auth.users au ON p.auth_id = au.id
  LEFT JOIN notifications_preferences np ON p.id = np.user_id
  WHERE p.roles && ARRAY['admin', 'editor', 'moderator']::text[]
  AND p.tenant_id = p_tenant_id;
END;
$$;
ALTER FUNCTION "public"."get_staff_profiles"("p_tenant_id" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_storage_object_path"("object_id" "uuid", "bucket_name" "text") RETURNS TABLE("id" "uuid", "name" "text", "path_tokens" "text"[], "bucket_id" "text")
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    so.id,
    so.name,
    so.path_tokens,
    so.bucket_id
  FROM storage.objects so
  WHERE so.id = object_id
    AND so.bucket_id = bucket_name;
END;
$$;
ALTER FUNCTION "public"."get_storage_object_path"("object_id" "uuid", "bucket_name" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_subscribed_users_emails_to_notify"("p_content_id" bigint, "p_content_type" "text") RETURNS TABLE("email" character varying, "profile_id" bigint, "profile_created_at" timestamp with time zone, "display_name" character varying, "comments" boolean, "replies" boolean, "research_updates" boolean, "is_unsubscribed" boolean)
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT ON (p.id)
        u.email,
        p.id AS profile_id,
        p.created_at AS profile_created_at,
        p.display_name::character varying,
        np.comments,
        np.replies,
        np.research_updates,
        np.is_unsubscribed
    FROM subscribers s
    INNER JOIN profiles p ON s.user_id = p.id
    INNER JOIN auth.users u ON p.auth_id = u.id
    LEFT JOIN notifications_preferences np ON np.user_id = p.id
    WHERE s.content_id = p_content_id AND s.content_type = p_content_type
    ORDER BY p.id;
END;
$$;
ALTER FUNCTION "public"."get_subscribed_users_emails_to_notify"("p_content_id" bigint, "p_content_type" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_useful_votes_count_by_content_id"("p_content_type" "public"."useful_content_types", "p_content_ids" bigint[]) RETURNS TABLE("content_id" bigint, "count" bigint)
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
BEGIN
  RETURN QUERY
  SELECT v.content_id, COUNT(*) as count
  FROM public.useful_votes v
  WHERE v.content_type = p_content_type
    AND v.content_id = ANY(p_content_ids)
  GROUP BY v.content_id;
END;
$$;
ALTER FUNCTION "public"."get_useful_votes_count_by_content_id"("p_content_type" "public"."useful_content_types", "p_content_ids" bigint[]) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_user_email_by_id"("id" "uuid") RETURNS TABLE("email" character varying)
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'pg_temp'
    AS $_$
BEGIN
  RETURN QUERY SELECT au.email FROM auth.users au WHERE au.id = $1;
END;
$_$;
ALTER FUNCTION "public"."get_user_email_by_id"("id" "uuid") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_user_email_by_profile_id"("id" bigint) RETURNS TABLE("email" character varying)
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'pg_temp'
    AS $_$
BEGIN
  RETURN QUERY SELECT au.email FROM auth.users au inner join public.profiles p on au.id = p.auth_id WHERE p.id = $1;
END;
$_$;
ALTER FUNCTION "public"."get_user_email_by_profile_id"("id" bigint) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_user_email_by_username"("username" "text") RETURNS TABLE("email" character varying)
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'pg_temp'
    AS $_$
BEGIN
  RETURN QUERY SELECT au.email FROM auth.users au WHERE au.raw_user_meta_data->>'username' = $1;
END;
$_$;
ALTER FUNCTION "public"."get_user_email_by_username"("username" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_user_id_by_email"("email" "text") RETURNS TABLE("id" "uuid")
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'pg_temp'
    AS $_$BEGIN
  RETURN QUERY SELECT au.id FROM auth.users au WHERE au.email = $1;
END;$_$;
ALTER FUNCTION "public"."get_user_id_by_email"("email" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_user_projects"("username_param" "text") RETURNS TABLE("id" bigint, "comment_count" integer, "cover_image" "json", "title" "text", "slug" "text", "total_useful" bigint)
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
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
$$;
ALTER FUNCTION "public"."get_user_projects"("username_param" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_user_questions"("username_param" "text") RETURNS TABLE("id" bigint, "comment_count" bigint, "images" "json"[], "title" "text", "slug" "text", "total_useful" bigint)
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
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
$$;
ALTER FUNCTION "public"."get_user_questions"("username_param" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_user_research"("username_param" "text") RETURNS TABLE("id" bigint, "image" "json", "title" "text", "slug" "text", "total_useful" bigint)
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public', 'pg_temp'
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
ALTER FUNCTION "public"."get_user_research"("username_param" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."is_username_available"("username" "text", "exclude_profile_id" integer DEFAULT NULL::integer) RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public', 'pg_temp'
    AS $_$
  SELECT CASE WHEN $1 IS NULL THEN false
  ELSE NOT EXISTS (
    SELECT 1 FROM profiles
    WHERE LOWER(profiles.username) = LOWER($1)
      AND ($2 IS NULL OR profiles.id != $2)
      AND tenant_id = ((SELECT current_setting('request.headers', true))::json ->> 'x-tenant-id')
  ) END;
$_$;
ALTER FUNCTION "public"."is_username_available"("username" "text", "exclude_profile_id" integer) OWNER TO "postgres";

SET default_tablespace = '';
SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."news" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text") NOT NULL,
    "created_by" bigint,
    "deleted" boolean,
    "modified_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text"),
    "comment_count" bigint DEFAULT '0'::bigint,
    "body" "text" NOT NULL,
    "moderation" "text",
    "slug" "text" NOT NULL,
    "previous_slugs" "text"[],
    "category" bigint,
    "tags" bigint[],
    "title" "text" NOT NULL,
    "total_views" bigint,
    "tenant_id" "text" NOT NULL,
    "hero_image" "json",
    "summary" "text",
    "fts" "tsvector" GENERATED ALWAYS AS ("to_tsvector"('"english"'::"regconfig", ((("title" || ' '::"text") || "body") || ("summary" || ''::"text")))) STORED,
    "is_draft" boolean DEFAULT false NOT NULL,
    "profile_badge" bigint,
    "published_at" timestamp with time zone,
    "content_reach" "public"."content_reach"
);
ALTER TABLE "public"."news" OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."news_search_fields"("public"."news") RETURNS "text"
    LANGUAGE "sql"
    SET "search_path" TO 'public', 'pg_temp'
    AS $_$
  SELECT $1.title || ' ' || $1.body;
$_$;
ALTER FUNCTION "public"."news_search_fields"("public"."news") OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."questions" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text") NOT NULL,
    "created_by" bigint,
    "deleted" boolean,
    "modified_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text") NOT NULL,
    "comment_count" bigint DEFAULT '0'::bigint,
    "description" "text" NOT NULL,
    "moderation" "text",
    "slug" "text" NOT NULL,
    "previous_slugs" "text"[],
    "category" bigint,
    "tags" bigint[],
    "title" "text" NOT NULL,
    "total_views" bigint,
    "tenant_id" "text" NOT NULL,
    "fts" "tsvector" GENERATED ALWAYS AS ("to_tsvector"('"english"'::"regconfig", (("title" || ' '::"text") || "description"))) STORED,
    "images" "json"[],
    "is_draft" boolean DEFAULT false NOT NULL,
    "published_at" timestamp with time zone
);
ALTER TABLE "public"."questions" OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."questions_search_fields"("public"."questions") RETURNS "text"
    LANGUAGE "sql"
    SET "search_path" TO 'public', 'pg_temp'
    AS $_$
  SELECT $1.title || ' ' || $1.description;
$_$;
ALTER FUNCTION "public"."questions_search_fields"("public"."questions") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."read_secret"("secret_name" "text") RETURNS "text"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
DECLARE
  secret_value text;
BEGIN
  SELECT decrypted_secret INTO secret_value
  FROM vault.decrypted_secrets
  WHERE name = secret_name
  LIMIT 1;

  RETURN secret_value;
END;
$$;
ALTER FUNCTION "public"."read_secret"("secret_name" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."update_comment_count"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public', 'pg_temp'
    AS $$BEGIN
  IF (TG_OP = 'INSERT') THEN
    IF NEW.source_type IS NOT NULL AND NEW.source_id IS NOT NULL AND (NEW.deleted IS NULL OR NEW.deleted = false) THEN
      IF NEW.source_type = 'questions' THEN
        UPDATE questions SET comment_count = COALESCE(comment_count, 0) + 1
        WHERE id = NEW.source_id;
      ELSIF NEW.source_type = 'research_updates' THEN
        UPDATE research_updates SET comment_count = COALESCE(comment_count, 0) + 1
        WHERE id = NEW.source_id;
      ELSIF NEW.source_type = 'news' THEN
        UPDATE news SET comment_count = COALESCE(comment_count, 0) + 1
        WHERE id = NEW.source_id;
      ELSIF NEW.source_type = 'projects' THEN
        UPDATE projects SET comment_count = COALESCE(comment_count, 0) + 1
        WHERE id = NEW.source_id;
      END IF;
    ELSE
      RAISE NOTICE 'Warning: source_type or source_id is NULL, or comment is deleted';
    END IF;
  ELSIF (TG_OP = 'UPDATE') THEN
    IF (COALESCE(OLD.deleted, false) = false AND NEW.deleted = true) THEN
      IF OLD.source_type IS NOT NULL AND OLD.source_id IS NOT NULL THEN
        IF OLD.source_type = 'questions' THEN
          UPDATE questions SET comment_count = GREATEST(COALESCE(comment_count, 0) - 1, 0)
          WHERE id = OLD.source_id;
        ELSIF OLD.source_type = 'research_updates' THEN
          UPDATE research_updates SET comment_count = GREATEST(COALESCE(comment_count, 0) - 1, 0)
          WHERE id = OLD.source_id;
        ELSIF OLD.source_type = 'news' THEN
          UPDATE news SET comment_count = GREATEST(COALESCE(comment_count, 0) - 1, 0)
          WHERE id = OLD.source_id;
        ELSIF OLD.source_type = 'projects' THEN
          UPDATE projects SET comment_count = GREATEST(COALESCE(comment_count, 0) - 1, 0)
          WHERE id = OLD.source_id;
        END IF;
      ELSE
        RAISE NOTICE 'Warning: OLD.source_type or OLD.source_id is NULL';
      END IF;
    ELSIF (OLD.deleted = true AND COALESCE(NEW.deleted, false) = false) THEN
      IF NEW.source_type IS NOT NULL AND NEW.source_id IS NOT NULL THEN
        IF NEW.source_type = 'questions' THEN
          UPDATE questions SET comment_count = COALESCE(comment_count, 0) + 1
          WHERE id = NEW.source_id;
        ELSIF NEW.source_type = 'research_updates' THEN
          UPDATE research_updates SET comment_count = COALESCE(comment_count, 0) + 1
          WHERE id = NEW.source_id;
        ELSIF NEW.source_type = 'news' THEN
          UPDATE news SET comment_count = COALESCE(comment_count, 0) + 1
          WHERE id = NEW.source_id;
        ELSIF NEW.source_type = 'projects' THEN
          UPDATE projects SET comment_count = COALESCE(comment_count, 0) + 1
          WHERE id = NEW.source_id;
        END IF;
      ELSE
        RAISE NOTICE 'Warning: NEW.source_type or NEW.source_id is NULL';
      END IF;
    END IF;
  ELSIF (TG_OP = 'DELETE') THEN
    IF OLD.source_type IS NOT NULL AND OLD.source_id IS NOT NULL THEN
      IF OLD.source_type = 'questions' THEN
        UPDATE questions SET comment_count = GREATEST(COALESCE(comment_count, 0) - 1, 0)
        WHERE id = OLD.source_id;
      ELSIF OLD.source_type = 'research_updates' THEN
        UPDATE research_updates SET comment_count = GREATEST(COALESCE(comment_count, 0) - 1, 0)
        WHERE id = OLD.source_id;
      ELSIF OLD.source_type = 'news' THEN
        UPDATE news SET comment_count = GREATEST(COALESCE(comment_count, 0) - 1, 0)
        WHERE id = OLD.source_id;
      ELSIF OLD.source_type = 'projects' THEN
        UPDATE projects SET comment_count = GREATEST(COALESCE(comment_count, 0) - 1, 0)
        WHERE id = OLD.source_id;
      END IF;
    ELSE
      RAISE NOTICE 'Warning: OLD.source_type or OLD.source_id is NULL';
    END IF;
  END IF;
  
  RETURN NULL;
END;$$;
ALTER FUNCTION "public"."update_comment_count"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."update_project_tsvector"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
BEGIN
  IF TG_TABLE_NAME = 'project_steps' THEN
    UPDATE projects
    SET fts = to_tsvector('english', public.combined_project_search_fields(NEW.project_id))
    WHERE id = NEW.project_id;
  ELSEIF TG_TABLE_NAME = 'projects' THEN
    UPDATE projects
    SET fts = to_tsvector('english', public.combined_project_search_fields(NEW.id))
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;
ALTER FUNCTION "public"."update_project_tsvector"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."update_research_tsvector"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
BEGIN
  IF TG_TABLE_NAME = 'research_updates' THEN
    UPDATE research
    SET fts = to_tsvector('english', public.combined_research_search_fields(NEW.research_id))
    WHERE id = NEW.research_id;
  ELSEIF TG_TABLE_NAME = 'research' THEN
    UPDATE research
    SET fts = to_tsvector('english', public.combined_research_search_fields(NEW.id))
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;
ALTER FUNCTION "public"."update_research_tsvector"() OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."banners" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "modified_at" timestamp with time zone,
    "text" "text" NOT NULL,
    "url" "text",
    "tenant_id" "text" NOT NULL
);
ALTER TABLE "public"."banners" OWNER TO "postgres";
ALTER TABLE "public"."banners" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."banners_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."categories" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "tenant_id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "type" "public"."content_types",
    "image_url" "text",
    "description" "text"
);
ALTER TABLE "public"."categories" OWNER TO "postgres";
ALTER TABLE "public"."categories" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."categories_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."comments" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text") NOT NULL,
    "comment" "text" NOT NULL,
    "source_id" bigint,
    "parent_id" bigint,
    "tenant_id" "text" DEFAULT ''::"text" NOT NULL,
    "created_by" bigint,
    "source_type" "text" NOT NULL,
    "modified_at" timestamp with time zone,
    "source_id_legacy" "text",
    "deleted" boolean
);
ALTER TABLE "public"."comments" OWNER TO "postgres";
ALTER TABLE "public"."comments" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."comments_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."file_downloads" (
    "id" bigint NOT NULL,
    "profile_id" bigint NOT NULL,
    "content_type" "text" NOT NULL,
    "content_id" integer NOT NULL,
    "file_id" "text" NOT NULL,
    "downloaded_at" timestamp with time zone DEFAULT "now"(),
    "tenant_id" "text" NOT NULL
);
ALTER TABLE "public"."file_downloads" OWNER TO "postgres";
ALTER TABLE "public"."file_downloads" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."file_downloads_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."map_pins" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "profile_id" bigint NOT NULL,
    "country" "text" NOT NULL,
    "country_code" "text" NOT NULL,
    "administrative" "text",
    "post_code" "text",
    "lat" "text" NOT NULL,
    "lng" "text" NOT NULL,
    "moderation" "text" NOT NULL,
    "tenant_id" "text" NOT NULL,
    "moderation_feedback" "text",
    "name" "text"
);
ALTER TABLE "public"."map_pins" OWNER TO "postgres";
ALTER TABLE "public"."map_pins" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."map_pins_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."map_settings" (
    "id" bigint NOT NULL,
    "default_type_filters" "text"[],
    "setting_filters" "text"[] NOT NULL,
    "tenant_id" "text" NOT NULL
);
ALTER TABLE "public"."map_settings" OWNER TO "postgres";
ALTER TABLE "public"."map_settings" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."map_settings_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."messages" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "message" "text" NOT NULL,
    "sender_id" bigint NOT NULL,
    "receiver_id" bigint,
    "tenant_id" "text" NOT NULL
);
ALTER TABLE "public"."messages" OWNER TO "postgres";
ALTER TABLE "public"."messages" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."messages_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."news_badges_relations" (
    "id" bigint NOT NULL,
    "news_id" bigint NOT NULL,
    "profile_badge_id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text") NOT NULL,
    "tenant_id" "text" NOT NULL
);
ALTER TABLE "public"."news_badges_relations" OWNER TO "postgres";
ALTER TABLE "public"."news_badges_relations" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."news_badges_relations_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
ALTER TABLE "public"."news" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."news_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."notifications" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text") NOT NULL,
    "modified_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text"),
    "owned_by_id" bigint NOT NULL,
    "triggered_by_id" bigint NOT NULL,
    "content_type" "public"."notification_content_types" NOT NULL,
    "content_id" bigint NOT NULL,
    "is_read" boolean DEFAULT false,
    "action_type" "public"."notification_action_types" NOT NULL,
    "tenant_id" "text" NOT NULL,
    "source_content_type" "text",
    "source_content_id" bigint,
    "parent_comment_id" bigint,
    "parent_content_id" bigint,
    "should_email" boolean,
    "title" "text"
);
ALTER TABLE "public"."notifications" OWNER TO "postgres";
ALTER TABLE "public"."notifications" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."notifications_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."notifications_preferences" (
    "id" bigint NOT NULL,
    "user_id" bigint NOT NULL,
    "comments" boolean NOT NULL,
    "replies" boolean NOT NULL,
    "tenant_id" "text" NOT NULL,
    "research_updates" boolean NOT NULL,
    "is_unsubscribed" boolean DEFAULT false NOT NULL,
    "content_reach" "public"."content_reach"
);
ALTER TABLE "public"."notifications_preferences" OWNER TO "postgres";
ALTER TABLE "public"."notifications_preferences" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."notifications_preferences_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."profile_badges" (
    "id" bigint NOT NULL,
    "name" "text" NOT NULL,
    "display_name" "text" NOT NULL,
    "image_url" "text" NOT NULL,
    "action_url" "text",
    "tenant_id" "text" NOT NULL,
    "premium_tier" integer
);
ALTER TABLE "public"."profile_badges" OWNER TO "postgres";
ALTER TABLE "public"."profile_badges" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."profile_badges_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."profile_badges_relations" (
    "id" bigint NOT NULL,
    "profile_id" bigint NOT NULL,
    "profile_badge_id" bigint NOT NULL,
    "tenant_id" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text") NOT NULL
);
ALTER TABLE "public"."profile_badges_relations" OWNER TO "postgres";
ALTER TABLE "public"."profile_badges_relations" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."profile_badges_relations_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."profile_tags" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text") NOT NULL,
    "name" "text" NOT NULL,
    "tenant_id" "text" NOT NULL,
    "profile_type" "text"
);
ALTER TABLE "public"."profile_tags" OWNER TO "postgres";
ALTER TABLE "public"."profile_tags" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."profile_tags_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."profile_tags_relations" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text") NOT NULL,
    "profile_id" bigint NOT NULL,
    "profile_tag_id" bigint NOT NULL,
    "tenant_id" "text" NOT NULL
);
ALTER TABLE "public"."profile_tags_relations" OWNER TO "postgres";
ALTER TABLE "public"."profile_tags_relations" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."profile_tags_relations_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."profile_types" (
    "id" bigint NOT NULL,
    "name" "text" NOT NULL,
    "display_name" "text" NOT NULL,
    "order" smallint NOT NULL,
    "image_url" "text" NOT NULL,
    "small_image_url" "text" NOT NULL,
    "description" "text" NOT NULL,
    "map_pin_name" "text" NOT NULL,
    "is_space" boolean NOT NULL,
    "tenant_id" "text" NOT NULL
);
ALTER TABLE "public"."profile_types" OWNER TO "postgres";
ALTER TABLE "public"."profile_types" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."profile_types_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "firebase_auth_id" "text",
    "display_name" "text" NOT NULL,
    "country" "text",
    "about" "text",
    "tenant_id" "text" NOT NULL,
    "username" "text",
    "roles" "text"[],
    "impact" "json",
    "is_blocked_from_messaging" boolean,
    "is_contactable" boolean DEFAULT true,
    "is_supporter" boolean,
    "patreon" "json",
    "total_views" integer,
    "type" "text",
    "auth_id" "uuid",
    "legacy_id" "text",
    "cover_images" "json"[],
    "last_active" timestamp with time zone,
    "photo" "json",
    "visitor_policy" "json",
    "website" "text",
    "profile_type" bigint,
    "donations_enabled" boolean DEFAULT false NOT NULL
);
ALTER TABLE "public"."profiles" OWNER TO "postgres";
ALTER TABLE "public"."profiles" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."profiles_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."project_steps" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text") NOT NULL,
    "project_id" bigint NOT NULL,
    "title" "text" NOT NULL,
    "description" "text" NOT NULL,
    "images" "json",
    "video_url" "text",
    "order" smallint,
    "tenant_id" "text" NOT NULL
);
ALTER TABLE "public"."project_steps" OWNER TO "postgres";
ALTER TABLE "public"."project_steps" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."project_steps_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."projects" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text") NOT NULL,
    "modified_at" timestamp with time zone,
    "title" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "previous_slugs" "text"[],
    "description" "text" NOT NULL,
    "created_by" bigint,
    "deleted" boolean,
    "category" bigint,
    "difficulty_level" "text",
    "cover_image" "json",
    "file_link" "text",
    "files" "json"[],
    "tags" "text"[],
    "is_draft" boolean,
    "time" "text",
    "file_download_count" integer,
    "moderation" "text",
    "moderation_feedback" "text",
    "tenant_id" "text" NOT NULL,
    "fts" "tsvector",
    "total_views" bigint,
    "comment_count" integer,
    "published_at" timestamp with time zone
);
ALTER TABLE "public"."projects" OWNER TO "postgres";
ALTER TABLE "public"."projects" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."projects_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE "public"."questions" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."questions_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."research" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "modified_at" timestamp with time zone DEFAULT "now"(),
    "title" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "description" "text" NOT NULL,
    "category" bigint,
    "created_by" bigint,
    "tags" "text"[],
    "deleted" boolean,
    "total_views" integer,
    "total_useful" integer,
    "previous_slugs" "text"[],
    "status" "public"."research_status",
    "is_draft" boolean,
    "tenant_id" "text" NOT NULL,
    "fts" "tsvector",
    "collaborators" "text"[],
    "image" "json",
    "published_at" timestamp with time zone
);
ALTER TABLE "public"."research" OWNER TO "postgres";
ALTER TABLE "public"."research" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."research_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."research_updates" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text") NOT NULL,
    "research_id" bigint NOT NULL,
    "title" "text" NOT NULL,
    "description" "text" NOT NULL,
    "images" "json"[],
    "files" "json"[],
    "video_url" "text",
    "is_draft" boolean,
    "comment_count" integer,
    "tenant_id" "text" NOT NULL,
    "modified_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text"),
    "deleted" boolean,
    "file_link" "text",
    "file_download_count" integer,
    "created_by" bigint,
    "published_at" timestamp with time zone
);
ALTER TABLE "public"."research_updates" OWNER TO "postgres";
ALTER TABLE "public"."research_updates" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."research_updates_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."stripe_badge_products" (
    "id" bigint NOT NULL,
    "stripe_product_id" "text" NOT NULL,
    "badge_id" bigint NOT NULL,
    "tenant_id" "text" NOT NULL
);
ALTER TABLE "public"."stripe_badge_products" OWNER TO "postgres";
ALTER TABLE "public"."stripe_badge_products" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."stripe_badge_products_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."stripe_customers" (
    "id" bigint NOT NULL,
    "auth_id" "uuid" NOT NULL,
    "stripe_customer_id" "text" NOT NULL,
    "tenant_id" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text") NOT NULL
);
ALTER TABLE "public"."stripe_customers" OWNER TO "postgres";
ALTER TABLE "public"."stripe_customers" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."stripe_customers_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."subscribers" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text") NOT NULL,
    "user_id" bigint NOT NULL,
    "content_id" bigint NOT NULL,
    "content_type" "text" NOT NULL,
    "tenant_id" "text" NOT NULL
);
ALTER TABLE "public"."subscribers" OWNER TO "postgres";
ALTER TABLE "public"."subscribers" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."subscribers_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."tags" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "tenant_id" "text" NOT NULL,
    "modified_at" "date"
);
ALTER TABLE "public"."tags" OWNER TO "postgres";
ALTER TABLE "public"."tags" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."tags_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."tenant_settings" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "site_name" "text" NOT NULL,
    "site_url" "text" NOT NULL,
    "message_sign_off" "text",
    "tenant_id" "text" NOT NULL,
    "email_from" "text",
    "site_image" "text",
    "site_favicon" "text",
    "donation_settings" "json",
    "academy_resource" "text",
    "library_heading" "text",
    "no_messaging" boolean DEFAULT false NOT NULL,
    "patreon_id" "text",
    "profile_guidelines" "text",
    "questions_guidelines" "text",
    "supported_modules" "text",
    "site_description" "text",
    "color_primary" "text",
    "color_primary_hover" "text",
    "color_accent" "text",
    "color_accent_hover" "text",
    "show_impact" boolean,
    "create_research_roles" "text"[],
    "ga_tracking_id" "text",
    "pwa_icons" "jsonb",
    "hidden_modules" "text",
    CONSTRAINT "check_pwa_icons_schema" CHECK ((("pwa_icons" IS NULL) OR (("jsonb_typeof"("pwa_icons") = 'object'::"text") AND (("pwa_icons" - ARRAY['16'::"text", '32'::"text", '192'::"text", '256'::"text", '512'::"text"]) = '{}'::"jsonb") AND (("pwa_icons" ->> '16'::"text") IS NOT NULL) AND (("pwa_icons" ->> '32'::"text") IS NOT NULL) AND (("pwa_icons" ->> '192'::"text") IS NOT NULL) AND (("pwa_icons" ->> '256'::"text") IS NOT NULL) AND (("pwa_icons" ->> '512'::"text") IS NOT NULL) AND ("jsonb_typeof"(("pwa_icons" -> '16'::"text")) = 'string'::"text") AND ("jsonb_typeof"(("pwa_icons" -> '32'::"text")) = 'string'::"text") AND ("jsonb_typeof"(("pwa_icons" -> '192'::"text")) = 'string'::"text") AND ("jsonb_typeof"(("pwa_icons" -> '256'::"text")) = 'string'::"text") AND ("jsonb_typeof"(("pwa_icons" -> '512'::"text")) = 'string'::"text"))))
);
ALTER TABLE "public"."tenant_settings" OWNER TO "postgres";
ALTER TABLE "public"."tenant_settings" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."tenant_settings_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."upgrade_badge" (
    "id" bigint NOT NULL,
    "action_label" "text" NOT NULL,
    "badge_id" bigint NOT NULL,
    "is_space" boolean NOT NULL,
    "action_url" "text" NOT NULL,
    "tenant_id" "text" NOT NULL
);
ALTER TABLE "public"."upgrade_badge" OWNER TO "postgres";
ALTER TABLE "public"."upgrade_badge" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."upgrade_badge_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."useful_votes" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "content_id" bigint NOT NULL,
    "content_type" "public"."useful_content_types" NOT NULL,
    "user_id" bigint NOT NULL,
    "tenant_id" "text" NOT NULL
);
ALTER TABLE "public"."useful_votes" OWNER TO "postgres";
ALTER TABLE "public"."useful_votes" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."useful_votes_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE ONLY "public"."banners"
    ADD CONSTRAINT "banners_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."file_downloads"
    ADD CONSTRAINT "file_downloads_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."file_downloads"
    ADD CONSTRAINT "file_downloads_profile_id_content_type_content_id_file_id_t_key" UNIQUE ("profile_id", "content_type", "content_id", "file_id", "tenant_id");
ALTER TABLE ONLY "public"."map_pins"
    ADD CONSTRAINT "map_pins_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."map_settings"
    ADD CONSTRAINT "map_settings_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."news_badges_relations"
    ADD CONSTRAINT "news_badges_relations_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."news"
    ADD CONSTRAINT "news_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."news"
    ADD CONSTRAINT "news_tenant_id_slug_key" UNIQUE ("tenant_id", "slug");
ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."notifications_preferences"
    ADD CONSTRAINT "notifications_preferences_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."profile_badges"
    ADD CONSTRAINT "profile_badges_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."profile_badges_relations"
    ADD CONSTRAINT "profile_badges_relations_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."profile_tags"
    ADD CONSTRAINT "profile_tags_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."profile_tags_relations"
    ADD CONSTRAINT "profile_tags_relations_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."profile_types"
    ADD CONSTRAINT "profile_types_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_auth_id_tenant_id_key" UNIQUE ("auth_id", "tenant_id");
ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."project_steps"
    ADD CONSTRAINT "project_steps_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_slug_key" UNIQUE ("slug", "tenant_id");
ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_title_key" UNIQUE ("title", "tenant_id");
ALTER TABLE ONLY "public"."questions"
    ADD CONSTRAINT "questions_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."research"
    ADD CONSTRAINT "research_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."research_updates"
    ADD CONSTRAINT "research_updates_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."stripe_badge_products"
    ADD CONSTRAINT "stripe_badge_products_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."stripe_badge_products"
    ADD CONSTRAINT "stripe_badge_products_stripe_product_id_key" UNIQUE ("stripe_product_id");
ALTER TABLE ONLY "public"."stripe_customers"
    ADD CONSTRAINT "stripe_customers_auth_id_tenant_id_key" UNIQUE ("auth_id", "tenant_id");
ALTER TABLE ONLY "public"."stripe_customers"
    ADD CONSTRAINT "stripe_customers_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."stripe_customers"
    ADD CONSTRAINT "stripe_customers_stripe_customer_id_tenant_id_key" UNIQUE ("stripe_customer_id", "tenant_id");
ALTER TABLE ONLY "public"."subscribers"
    ADD CONSTRAINT "subscribers_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."tags"
    ADD CONSTRAINT "tags_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."tenant_settings"
    ADD CONSTRAINT "tenant_settings_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."questions"
    ADD CONSTRAINT "unique_tenant_slug" UNIQUE ("tenant_id", "slug");
ALTER TABLE ONLY "public"."upgrade_badge"
    ADD CONSTRAINT "upgrade_badge_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."useful_votes"
    ADD CONSTRAINT "useful_votes_pkey" PRIMARY KEY ("id");

CREATE INDEX "comments_created_by_idx" ON "public"."comments" USING "btree" ("created_by");
CREATE INDEX "comments_source_type_source_id_created_at_idx" ON "public"."comments" USING "btree" ("source_type", "source_id", "created_at");
CREATE INDEX "idx_map_pins_moderation" ON "public"."map_pins" USING "btree" ("moderation");
CREATE INDEX "idx_map_pins_moderation_tenant" ON "public"."map_pins" USING "btree" ("moderation", "tenant_id");
CREATE INDEX "idx_map_pins_tenant_id" ON "public"."map_pins" USING "btree" ("tenant_id");
CREATE INDEX "idx_news_badges_relations_badge_id" ON "public"."news_badges_relations" USING "btree" ("profile_badge_id");
CREATE INDEX "idx_news_badges_relations_news_badge" ON "public"."news_badges_relations" USING "btree" ("news_id", "profile_badge_id");
CREATE INDEX "idx_news_badges_relations_news_id" ON "public"."news_badges_relations" USING "btree" ("news_id");
CREATE INDEX "idx_news_badges_relations_tenant_id" ON "public"."news_badges_relations" USING "btree" ("tenant_id");
CREATE INDEX "idx_profile_badges_relations_badge_id" ON "public"."profile_badges_relations" USING "btree" ("profile_badge_id");
CREATE INDEX "idx_profile_badges_relations_profile_id" ON "public"."profile_badges_relations" USING "btree" ("profile_id");
CREATE INDEX "idx_profile_badges_relations_tenant_id" ON "public"."profile_badges_relations" USING "btree" ("tenant_id");
CREATE INDEX "idx_profile_badges_tenant_id" ON "public"."profile_badges" USING "btree" ("tenant_id");
CREATE INDEX "idx_profile_tags_relations_profile_id" ON "public"."profile_tags_relations" USING "btree" ("profile_id");
CREATE INDEX "idx_profile_tags_relations_tag_id" ON "public"."profile_tags_relations" USING "btree" ("profile_tag_id");
CREATE INDEX "idx_profile_tags_relations_tenant_id" ON "public"."profile_tags_relations" USING "btree" ("tenant_id");
CREATE INDEX "idx_profile_tags_tenant_id" ON "public"."profile_tags" USING "btree" ("tenant_id");
CREATE INDEX "idx_profile_types_tenant_id" ON "public"."profile_types" USING "btree" ("tenant_id");
CREATE INDEX "idx_profiles_profile_type" ON "public"."profiles" USING "btree" ("profile_type");
CREATE INDEX "idx_stripe_badge_products_badge_id" ON "public"."stripe_badge_products" USING "btree" ("badge_id");
CREATE INDEX "idx_stripe_badge_products_stripe_product_id" ON "public"."stripe_badge_products" USING "btree" ("stripe_product_id");
CREATE INDEX "idx_stripe_badge_products_tenant_id" ON "public"."stripe_badge_products" USING "btree" ("tenant_id");
CREATE INDEX "idx_stripe_customers_auth_id" ON "public"."stripe_customers" USING "btree" ("auth_id");
CREATE INDEX "idx_stripe_customers_stripe_customer_id" ON "public"."stripe_customers" USING "btree" ("stripe_customer_id");
CREATE INDEX "idx_stripe_customers_tenant_id" ON "public"."stripe_customers" USING "btree" ("tenant_id");
CREATE INDEX "idx_upgrade_badge_is_space" ON "public"."upgrade_badge" USING "btree" ("is_space");
CREATE INDEX "idx_upgrade_badge_tenant_id" ON "public"."upgrade_badge" USING "btree" ("tenant_id");
CREATE INDEX "map_pins_lat_lng_idx" ON "public"."map_pins" USING "btree" ("lat", "lng");
CREATE INDEX "map_pins_user_id_idx" ON "public"."map_pins" USING "btree" ("profile_id");
CREATE INDEX "news_badges_relations_news_tenant_idx" ON "public"."news_badges_relations" USING "btree" ("news_id", "tenant_id");
CREATE INDEX "news_category_idx" ON "public"."news" USING "btree" ("category");
CREATE INDEX "news_created_by_idx" ON "public"."news" USING "btree" ("created_by");
CREATE INDEX "news_deleted_moderation_category_total_views_tags_created_a_idx" ON "public"."news" USING "btree" ("deleted", "moderation", "category", "total_views", "tags", "created_at", "comment_count", "created_by");
CREATE INDEX "news_tags_idx" ON "public"."news" USING "gin" ("tags");
CREATE INDEX "profile_badges_relations_profile_tenant_idx" ON "public"."profile_badges_relations" USING "btree" ("profile_id", "tenant_id");
CREATE INDEX "profile_tags_relations_profile_tenant_idx" ON "public"."profile_tags_relations" USING "btree" ("profile_id", "tenant_id");
CREATE INDEX "profiles_firebase_auth_id_idx" ON "public"."profiles" USING "btree" ("firebase_auth_id");
CREATE INDEX "profiles_tenant_created_at_idx" ON "public"."profiles" USING "btree" ("tenant_id", "created_at" DESC);
CREATE UNIQUE INDEX "profiles_username_tenant_id_key" ON "public"."profiles" USING "btree" ("username", "tenant_id") WHERE ("username" IS NOT NULL);
CREATE INDEX "projects_created_by_idx" ON "public"."projects" USING "btree" ("created_by");
CREATE INDEX "questions_category_idx" ON "public"."questions" USING "btree" ("category");
CREATE INDEX "questions_created_by_idx" ON "public"."questions" USING "btree" ("created_by");
CREATE INDEX "questions_deleted_moderation_category_total_views_tags_crea_idx" ON "public"."questions" USING "btree" ("deleted", "moderation", "category", "total_views", "tags", "created_at", "comment_count", "created_by");
CREATE INDEX "questions_tags_idx" ON "public"."questions" USING "gin" ("tags");
CREATE INDEX "research_created_by_idx" ON "public"."research" USING "btree" ("created_by");
CREATE INDEX "research_fts_idx" ON "public"."research" USING "gin" ("fts");
CREATE INDEX "research_updates_created_by_idx" ON "public"."research_updates" USING "btree" ("created_by");
CREATE INDEX "useful_votes_comments_content_id_idx" ON "public"."useful_votes" USING "btree" ("content_id") WHERE ("content_type" = 'comments'::"public"."useful_content_types");
CREATE INDEX "useful_votes_comments_user_id_content_id_idx" ON "public"."useful_votes" USING "btree" ("user_id", "content_id") WHERE ("content_type" = 'comments'::"public"."useful_content_types");
CREATE INDEX "useful_votes_content_type_content_id_idx" ON "public"."useful_votes" USING "btree" ("content_type", "content_id");
CREATE OR REPLACE TRIGGER "project_step_trigger" AFTER INSERT OR DELETE OR UPDATE OF "title", "description" ON "public"."project_steps" FOR EACH ROW EXECUTE FUNCTION "public"."update_project_tsvector"();
CREATE OR REPLACE TRIGGER "project_text_trigger" AFTER INSERT OR UPDATE OF "title", "description" ON "public"."projects" FOR EACH ROW EXECUTE FUNCTION "public"."update_project_tsvector"();
CREATE OR REPLACE TRIGGER "research_text_trigger" AFTER INSERT OR UPDATE OF "title", "description" ON "public"."research" FOR EACH ROW EXECUTE FUNCTION "public"."update_research_tsvector"();
CREATE OR REPLACE TRIGGER "research_update_trigger" AFTER INSERT OR DELETE OR UPDATE OF "title", "description" ON "public"."research_updates" FOR EACH ROW EXECUTE FUNCTION "public"."update_research_tsvector"();
CREATE OR REPLACE TRIGGER "update_comment_count" AFTER INSERT OR DELETE OR UPDATE ON "public"."comments" FOR EACH ROW EXECUTE FUNCTION "public"."update_comment_count"();

ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comment_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY "public"."file_downloads"
    ADD CONSTRAINT "file_downloads_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;
ALTER TABLE ONLY "public"."map_pins"
    ADD CONSTRAINT "map_pins_user_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_receiver_fkey" FOREIGN KEY ("receiver_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_sender_fkey" FOREIGN KEY ("sender_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY "public"."news_badges_relations"
    ADD CONSTRAINT "news_badges_relations_news_id_fkey" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY "public"."news_badges_relations"
    ADD CONSTRAINT "news_badges_relations_profile_badge_id_fkey" FOREIGN KEY ("profile_badge_id") REFERENCES "public"."profile_badges"("id") ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY "public"."news"
    ADD CONSTRAINT "news_category_fkey" FOREIGN KEY ("category") REFERENCES "public"."categories"("id") ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY "public"."news"
    ADD CONSTRAINT "news_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_owned_by_id_fkey" FOREIGN KEY ("owned_by_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY "public"."notifications_preferences"
    ADD CONSTRAINT "notifications_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");
ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_triggered_by_id_fkey" FOREIGN KEY ("triggered_by_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE;
ALTER TABLE ONLY "public"."profile_badges_relations"
    ADD CONSTRAINT "profile_badges_relations_profile_badge_id_fkey" FOREIGN KEY ("profile_badge_id") REFERENCES "public"."profile_badges"("id") ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY "public"."profile_badges_relations"
    ADD CONSTRAINT "profile_badges_relations_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY "public"."profile_tags_relations"
    ADD CONSTRAINT "profile_tags_relations_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY "public"."profile_tags_relations"
    ADD CONSTRAINT "profile_tags_relations_profile_tag_id_fkey" FOREIGN KEY ("profile_tag_id") REFERENCES "public"."profile_tags"("id") ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_auth_id_fkey" FOREIGN KEY ("auth_id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_profile_type_fkey" FOREIGN KEY ("profile_type") REFERENCES "public"."profile_types"("id") ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY "public"."project_steps"
    ADD CONSTRAINT "project_steps_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_category_id_fkey" FOREIGN KEY ("category") REFERENCES "public"."categories"("id") ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY "public"."questions"
    ADD CONSTRAINT "question_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY "public"."questions"
    ADD CONSTRAINT "questions_category_fkey" FOREIGN KEY ("category") REFERENCES "public"."categories"("id") ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY "public"."research"
    ADD CONSTRAINT "research_category_fkey" FOREIGN KEY ("category") REFERENCES "public"."categories"("id") ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY "public"."research"
    ADD CONSTRAINT "research_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY "public"."research_updates"
    ADD CONSTRAINT "research_update_research_id_fkey" FOREIGN KEY ("research_id") REFERENCES "public"."research"("id") ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY "public"."research_updates"
    ADD CONSTRAINT "research_updates_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY "public"."stripe_badge_products"
    ADD CONSTRAINT "stripe_badge_products_badge_id_fkey" FOREIGN KEY ("badge_id") REFERENCES "public"."profile_badges"("id") ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY "public"."stripe_customers"
    ADD CONSTRAINT "stripe_customers_auth_id_fkey" FOREIGN KEY ("auth_id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY "public"."subscribers"
    ADD CONSTRAINT "subscribers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY "public"."upgrade_badge"
    ADD CONSTRAINT "upgrade_badge_badge_id_fkey" FOREIGN KEY ("badge_id") REFERENCES "public"."profile_badges"("id") ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY "public"."useful_votes"
    ADD CONSTRAINT "useful_votes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "public"."banners" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."categories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."comments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."file_downloads" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."map_pins" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."map_settings" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "message_isolation" ON "public"."messages" AS RESTRICTIVE TO "authenticated" USING ((("auth"."uid"() IN ( SELECT "profiles"."auth_id"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "messages"."sender_id"))) OR ("auth"."uid"() IN ( SELECT "profiles"."auth_id"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "messages"."receiver_id")))));

ALTER TABLE "public"."messages" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."news" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."notifications" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."notifications_preferences" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."profile_badges" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."profile_badges_relations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."profile_tags" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."profile_tags_relations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."profile_types" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."project_steps" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."projects" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."questions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."research" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."research_updates" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."stripe_badge_products" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."stripe_customers" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."subscribers" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."tags" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation" ON "public"."banners" USING (("tenant_id" = ((( SELECT "current_setting"('request.headers'::"text", true) AS "current_setting"))::"json" ->> 'x-tenant-id'::"text")));
CREATE POLICY "tenant_isolation" ON "public"."categories" USING (("tenant_id" = ((( SELECT "current_setting"('request.headers'::"text", true) AS "current_setting"))::"json" ->> 'x-tenant-id'::"text")));
CREATE POLICY "tenant_isolation" ON "public"."comments" USING (("tenant_id" = ((( SELECT "current_setting"('request.headers'::"text", true) AS "current_setting"))::"json" ->> 'x-tenant-id'::"text")));
CREATE POLICY "tenant_isolation" ON "public"."file_downloads" USING (("tenant_id" = (("current_setting"('request.headers'::"text", true))::"json" ->> 'x-tenant-id'::"text")));
CREATE POLICY "tenant_isolation" ON "public"."map_pins" USING (("tenant_id" = ((( SELECT "current_setting"('request.headers'::"text", true) AS "current_setting"))::"json" ->> 'x-tenant-id'::"text")));
CREATE POLICY "tenant_isolation" ON "public"."map_settings" USING (("tenant_id" = ((( SELECT "current_setting"('request.headers'::"text", true) AS "current_setting"))::"json" ->> 'x-tenant-id'::"text")));
CREATE POLICY "tenant_isolation" ON "public"."messages" TO "authenticated" USING (("tenant_id" = ((( SELECT "current_setting"('request.headers'::"text", true) AS "current_setting"))::"json" ->> 'x-tenant-id'::"text")));
CREATE POLICY "tenant_isolation" ON "public"."news" USING (("tenant_id" = ((( SELECT "current_setting"('request.headers'::"text", true) AS "current_setting"))::"json" ->> 'x-tenant-id'::"text")));
CREATE POLICY "tenant_isolation" ON "public"."news_badges_relations" USING (("tenant_id" = ((( SELECT "current_setting"('request.headers'::"text", true) AS "current_setting"))::"json" ->> 'x-tenant-id'::"text")));
CREATE POLICY "tenant_isolation" ON "public"."notifications" USING (("tenant_id" = ((( SELECT "current_setting"('request.headers'::"text", true) AS "current_setting"))::"json" ->> 'x-tenant-id'::"text")));
CREATE POLICY "tenant_isolation" ON "public"."notifications_preferences" USING (("tenant_id" = ((( SELECT "current_setting"('request.headers'::"text", true) AS "current_setting"))::"json" ->> 'x-tenant-id'::"text")));
CREATE POLICY "tenant_isolation" ON "public"."profile_badges" USING (("tenant_id" = ((( SELECT "current_setting"('request.headers'::"text", true) AS "current_setting"))::"json" ->> 'x-tenant-id'::"text")));
CREATE POLICY "tenant_isolation" ON "public"."profile_badges_relations" USING (("tenant_id" = ((( SELECT "current_setting"('request.headers'::"text", true) AS "current_setting"))::"json" ->> 'x-tenant-id'::"text")));
CREATE POLICY "tenant_isolation" ON "public"."profile_tags" USING (("tenant_id" = ((( SELECT "current_setting"('request.headers'::"text", true) AS "current_setting"))::"json" ->> 'x-tenant-id'::"text")));
CREATE POLICY "tenant_isolation" ON "public"."profile_tags_relations" USING (("tenant_id" = ((( SELECT "current_setting"('request.headers'::"text", true) AS "current_setting"))::"json" ->> 'x-tenant-id'::"text")));
CREATE POLICY "tenant_isolation" ON "public"."profile_types" USING (("tenant_id" = ((( SELECT "current_setting"('request.headers'::"text", true) AS "current_setting"))::"json" ->> 'x-tenant-id'::"text")));
CREATE POLICY "tenant_isolation" ON "public"."profiles" USING (("tenant_id" = ((( SELECT "current_setting"('request.headers'::"text", true) AS "current_setting"))::"json" ->> 'x-tenant-id'::"text")));
CREATE POLICY "tenant_isolation" ON "public"."project_steps" USING (("tenant_id" = ((( SELECT "current_setting"('request.headers'::"text", true) AS "current_setting"))::"json" ->> 'x-tenant-id'::"text")));
CREATE POLICY "tenant_isolation" ON "public"."projects" USING (("tenant_id" = ((( SELECT "current_setting"('request.headers'::"text", true) AS "current_setting"))::"json" ->> 'x-tenant-id'::"text")));
CREATE POLICY "tenant_isolation" ON "public"."questions" USING (("tenant_id" = ((( SELECT "current_setting"('request.headers'::"text", true) AS "current_setting"))::"json" ->> 'x-tenant-id'::"text")));
CREATE POLICY "tenant_isolation" ON "public"."research" USING (("tenant_id" = ((( SELECT "current_setting"('request.headers'::"text", true) AS "current_setting"))::"json" ->> 'x-tenant-id'::"text")));
CREATE POLICY "tenant_isolation" ON "public"."research_updates" USING (("tenant_id" = ((( SELECT "current_setting"('request.headers'::"text", true) AS "current_setting"))::"json" ->> 'x-tenant-id'::"text")));
CREATE POLICY "tenant_isolation" ON "public"."stripe_badge_products" USING (("tenant_id" = ((( SELECT "current_setting"('request.headers'::"text", true) AS "current_setting"))::"json" ->> 'x-tenant-id'::"text")));
CREATE POLICY "tenant_isolation" ON "public"."stripe_customers" USING (("tenant_id" = ((( SELECT "current_setting"('request.headers'::"text", true) AS "current_setting"))::"json" ->> 'x-tenant-id'::"text")));
CREATE POLICY "tenant_isolation" ON "public"."subscribers" USING (("tenant_id" = ((( SELECT "current_setting"('request.headers'::"text", true) AS "current_setting"))::"json" ->> 'x-tenant-id'::"text")));
CREATE POLICY "tenant_isolation" ON "public"."tags" USING (("tenant_id" = ((( SELECT "current_setting"('request.headers'::"text", true) AS "current_setting"))::"json" ->> 'x-tenant-id'::"text")));
CREATE POLICY "tenant_isolation" ON "public"."tenant_settings" USING (("tenant_id" = ((( SELECT "current_setting"('request.headers'::"text", true) AS "current_setting"))::"json" ->> 'x-tenant-id'::"text")));
CREATE POLICY "tenant_isolation" ON "public"."upgrade_badge" USING (("tenant_id" = ((( SELECT "current_setting"('request.headers'::"text", true) AS "current_setting"))::"json" ->> 'x-tenant-id'::"text")));
CREATE POLICY "tenant_isolation" ON "public"."useful_votes" USING (("tenant_id" = ((( SELECT "current_setting"('request.headers'::"text", true) AS "current_setting"))::"json" ->> 'x-tenant-id'::"text")));

ALTER TABLE "public"."tenant_settings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."upgrade_badge" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."useful_votes" ENABLE ROW LEVEL SECURITY;

ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."combined_project_search_fields"("project_id_param" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."combined_project_search_fields"("project_id_param" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."combined_project_search_fields"("project_id_param" bigint) TO "service_role";

GRANT ALL ON FUNCTION "public"."combined_research_search_fields"("research_id_param" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."combined_research_search_fields"("research_id_param" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."combined_research_search_fields"("research_id_param" bigint) TO "service_role";

GRANT ALL ON FUNCTION "public"."comment_authors_by_source_id"("source_id_input" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."comment_authors_by_source_id"("source_id_input" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."comment_authors_by_source_id"("source_id_input" bigint) TO "service_role";

GRANT ALL ON FUNCTION "public"."get_author_vote_counts"("author_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."get_author_vote_counts"("author_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_author_vote_counts"("author_id" bigint) TO "service_role";

GRANT ALL ON FUNCTION "public"."get_comments_with_votes"("p_source_type" "text", "p_source_id" bigint, "p_current_user_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."get_comments_with_votes"("p_source_type" "text", "p_source_id" bigint, "p_current_user_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_comments_with_votes"("p_source_type" "text", "p_source_id" bigint, "p_current_user_id" bigint) TO "service_role";

GRANT ALL ON FUNCTION "public"."get_news_feed"("p_user_profile_id" bigint, "p_is_admin" boolean, "p_search" "text", "p_sort" "text", "p_skip" integer, "p_limit" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_news_feed"("p_user_profile_id" bigint, "p_is_admin" boolean, "p_search" "text", "p_sort" "text", "p_skip" integer, "p_limit" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_news_feed"("p_user_profile_id" bigint, "p_is_admin" boolean, "p_search" "text", "p_sort" "text", "p_skip" integer, "p_limit" integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."get_profiles_by_badge"("p_badge_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."get_profiles_by_badge"("p_badge_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_profiles_by_badge"("p_badge_id" bigint) TO "service_role";

GRANT ALL ON FUNCTION "public"."get_profiles_by_badge_ids"("p_badge_ids" bigint[], "p_tenant_id" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_profiles_by_badge_ids"("p_badge_ids" bigint[], "p_tenant_id" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_profiles_by_badge_ids"("p_badge_ids" bigint[], "p_tenant_id" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."get_profiles_with_any_badge"("p_tenant_id" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_profiles_with_any_badge"("p_tenant_id" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_profiles_with_any_badge"("p_tenant_id" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."get_projects"("search_query" "text", "category_id" bigint, "sort_by" "text", "limit_val" integer, "offset_val" integer, "current_username" "text", "days_back" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_projects"("search_query" "text", "category_id" bigint, "sort_by" "text", "limit_val" integer, "offset_val" integer, "current_username" "text", "days_back" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_projects"("search_query" "text", "category_id" bigint, "sort_by" "text", "limit_val" integer, "offset_val" integer, "current_username" "text", "days_back" integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."get_projects_count"("search_query" "text", "category_id" integer, "current_username" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_projects_count"("search_query" "text", "category_id" integer, "current_username" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_projects_count"("search_query" "text", "category_id" integer, "current_username" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."get_questions"("search_query" "text", "category_id" bigint, "sort_by" "text", "limit_val" integer, "offset_val" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_questions"("search_query" "text", "category_id" bigint, "sort_by" "text", "limit_val" integer, "offset_val" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_questions"("search_query" "text", "category_id" bigint, "sort_by" "text", "limit_val" integer, "offset_val" integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."get_questions_count"("search_query" "text", "category_id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_questions_count"("search_query" "text", "category_id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_questions_count"("search_query" "text", "category_id" integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."get_research"("search_query" "text", "category_id" bigint, "research_status" "public"."research_status", "sort_by" "text", "limit_val" integer, "offset_val" integer, "days_back" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_research"("search_query" "text", "category_id" bigint, "research_status" "public"."research_status", "sort_by" "text", "limit_val" integer, "offset_val" integer, "days_back" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_research"("search_query" "text", "category_id" bigint, "research_status" "public"."research_status", "sort_by" "text", "limit_val" integer, "offset_val" integer, "days_back" integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."get_research_count"("search_query" "text", "category_id" integer, "research_status" "public"."research_status") TO "anon";
GRANT ALL ON FUNCTION "public"."get_research_count"("search_query" "text", "category_id" integer, "research_status" "public"."research_status") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_research_count"("search_query" "text", "category_id" integer, "research_status" "public"."research_status") TO "service_role";

GRANT ALL ON FUNCTION "public"."get_staff_profiles"("p_tenant_id" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_staff_profiles"("p_tenant_id" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_staff_profiles"("p_tenant_id" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."get_storage_object_path"("object_id" "uuid", "bucket_name" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_storage_object_path"("object_id" "uuid", "bucket_name" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_storage_object_path"("object_id" "uuid", "bucket_name" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."get_subscribed_users_emails_to_notify"("p_content_id" bigint, "p_content_type" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_subscribed_users_emails_to_notify"("p_content_id" bigint, "p_content_type" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_subscribed_users_emails_to_notify"("p_content_id" bigint, "p_content_type" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."get_useful_votes_count_by_content_id"("p_content_type" "public"."useful_content_types", "p_content_ids" bigint[]) TO "anon";
GRANT ALL ON FUNCTION "public"."get_useful_votes_count_by_content_id"("p_content_type" "public"."useful_content_types", "p_content_ids" bigint[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_useful_votes_count_by_content_id"("p_content_type" "public"."useful_content_types", "p_content_ids" bigint[]) TO "service_role";

GRANT ALL ON FUNCTION "public"."get_user_email_by_id"("id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_email_by_id"("id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_email_by_id"("id" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."get_user_email_by_profile_id"("id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_email_by_profile_id"("id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_email_by_profile_id"("id" bigint) TO "service_role";

GRANT ALL ON FUNCTION "public"."get_user_email_by_username"("username" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_email_by_username"("username" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_email_by_username"("username" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."get_user_id_by_email"("email" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_id_by_email"("email" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_id_by_email"("email" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."get_user_projects"("username_param" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_projects"("username_param" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_projects"("username_param" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."get_user_questions"("username_param" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_questions"("username_param" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_questions"("username_param" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."get_user_research"("username_param" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_research"("username_param" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_research"("username_param" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."is_username_available"("username" "text", "exclude_profile_id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."is_username_available"("username" "text", "exclude_profile_id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_username_available"("username" "text", "exclude_profile_id" integer) TO "service_role";

GRANT ALL ON TABLE "public"."news" TO "anon";
GRANT ALL ON TABLE "public"."news" TO "authenticated";
GRANT ALL ON TABLE "public"."news" TO "service_role";

GRANT ALL ON FUNCTION "public"."news_search_fields"("public"."news") TO "anon";
GRANT ALL ON FUNCTION "public"."news_search_fields"("public"."news") TO "authenticated";
GRANT ALL ON FUNCTION "public"."news_search_fields"("public"."news") TO "service_role";

GRANT ALL ON TABLE "public"."questions" TO "anon";
GRANT ALL ON TABLE "public"."questions" TO "authenticated";
GRANT ALL ON TABLE "public"."questions" TO "service_role";

GRANT ALL ON FUNCTION "public"."questions_search_fields"("public"."questions") TO "anon";
GRANT ALL ON FUNCTION "public"."questions_search_fields"("public"."questions") TO "authenticated";
GRANT ALL ON FUNCTION "public"."questions_search_fields"("public"."questions") TO "service_role";

GRANT ALL ON FUNCTION "public"."read_secret"("secret_name" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."update_comment_count"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_comment_count"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_comment_count"() TO "service_role";

GRANT ALL ON FUNCTION "public"."update_project_tsvector"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_project_tsvector"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_project_tsvector"() TO "service_role";

GRANT ALL ON FUNCTION "public"."update_research_tsvector"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_research_tsvector"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_research_tsvector"() TO "service_role";

GRANT ALL ON TABLE "public"."banners" TO "anon";
GRANT ALL ON TABLE "public"."banners" TO "authenticated";
GRANT ALL ON TABLE "public"."banners" TO "service_role";

GRANT ALL ON SEQUENCE "public"."banners_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."banners_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."banners_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."categories" TO "anon";
GRANT ALL ON TABLE "public"."categories" TO "authenticated";
GRANT ALL ON TABLE "public"."categories" TO "service_role";

GRANT ALL ON SEQUENCE "public"."categories_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."categories_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."categories_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."comments" TO "anon";
GRANT ALL ON TABLE "public"."comments" TO "authenticated";
GRANT ALL ON TABLE "public"."comments" TO "service_role";

GRANT ALL ON SEQUENCE "public"."comments_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."comments_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."comments_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."file_downloads" TO "anon";
GRANT ALL ON TABLE "public"."file_downloads" TO "authenticated";
GRANT ALL ON TABLE "public"."file_downloads" TO "service_role";

GRANT ALL ON SEQUENCE "public"."file_downloads_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."file_downloads_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."file_downloads_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."map_pins" TO "anon";
GRANT ALL ON TABLE "public"."map_pins" TO "authenticated";
GRANT ALL ON TABLE "public"."map_pins" TO "service_role";

GRANT ALL ON SEQUENCE "public"."map_pins_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."map_pins_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."map_pins_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."map_settings" TO "anon";
GRANT ALL ON TABLE "public"."map_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."map_settings" TO "service_role";

GRANT ALL ON SEQUENCE "public"."map_settings_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."map_settings_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."map_settings_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."messages" TO "anon";
GRANT ALL ON TABLE "public"."messages" TO "authenticated";
GRANT ALL ON TABLE "public"."messages" TO "service_role";

GRANT ALL ON SEQUENCE "public"."messages_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."messages_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."messages_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."news_badges_relations" TO "anon";
GRANT ALL ON TABLE "public"."news_badges_relations" TO "authenticated";
GRANT ALL ON TABLE "public"."news_badges_relations" TO "service_role";

GRANT ALL ON SEQUENCE "public"."news_badges_relations_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."news_badges_relations_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."news_badges_relations_id_seq" TO "service_role";

GRANT ALL ON SEQUENCE "public"."news_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."news_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."news_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."notifications" TO "anon";
GRANT ALL ON TABLE "public"."notifications" TO "authenticated";
GRANT ALL ON TABLE "public"."notifications" TO "service_role";

GRANT ALL ON SEQUENCE "public"."notifications_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."notifications_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."notifications_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."notifications_preferences" TO "anon";
GRANT ALL ON TABLE "public"."notifications_preferences" TO "authenticated";
GRANT ALL ON TABLE "public"."notifications_preferences" TO "service_role";

GRANT ALL ON SEQUENCE "public"."notifications_preferences_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."notifications_preferences_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."notifications_preferences_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."profile_badges" TO "anon";
GRANT ALL ON TABLE "public"."profile_badges" TO "authenticated";
GRANT ALL ON TABLE "public"."profile_badges" TO "service_role";

GRANT ALL ON SEQUENCE "public"."profile_badges_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."profile_badges_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."profile_badges_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."profile_badges_relations" TO "anon";
GRANT ALL ON TABLE "public"."profile_badges_relations" TO "authenticated";
GRANT ALL ON TABLE "public"."profile_badges_relations" TO "service_role";

GRANT ALL ON SEQUENCE "public"."profile_badges_relations_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."profile_badges_relations_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."profile_badges_relations_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."profile_tags" TO "anon";
GRANT ALL ON TABLE "public"."profile_tags" TO "authenticated";
GRANT ALL ON TABLE "public"."profile_tags" TO "service_role";

GRANT ALL ON SEQUENCE "public"."profile_tags_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."profile_tags_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."profile_tags_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."profile_tags_relations" TO "anon";
GRANT ALL ON TABLE "public"."profile_tags_relations" TO "authenticated";
GRANT ALL ON TABLE "public"."profile_tags_relations" TO "service_role";

GRANT ALL ON SEQUENCE "public"."profile_tags_relations_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."profile_tags_relations_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."profile_tags_relations_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."profile_types" TO "anon";
GRANT ALL ON TABLE "public"."profile_types" TO "authenticated";
GRANT ALL ON TABLE "public"."profile_types" TO "service_role";

GRANT ALL ON SEQUENCE "public"."profile_types_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."profile_types_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."profile_types_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";

GRANT ALL ON SEQUENCE "public"."profiles_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."profiles_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."profiles_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."project_steps" TO "anon";
GRANT ALL ON TABLE "public"."project_steps" TO "authenticated";
GRANT ALL ON TABLE "public"."project_steps" TO "service_role";

GRANT ALL ON SEQUENCE "public"."project_steps_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."project_steps_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."project_steps_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."projects" TO "anon";
GRANT ALL ON TABLE "public"."projects" TO "authenticated";
GRANT ALL ON TABLE "public"."projects" TO "service_role";

GRANT ALL ON SEQUENCE "public"."projects_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."projects_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."projects_id_seq" TO "service_role";

GRANT ALL ON SEQUENCE "public"."questions_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."questions_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."questions_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."research" TO "anon";
GRANT ALL ON TABLE "public"."research" TO "authenticated";
GRANT ALL ON TABLE "public"."research" TO "service_role";

GRANT ALL ON SEQUENCE "public"."research_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."research_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."research_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."research_updates" TO "anon";
GRANT ALL ON TABLE "public"."research_updates" TO "authenticated";
GRANT ALL ON TABLE "public"."research_updates" TO "service_role";

GRANT ALL ON SEQUENCE "public"."research_updates_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."research_updates_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."research_updates_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."stripe_badge_products" TO "anon";
GRANT ALL ON TABLE "public"."stripe_badge_products" TO "authenticated";
GRANT ALL ON TABLE "public"."stripe_badge_products" TO "service_role";

GRANT ALL ON SEQUENCE "public"."stripe_badge_products_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."stripe_badge_products_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."stripe_badge_products_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."stripe_customers" TO "anon";
GRANT ALL ON TABLE "public"."stripe_customers" TO "authenticated";
GRANT ALL ON TABLE "public"."stripe_customers" TO "service_role";

GRANT ALL ON SEQUENCE "public"."stripe_customers_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."stripe_customers_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."stripe_customers_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."subscribers" TO "anon";
GRANT ALL ON TABLE "public"."subscribers" TO "authenticated";
GRANT ALL ON TABLE "public"."subscribers" TO "service_role";

GRANT ALL ON SEQUENCE "public"."subscribers_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."subscribers_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."subscribers_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."tags" TO "anon";
GRANT ALL ON TABLE "public"."tags" TO "authenticated";
GRANT ALL ON TABLE "public"."tags" TO "service_role";

GRANT ALL ON SEQUENCE "public"."tags_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."tags_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."tags_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."tenant_settings" TO "anon";
GRANT ALL ON TABLE "public"."tenant_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."tenant_settings" TO "service_role";

GRANT ALL ON SEQUENCE "public"."tenant_settings_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."tenant_settings_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."tenant_settings_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."upgrade_badge" TO "anon";
GRANT ALL ON TABLE "public"."upgrade_badge" TO "authenticated";
GRANT ALL ON TABLE "public"."upgrade_badge" TO "service_role";

GRANT ALL ON SEQUENCE "public"."upgrade_badge_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."upgrade_badge_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."upgrade_badge_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."useful_votes" TO "anon";
GRANT ALL ON TABLE "public"."useful_votes" TO "authenticated";
GRANT ALL ON TABLE "public"."useful_votes" TO "service_role";

GRANT ALL ON SEQUENCE "public"."useful_votes_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."useful_votes_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."useful_votes_id_seq" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

CREATE POLICY "tenant_isolation" ON "storage"."objects" USING ((("bucket_id" = (("current_setting"('request.headers'::"text", true))::"json" ->> 'x-tenant-id'::"text")) OR ("bucket_id" = ((("current_setting"('request.headers'::"text", true))::"json" ->> 'x-tenant-id'::"text") || '-documents'::"text"))));



