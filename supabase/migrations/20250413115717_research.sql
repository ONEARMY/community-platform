create type "public"."research_status" as enum ('in-progress', 'complete', 'archived');

create table "public"."research" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "modified_at" timestamp with time zone default now(),
    "title" text not null,
    "slug" text not null,
    "description" text not null,
    "category" bigint,
    "created_by" bigint,
    "tags" text[],
    "deleted" boolean,
    "total_views" integer,
    "total_useful" integer,
    "previous_slugs" text[],
    "status" research_status,
    "is_draft" boolean,
    "tenant_id" text not null,
    "fts" tsvector,
    "collaborators" text[],
    "image" json
);


alter table "public"."research" enable row level security;

create table "public"."research_updates" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text),
    "research_id" bigint not null,
    "title" text not null,
    "description" text not null,
    "images" json[],
    "files" json[],
    "video_url" text,
    "is_draft" boolean,
    "comment_count" integer,
    "tenant_id" text not null,
    "modified_at" timestamp with time zone default (now() AT TIME ZONE 'utc'::text),
    "deleted" boolean,
    "file_link" text,
    "file_download_count" integer
);


alter table "public"."research_updates" enable row level security;

CREATE INDEX research_fts_idx ON public.research USING gin (fts);

CREATE UNIQUE INDEX research_pkey ON public.research USING btree (id);

CREATE UNIQUE INDEX research_update_pkey ON public.research_updates USING btree (id);

alter table "public"."research" add constraint "research_pkey" PRIMARY KEY using index "research_pkey";

alter table "public"."research_updates" add constraint "research_update_pkey" PRIMARY KEY using index "research_update_pkey";

alter table "public"."research" add constraint "research_category_fkey" FOREIGN KEY (category) REFERENCES categories(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."research" validate constraint "research_category_fkey";

alter table "public"."research" add constraint "research_created_by_fkey" FOREIGN KEY (created_by) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."research" validate constraint "research_created_by_fkey";

alter table "public"."research_updates" add constraint "research_update_research_id_fkey" FOREIGN KEY (research_id) REFERENCES research(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."research_updates" validate constraint "research_update_research_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.combined_research_search_fields(research_id_param bigint)
 RETURNS text
 LANGUAGE sql
AS $function$
  SELECT
    (SELECT r.title || ' ' || r.description FROM research r WHERE r.id = research_id_param) || ' ' ||
    COALESCE(string_agg(ru.title || ' ' || ru.description, ' '), '')
  FROM research_updates ru
  WHERE ru.research_id = research_id_param;
$function$
;

CREATE OR REPLACE FUNCTION public.get_research(search_query text DEFAULT NULL::text, category_id bigint DEFAULT NULL::bigint, research_status research_status DEFAULT NULL::research_status, sort_by text DEFAULT 'Newest'::text, limit_val integer DEFAULT 10, offset_val integer DEFAULT 0)
 RETURNS TABLE(id bigint, created_at timestamp with time zone, created_by bigint, modified_at timestamp with time zone, description text, slug text, image json, category json, tags text[], title text, total_views integer, author json, update_count bigint, comment_count bigint)
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  SELECT
    r.id,
    r.created_at,
    r.created_by,
    r.modified_at,
    r.description,
    r.slug,
    r.image,
    (SELECT json_build_object('id', c.id, 'name', c.name) FROM categories c WHERE c.id = r.category) AS category,
    r.tags,
    r.title,
    r.total_views,
    (SELECT json_build_object('id', p.id, 'display_name', p.display_name, 'username', p.username, 'is_verified', p.is_verified, 'country', p.country) FROM profiles p WHERE p.id = r.created_by) AS author,
    (SELECT COUNT(*) FROM research_updates ru WHERE ru.research_id = r.id AND (ru.is_draft IS NULL OR ru.is_draft = FALSE)
          AND (ru.deleted IS NULL OR ru.deleted = FALSE)) AS update_count,
    (SELECT COALESCE(SUM(ru.comment_count), 0) FROM research_updates ru WHERE ru.research_id = r.id AND (ru.is_draft IS NULL OR ru.is_draft = FALSE)
          AND (ru.deleted IS NULL OR ru.deleted = FALSE)) AS comment_count
  FROM research r
  WHERE
    (search_query IS NULL OR r.fts @@ to_tsquery('english', search_query)) AND
    (category_id IS NULL OR r.category = category_id) AND
    (research_status IS NULL OR r.status = research_status) AND
    (r.is_draft IS NULL OR r.is_draft = FALSE) AND
    (r.deleted IS NULL OR r.deleted = FALSE)
  ORDER BY
    CASE sort_by
      WHEN 'Newest' THEN extract(epoch from r.created_at)
      WHEN 'LatestUpdated' THEN extract(epoch from r.modified_at)
      WHEN 'MostComments' THEN 
        (SELECT COALESCE(SUM(ru.comment_count), 0) FROM research_updates ru WHERE ru.research_id = r.id AND (ru.is_draft IS NULL OR ru.is_draft = FALSE))
      WHEN 'MostUpdates' THEN 
        (SELECT COUNT(*) FROM research_updates ru WHERE ru.research_id = r.id AND (ru.is_draft IS NULL OR ru.is_draft = FALSE)
          AND (ru.deleted IS NULL OR ru.deleted = FALSE))
      ELSE 0
    END DESC NULLS LAST,
    r.created_at DESC
  LIMIT limit_val OFFSET offset_val;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_research_tsvector()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.comment_authors_by_source_id(source_id_input bigint)
 RETURNS SETOF text
 LANGUAGE sql
AS $function$
  SELECT DISTINCT (p.username)
  FROM comments c
  INNER JOIN profiles p
  ON c.created_by = p.id
  WHERE c.source_id = source_id_input
$function$
;

CREATE OR REPLACE FUNCTION public.get_useful_votes_count_by_content_id(p_content_type content_types, p_content_ids bigint[])
 RETURNS TABLE(content_id bigint, count bigint)
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  SELECT v.content_id, COUNT(*) as count
  FROM public.useful_votes v
  WHERE content_type = p_content_type
  AND v.content_id = ANY(p_content_ids)
  GROUP BY v.content_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_user_email_by_id(id uuid)
 RETURNS TABLE(email character varying)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY SELECT au.email FROM auth.users au WHERE au.id = $1;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_user_email_by_username(username text)
 RETURNS TABLE(email character varying)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY SELECT au.email FROM auth.users au WHERE au.raw_user_meta_data->>'username' = $1;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_user_id_by_email(email text)
 RETURNS TABLE(id uuid)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
  RETURN QUERY SELECT au.id FROM auth.users au WHERE au.email = $1;
END;$function$
;

CREATE OR REPLACE FUNCTION public.is_username_available(username text)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
AS $function$
  SELECT NOT EXISTS (SELECT 1 FROM profiles WHERE username = $1);
$function$
;

CREATE OR REPLACE FUNCTION public.news_search_fields(news)
 RETURNS text
 LANGUAGE sql
AS $function$
  SELECT $1.title || ' ' || $1.body;
$function$
;

CREATE OR REPLACE FUNCTION public.questions_search_fields(questions)
 RETURNS text
 LANGUAGE sql
AS $function$
  SELECT $1.title || ' ' || $1.description;
$function$
;

CREATE OR REPLACE FUNCTION public.update_comment_count()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
  IF (TG_OP = 'INSERT') THEN
    IF NEW.source_type IS NOT NULL AND NEW.source_id IS NOT NULL THEN
      IF NEW.source_type = 'questions' THEN
        UPDATE questions SET comment_count = comment_count + 1
        WHERE id = NEW.source_id;
      ELSIF NEW.source_type = 'research_update' THEN
        UPDATE research_updates SET comment_count = comment_count + 1
        WHERE id = NEW.source_id;
      ELSIF NEW.source_type = 'news' THEN
        UPDATE news SET comment_count = comment_count + 1
        WHERE id = NEW.source_id;
      ELSIF NEW.source_type = 'projects' THEN
        UPDATE projects SET comment_count = comment_count + 1
        WHERE id = NEW.source_id;
      END IF;
    ELSE
      RAISE NOTICE 'Warning: source_type or source_id is NULL';
    END IF;

  ELSIF (TG_OP = 'DELETE') THEN
    IF OLD.source_type IS NOT NULL AND OLD.source_id IS NOT NULL THEN
      IF OLD.source_type = 'questions' THEN
        UPDATE questions SET comment_count = comment_count - 1
        WHERE id = OLD.source_id;
      ELSIF OLD.source_type = 'research_update' THEN
        UPDATE research_updates SET comment_count = comment_count - 1
        WHERE id = OLD.source_id;
      ELSIF OLD.source_type = 'news' THEN
        UPDATE news SET comment_count = comment_count - 1
        WHERE id = OLD.source_id;
      ELSIF OLD.source_type = 'projects' THEN
        UPDATE projects SET comment_count = comment_count - 1
        WHERE id = OLD.source_id;
      END IF;
    ELSE
      RAISE NOTICE 'Warning: OLD.source_type or OLD.source_id is NULL';
    END IF;
  END IF;

  -- Explicit return for the trigger function
  RETURN NULL;
END;$function$
;

grant delete on table "public"."research" to "anon";

grant insert on table "public"."research" to "anon";

grant references on table "public"."research" to "anon";

grant select on table "public"."research" to "anon";

grant trigger on table "public"."research" to "anon";

grant truncate on table "public"."research" to "anon";

grant update on table "public"."research" to "anon";

grant delete on table "public"."research" to "authenticated";

grant insert on table "public"."research" to "authenticated";

grant references on table "public"."research" to "authenticated";

grant select on table "public"."research" to "authenticated";

grant trigger on table "public"."research" to "authenticated";

grant truncate on table "public"."research" to "authenticated";

grant update on table "public"."research" to "authenticated";

grant delete on table "public"."research" to "service_role";

grant insert on table "public"."research" to "service_role";

grant references on table "public"."research" to "service_role";

grant select on table "public"."research" to "service_role";

grant trigger on table "public"."research" to "service_role";

grant truncate on table "public"."research" to "service_role";

grant update on table "public"."research" to "service_role";

grant delete on table "public"."research_updates" to "anon";

grant insert on table "public"."research_updates" to "anon";

grant references on table "public"."research_updates" to "anon";

grant select on table "public"."research_updates" to "anon";

grant trigger on table "public"."research_updates" to "anon";

grant truncate on table "public"."research_updates" to "anon";

grant update on table "public"."research_updates" to "anon";

grant delete on table "public"."research_updates" to "authenticated";

grant insert on table "public"."research_updates" to "authenticated";

grant references on table "public"."research_updates" to "authenticated";

grant select on table "public"."research_updates" to "authenticated";

grant trigger on table "public"."research_updates" to "authenticated";

grant truncate on table "public"."research_updates" to "authenticated";

grant update on table "public"."research_updates" to "authenticated";

grant delete on table "public"."research_updates" to "service_role";

grant insert on table "public"."research_updates" to "service_role";

grant references on table "public"."research_updates" to "service_role";

grant select on table "public"."research_updates" to "service_role";

grant trigger on table "public"."research_updates" to "service_role";

grant truncate on table "public"."research_updates" to "service_role";

grant update on table "public"."research_updates" to "service_role";

create policy "tenant_isolation"
on "public"."research"
as permissive
for all
to public
using ((tenant_id = ((current_setting('request.headers'::text, true))::json ->> 'x-tenant-id'::text)));


create policy "tenant_isolation"
on "public"."research_updates"
as permissive
for all
to public
using ((tenant_id = ((current_setting('request.headers'::text, true))::json ->> 'x-tenant-id'::text)));


CREATE TRIGGER research_text_trigger AFTER INSERT OR UPDATE OF title, description ON public.research FOR EACH ROW EXECUTE FUNCTION update_research_tsvector();

CREATE TRIGGER research_update_trigger AFTER INSERT OR DELETE OR UPDATE OF title, description ON public.research_updates FOR EACH ROW EXECUTE FUNCTION update_research_tsvector();


