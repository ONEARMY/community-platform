DROP FUNCTION IF EXISTS public.get_useful_votes_count_by_content_id(p_content_type content_types, p_content_ids bigint[]);

CREATE TYPE "public"."useful_content_types" AS ENUM ('questions', 'projects', 'research', 'news', 'comments');

ALTER TABLE "public"."useful_votes" 
ALTER COLUMN content_type TYPE "public"."useful_content_types" 
USING content_type::text::"public"."useful_content_types";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_useful_votes_count_by_content_id(
    p_content_type public.useful_content_types, 
    p_content_ids bigint[]
)
RETURNS TABLE(content_id bigint, count bigint)
LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  SELECT v.content_id, COUNT(*) as count
  FROM public.useful_votes v
  WHERE v.content_type = p_content_type
    AND v.content_id = ANY(p_content_ids)
  GROUP BY v.content_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_comments_with_votes(p_source_type text, p_source_id bigint, p_current_user_id bigint DEFAULT NULL::bigint)
RETURNS TABLE(id bigint, comment text, created_at timestamp with time zone, modified_at timestamp with time zone, deleted boolean, source_id bigint, source_type text, parent_id bigint, created_by bigint, profile json, vote_count bigint, has_voted boolean)
LANGUAGE plpgsql AS $function$
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
$function$;

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
        SELECT 1 FROM questions q WHERE q.id = uv.content_id AND q.created_by = author_id
    ))
    OR (uv.content_type = 'projects' AND EXISTS (
        SELECT 1 FROM projects p WHERE p.id = uv.content_id AND p.created_by = author_id
    ))
    OR (uv.content_type = 'news' AND EXISTS (
        SELECT 1 FROM news n WHERE n.id = uv.content_id AND n.created_by = author_id
    ))
    OR (uv.content_type = 'research' AND EXISTS (
        SELECT 1 FROM research r WHERE r.id = uv.content_id AND r.created_by = author_id
    ))
    OR (uv.content_type = 'comments' AND EXISTS (
        SELECT 1 FROM comments c WHERE c.id = uv.content_id AND c.created_by = author_id
    ))
    GROUP BY uv.content_type
    ORDER BY vote_count DESC;
$function$
;