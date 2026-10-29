drop policy "tenant_isolation" on "public"."stripe_tier_config";

alter table "public"."poll_votes" drop constraint "poll_vote_unique";

alter table "public"."notifications" drop constraint "notifications_triggered_by_id_fkey";

alter type "public"."notification_action_types" rename to "notification_action_types__old_version_to_be_dropped";

create type "public"."notification_action_types" as enum ('newComment', 'newContent');

alter type "public"."notification_content_types" rename to "notification_content_types__old_version_to_be_dropped";

create type "public"."notification_content_types" as enum ('news', 'research', 'researchUpdate', 'library', 'questions', 'comment', 'reply');

alter type "public"."notification_source_content_type" rename to "notification_source_content_type__old_version_to_be_dropped";

create type "public"."notification_source_content_type" as enum ('news', 'research', 'researchUpdate', 'library', 'questions');

alter table "public"."notifications" alter column action_type type "public"."notification_action_types" using action_type::text::"public"."notification_action_types";

alter table "public"."notifications" alter column content_type type "public"."notification_content_types" using content_type::text::"public"."notification_content_types";

drop type "public"."notification_action_types__old_version_to_be_dropped";

drop type "public"."notification_content_types__old_version_to_be_dropped";

drop type "public"."notification_source_content_type__old_version_to_be_dropped";

alter table "public"."notifications" alter column "triggered_by_id" set not null;

alter table "public"."profile_badges" add column "is_disabled" boolean not null default false;

alter table "public"."notifications" add constraint "notifications_triggered_by_id_fkey" FOREIGN KEY (triggered_by_id) REFERENCES public.profiles(id) ON UPDATE CASCADE not valid;

alter table "public"."notifications" validate constraint "notifications_triggered_by_id_fkey";

set check_function_bodies = off;

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
$function$
;

grant delete on table "public"."poll_options" to "anon";

grant insert on table "public"."poll_options" to "anon";

grant update on table "public"."poll_options" to "anon";

grant delete on table "public"."poll_votes" to "anon";

grant insert on table "public"."poll_votes" to "anon";

grant update on table "public"."poll_votes" to "anon";

grant delete on table "public"."polls" to "anon";

grant insert on table "public"."polls" to "anon";

grant update on table "public"."polls" to "anon";

grant delete on table "public"."remakes" to "anon";

grant insert on table "public"."remakes" to "anon";

grant update on table "public"."remakes" to "anon";


  create policy "tenant_isolation"
  on "public"."stripe_tier_config"
  as permissive
  for all
  to public
using ((tenant_id = ((( SELECT current_setting('request.headers'::text, true) AS current_setting))::json ->> 'x-tenant-id'::text)));


drop policy "tenant_isolation" on "storage"."objects";


