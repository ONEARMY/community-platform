CREATE OR REPLACE FUNCTION public.get_questions(search_query text DEFAULT NULL::text, category_id bigint DEFAULT NULL::bigint, sort_by text DEFAULT 'Newest'::text, limit_val integer DEFAULT 20, offset_val integer DEFAULT 0)
 RETURNS TABLE(id bigint, created_at timestamp with time zone, created_by bigint, modified_at timestamp with time zone, published_at timestamp with time zone, description text, slug text, category json, tags bigint[], title text, total_views bigint, is_draft boolean, comment_count bigint, images json[], author json, accepted_answer_id bigint, accepted_answer_date timestamp with time zone)
 LANGUAGE plpgsql
 SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
  ts_query tsquery;
  simple_ts_query tsquery;
  tsquery_expr text;
BEGIN
  search_query := NULLIF(trim(search_query), '');

  IF search_query IS NOT NULL THEN
    tsquery_expr := array_to_string(
      ARRAY(
        SELECT quote_literal(word) || ':*'
        FROM regexp_split_to_table(lower(search_query), '[^a-z0-9_-]+') AS word
        WHERE word ~ '[a-z0-9]'
      ),
      ' & '
    );

    IF tsquery_expr != '' THEN
      ts_query := to_tsquery('english', tsquery_expr);
      simple_ts_query := to_tsquery('simple', tsquery_expr);
    END IF;
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
     (ts_query IS NOT NULL AND numnode(ts_query) > 0 AND q.fts @@ ts_query) OR
     (simple_ts_query IS NOT NULL AND numnode(simple_ts_query) > 0 AND
       (setweight(to_tsvector('simple', q.title), 'A') || setweight(to_tsvector('simple', q.description), 'B')) @@ simple_ts_query) OR
     prof.username ILIKE '%' || search_query || '%'
    ) AND
    (category_id IS NULL OR q.category = category_id) AND
    q.is_draft = FALSE AND
    (q.deleted IS NULL OR q.deleted = FALSE)
  ORDER BY
    CASE
      WHEN search_query IS NOT NULL THEN
        COALESCE(
          CASE WHEN ts_query IS NOT NULL AND numnode(ts_query) > 0 THEN ts_rank_cd(q.fts, ts_query) END,
          0
        ) +
        COALESCE(
          CASE
            WHEN simple_ts_query IS NOT NULL AND numnode(simple_ts_query) > 0 THEN
              ts_rank_cd(
                setweight(to_tsvector('simple', q.title), 'A') || setweight(to_tsvector('simple', q.description), 'B'),
                simple_ts_query
              )
          END,
          0
        )
    END DESC NULLS LAST,
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
$function$
;

CREATE OR REPLACE FUNCTION public.get_questions_count(search_query text DEFAULT NULL::text, category_id integer DEFAULT NULL::integer)
 RETURNS integer
 LANGUAGE plpgsql
 SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
  ts_query tsquery;
  simple_ts_query tsquery;
  tsquery_expr text;
BEGIN
  search_query := NULLIF(trim(search_query), '');

  IF search_query IS NOT NULL THEN
    tsquery_expr := array_to_string(
      ARRAY(
        SELECT quote_literal(word) || ':*'
        FROM regexp_split_to_table(lower(search_query), '[^a-z0-9_-]+') AS word
        WHERE word ~ '[a-z0-9]'
      ),
      ' & '
    );

    IF tsquery_expr != '' THEN
      ts_query := to_tsquery('english', tsquery_expr);
      simple_ts_query := to_tsquery('simple', tsquery_expr);
    END IF;
  END IF;

  RETURN (
    SELECT COUNT(*)
    FROM questions q
    INNER JOIN profiles prof ON prof.id = q.created_by
    WHERE
      (search_query IS NULL OR
       (ts_query IS NOT NULL AND numnode(ts_query) > 0 AND q.fts @@ ts_query) OR
       (simple_ts_query IS NOT NULL AND numnode(simple_ts_query) > 0 AND
         (setweight(to_tsvector('simple', q.title), 'A') || setweight(to_tsvector('simple', q.description), 'B')) @@ simple_ts_query) OR
       prof.username ILIKE '%' || search_query || '%'
      ) AND
      (category_id IS NULL OR q.category = category_id) AND
      q.is_draft = FALSE AND
      (q.deleted IS NULL OR q.deleted = FALSE)
  );
END;
$function$
;
