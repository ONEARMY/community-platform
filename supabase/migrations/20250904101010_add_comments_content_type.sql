DROP FUNCTION public.get_useful_votes_count_by_content_id(p_content_type content_types, p_content_ids bigint[]);

alter type "public"."content_types" rename to "content_types__old_version_to_be_dropped";

create type "public"."content_types" as enum ('questions', 'projects', 'research', 'news', 'comment');

alter table "public"."categories" alter column type type "public"."content_types" using type::text::"public"."content_types";
alter table "public"."useful_votes" alter column content_type type "public"."content_types" using content_type::text::"public"."content_types";

drop type "public"."content_types__old_version_to_be_dropped";

CREATE OR REPLACE FUNCTION public.get_useful_votes_count_by_content_id(p_content_type public.content_types, p_content_ids bigint[])
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