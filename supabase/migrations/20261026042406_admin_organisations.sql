set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_admin_organisations(p_limit integer, p_offset integer, p_moderation text DEFAULT NULL::text, p_search text DEFAULT NULL::text)
 RETURNS TABLE(id bigint, username text, display_name text, about text, type_name text, moderation text, moderation_feedback text, created_at timestamp with time zone, is_map_pin boolean, total_count bigint)
 LANGUAGE plpgsql
 STABLE
 SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
  RETURN QUERY
  SELECT
    o.id,
    o.username,
    o.display_name,
    o.about,
    o.type_name,
    o.moderation,
    o.moderation_feedback,
    o.created_at,
    o.is_map_pin,
    COUNT(*) OVER ()
  FROM (
    SELECT
      p.id,
      p.username,
      p.display_name,
      p.about,
      pt.display_name AS type_name,
      COALESCE(p.moderation, mp.moderation) AS moderation,
      CASE WHEN p.moderation IS NULL THEN mp.moderation_feedback ELSE p.moderation_feedback END AS moderation_feedback,
      p.created_at,
      p.moderation IS NULL AS is_map_pin
    FROM profiles p
    LEFT JOIN profile_types pt ON pt.id = p.profile_type
    LEFT JOIN LATERAL (
      SELECT m.moderation, m.moderation_feedback
      FROM map_pins m
      WHERE m.profile_id = p.id
      ORDER BY m.created_at DESC
      LIMIT 1
    ) mp ON true
    WHERE p.moderation IS NOT NULL
       OR (pt.is_space AND mp.moderation IS NOT NULL)
  ) o
  WHERE (p_moderation IS NULL OR o.moderation = p_moderation)
    AND (p_search IS NULL OR o.display_name ILIKE '%' || p_search || '%' OR o.username ILIKE '%' || p_search || '%')
  ORDER BY o.created_at DESC, o.id DESC
  LIMIT p_limit OFFSET p_offset;
END;
$function$
;
