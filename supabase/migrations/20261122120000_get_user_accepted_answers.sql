CREATE OR REPLACE FUNCTION "public"."get_user_accepted_answers"("username_param" "text") RETURNS TABLE("id" bigint, "accepted_answer_id" bigint, "comment_count" bigint, "images" "json"[], "title" "text", "slug" "text", "total_useful" bigint)
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    q.id,
    q.accepted_answer_id,
    q.comment_count,
    q.images,
    q.title,
    q.slug,
    COALESCE(COUNT(uv.id), 0)::BIGINT AS total_useful
  FROM questions q
  INNER JOIN comments c ON c.id = q.accepted_answer_id
  INNER JOIN profiles p ON p.id = c.created_by
  LEFT JOIN useful_votes uv ON uv.content_id = q.id AND uv.content_type = 'questions'
  WHERE p.username = username_param
  AND (q.deleted IS NULL OR q.deleted = FALSE)
  AND (c.deleted IS NULL OR c.deleted = FALSE)
  GROUP BY q.id;
END;
$$;

ALTER FUNCTION "public"."get_user_accepted_answers"("username_param" "text") OWNER TO "postgres";

GRANT ALL ON FUNCTION "public"."get_user_accepted_answers"("username_param" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_accepted_answers"("username_param" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_accepted_answers"("username_param" "text") TO "service_role";
