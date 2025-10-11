drop function if exists "public"."comment_authors_by_source_id_legacy"(source_id_legacy_input text);

CREATE OR REPLACE FUNCTION "public"."comment_authors_by_source_id"("source_id_input" bigint) RETURNS SETOF "text"
    LANGUAGE "sql"
    SET search_path = public, pg_temp
    AS $$
  SELECT DISTINCT (p.username)
  FROM comments c
  INNER JOIN profiles p
  ON c.created_by = p.id
  WHERE c.source_id = source_id_input
$$;

CREATE OR REPLACE FUNCTION "public"."get_comments_with_votes"("p_source_type" "text", "p_source_id" bigint, "p_current_user_id" bigint DEFAULT NULL::bigint) RETURNS TABLE("id" bigint, "comment" "text", "created_at" timestamp with time zone, "modified_at" timestamp with time zone, "deleted" boolean, "source_id" bigint, "source_type" "text", "parent_id" bigint, "created_by" bigint, "profile" "json", "vote_count" bigint, "has_voted" boolean)
    LANGUAGE "plpgsql"
    SET search_path = public, pg_temp
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

CREATE OR REPLACE FUNCTION "public"."update_comment_count"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET search_path = public, pg_temp
    AS $$BEGIN
  IF (TG_OP = 'INSERT') THEN
    IF NEW.source_type IS NOT NULL AND NEW.source_id IS NOT NULL AND (NEW.deleted IS NULL OR NEW.deleted = false) THEN
      IF NEW.source_type = 'questions' THEN
        UPDATE questions SET comment_count = COALESCE(comment_count, 0) + 1
        WHERE id = NEW.source_id;
      ELSIF NEW.source_type = 'research_update' THEN
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
        ELSIF OLD.source_type = 'research_update' THEN
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
        ELSIF NEW.source_type = 'research_update' THEN
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
      ELSIF OLD.source_type = 'research_update' THEN
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

CREATE OR REPLACE FUNCTION "public"."get_user_email_by_id"("id" "uuid") RETURNS TABLE("email" character varying)
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET search_path = public, pg_temp
    AS $_$
BEGIN
  RETURN QUERY SELECT au.email FROM auth.users au WHERE au.id = $1;
END;
$_$;

CREATE OR REPLACE FUNCTION "public"."get_user_email_by_profile_id"("id" bigint) RETURNS TABLE("email" character varying)
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET search_path = public, pg_temp
    AS $_$
BEGIN
  RETURN QUERY SELECT au.email FROM auth.users au inner join public.profiles p on au.id = p.auth_id WHERE p.id = $1;
END;
$_$;

CREATE OR REPLACE FUNCTION "public"."get_user_email_by_username"("username" "text") RETURNS TABLE("email" character varying)
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET search_path = public, pg_temp
    AS $_$
BEGIN
  RETURN QUERY SELECT au.email FROM auth.users au WHERE au.raw_user_meta_data->>'username' = $1;
END;
$_$;

CREATE OR REPLACE FUNCTION "public"."get_user_id_by_email"("email" "text") RETURNS TABLE("id" "uuid")
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET search_path = public, pg_temp
    AS $_$BEGIN
  RETURN QUERY SELECT au.id FROM auth.users au WHERE au.email = $1;
END;$_$;


CREATE OR REPLACE FUNCTION "public"."news_search_fields"("public"."news") RETURNS "text"
    LANGUAGE "sql"
    SET search_path = public, pg_temp
    AS $_$
  SELECT $1.title || ' ' || $1.body;
$_$;

CREATE OR REPLACE FUNCTION "public"."is_username_available"("username" "text") RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET search_path = public, pg_temp
    AS $_$
  SELECT NOT EXISTS (SELECT 1 FROM profiles WHERE username = $1);
$_$;


CREATE OR REPLACE FUNCTION "public"."combined_project_search_fields"("project_id_param" bigint) RETURNS "text"
    LANGUAGE "sql"
    SET search_path = public, pg_temp
    AS $$
  SELECT
    (SELECT p.title || ' ' || p.description FROM projects p WHERE p.id = project_id_param) || ' ' ||
    COALESCE(string_agg(ps.title || ' ' || ps.description, ' '), '')
  FROM project_steps ps
  WHERE ps.project_id = project_id_param;
$$;

CREATE OR REPLACE FUNCTION "public"."get_projects"("search_query" "text" DEFAULT NULL::"text", "category_id" bigint DEFAULT NULL::bigint, "sort_by" "text" DEFAULT 'Newest'::"text", "limit_val" integer DEFAULT 12, "offset_val" integer DEFAULT 0, "current_username" "text" DEFAULT NULL::"text") RETURNS TABLE("id" bigint, "created_at" timestamp with time zone, "created_by" bigint, "modified_at" timestamp with time zone, "description" "text", "slug" "text", "cover_image" "json", "category" "json", "tags" "text"[], "title" "text", "moderation" "text", "total_views" bigint, "author" "json", "comment_count" integer)
    LANGUAGE "plpgsql"
    SET search_path = public, pg_temp
    AS $$DECLARE
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
            ELSE 0
        END DESC NULLS LAST,
        CASE
            WHEN sort_by = 'LeastComments' THEN p.comment_count
        END ASC NULLS LAST,
        p.created_at DESC
    LIMIT limit_val OFFSET offset_val;
END;$$;

CREATE OR REPLACE FUNCTION "public"."get_projects_count"("search_query" "text" DEFAULT NULL::"text", "category_id" integer DEFAULT NULL::integer, "current_username" "text" DEFAULT NULL::"text") RETURNS integer
    LANGUAGE "plpgsql"
    SET search_path = public, pg_temp
    AS $$
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
      (category_id IS NULL OR p.category = category_id) AND
      (p.is_draft IS NULL OR p.is_draft = FALSE) AND
      (p.deleted IS NULL OR p.deleted = FALSE) AND
      (p.moderation = 'accepted' OR prof.username = current_username)
  );
END;
$$;

CREATE OR REPLACE FUNCTION "public"."get_user_projects"("username_param" "text") RETURNS TABLE("id" bigint, "title" "text", "slug" "text", "total_useful" bigint)
    LANGUAGE "plpgsql"
    SET search_path = public, pg_temp
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pr.id,
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

CREATE OR REPLACE FUNCTION "public"."update_project_tsvector"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET search_path = public, pg_temp
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


CREATE OR REPLACE FUNCTION "public"."get_user_questions"("username_param" "text") RETURNS TABLE("id" bigint, "title" "text", "slug" "text", "total_useful" bigint)
    LANGUAGE "plpgsql"
    SET search_path = public, pg_temp
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    q.id,
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

CREATE OR REPLACE FUNCTION "public"."questions_search_fields"("public"."questions") RETURNS "text"
    LANGUAGE "sql"
    SET search_path = public, pg_temp
    AS $_$
  SELECT $1.title || ' ' || $1.description;
$_$;


CREATE OR REPLACE FUNCTION "public"."combined_research_search_fields"("research_id_param" bigint) RETURNS "text"
    LANGUAGE "sql"
    SET search_path = public, pg_temp
    AS $$
  SELECT
    (SELECT r.title || ' ' || r.description FROM research r WHERE r.id = research_id_param) || ' ' ||
    COALESCE(string_agg(ru.title || ' ' || ru.description, ' '), '')
  FROM research_updates ru
  WHERE ru.research_id = research_id_param;
$$;

CREATE OR REPLACE FUNCTION "public"."get_research"("search_query" "text" DEFAULT NULL::"text", "category_id" bigint DEFAULT NULL::bigint, "research_status" "public"."research_status" DEFAULT NULL::"public"."research_status", "sort_by" "text" DEFAULT 'Newest'::"text", "limit_val" integer DEFAULT 10, "offset_val" integer DEFAULT 0) RETURNS TABLE("id" bigint, "created_at" timestamp with time zone, "created_by" bigint, "modified_at" timestamp with time zone, "description" "text", "slug" "text", "image" "json", "status" "public"."research_status", "category" "json", "tags" "text"[], "title" "text", "total_views" integer, "author" "json", "update_count" bigint, "comment_count" bigint)
    LANGUAGE "plpgsql"
    SET search_path = public, pg_temp
    AS $$
DECLARE
  ts_query tsquery;
BEGIN
  -- Parse the search query once if provided
  IF search_query IS NOT NULL THEN
    ts_query := to_tsquery('english', search_query);
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
          AND (ru.deleted IS NULL OR ru.deleted = FALSE)) AS comment_count
  FROM research r
  WHERE
    (search_query IS NULL OR r.fts @@ ts_query) AND
    (category_id IS NULL OR r.category = category_id) AND
    (research_status IS NULL OR r.status = research_status) AND
    (r.is_draft IS NULL OR r.is_draft = FALSE) AND
    (r.deleted IS NULL OR r.deleted = FALSE)
  ORDER BY
    -- Add relevance ranking when search query is provided
    CASE WHEN search_query IS NOT NULL THEN ts_rank_cd(r.fts, ts_query) END DESC NULLS LAST,
    CASE
      WHEN sort_by = 'Newest' THEN extract(epoch from r.created_at)
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
    r.created_at DESC
  LIMIT limit_val OFFSET offset_val;
END;
$$;

CREATE OR REPLACE FUNCTION "public"."get_research_count"("search_query" "text" DEFAULT NULL::"text", "category_id" integer DEFAULT NULL::integer, "research_status" "public"."research_status" DEFAULT NULL::"public"."research_status") RETURNS integer
    LANGUAGE "plpgsql"
    SET search_path = public, pg_temp
    AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)
    FROM research r
    WHERE
      (search_query IS NULL OR r.fts @@ to_tsquery('english', search_query)) AND
      (category_id IS NULL OR r.category = category_id) AND
      (research_status IS NULL OR r.status = research_status) AND
      (r.is_draft IS NULL OR r.is_draft = FALSE) AND
      (r.deleted IS NULL OR r.deleted = FALSE)
  );
END;
$$;

CREATE OR REPLACE FUNCTION "public"."get_user_research"("username_param" "text") RETURNS TABLE("id" bigint, "title" "text", "slug" "text", "total_useful" bigint)
    LANGUAGE "plpgsql"
    SET search_path = public, pg_temp
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id,
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

CREATE OR REPLACE FUNCTION "public"."update_research_tsvector"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET search_path = public, pg_temp
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


CREATE OR REPLACE FUNCTION "public"."get_author_vote_counts"("author_id" bigint) RETURNS TABLE("content_type" "text", "vote_count" bigint)
    LANGUAGE "sql" STABLE
    SET search_path = public, pg_temp
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

CREATE OR REPLACE FUNCTION "public"."get_useful_votes_count_by_content_id"("p_content_type" "public"."useful_content_types", "p_content_ids" bigint[]) RETURNS TABLE("content_id" bigint, "count" bigint)
    LANGUAGE "plpgsql"
    SET search_path = public, pg_temp
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
