set check_function_bodies = off;

ALTER TABLE public.questions
ADD COLUMN accepted_answer_id bigint REFERENCES public.comments(id) ON DELETE SET NULL,
ADD COLUMN accepted_answer_date timestamp with time zone;

CREATE INDEX questions_accepted_answer_id_idx ON public.questions USING btree (accepted_answer_id);

-- Drop old function before creating new one with different return type
DROP FUNCTION IF EXISTS public.get_questions(text, bigint, text, integer, integer);

-- Update get_questions function to return accepted_answer_id and accepted_answer_date
CREATE OR REPLACE FUNCTION public.get_questions(search_query text DEFAULT NULL::text, category_id bigint DEFAULT NULL::bigint, sort_by text DEFAULT 'Newest'::text, limit_val integer DEFAULT 20, offset_val integer DEFAULT 0)
 RETURNS TABLE(id bigint, created_at timestamp with time zone, created_by bigint, modified_at timestamp with time zone, published_at timestamp with time zone, description text, slug text, category json, tags bigint[], title text, total_views bigint, is_draft boolean, comment_count bigint, images json[], author json, accepted_answer_id bigint, accepted_answer_date timestamp with time zone)
 LANGUAGE plpgsql
 SET search_path TO 'public', 'pg_temp'
AS $function$
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
    ) FROM profiles p WHERE p.id = q.created_by) AS author,
    q.accepted_answer_id,
    q.accepted_answer_date
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
$function$;
