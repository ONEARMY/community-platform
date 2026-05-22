set check_function_bodies = off;

-- RPC function to get all profiles with any badge, including email from auth.users
CREATE OR REPLACE FUNCTION get_profiles_with_any_badge(p_tenant_id text)
RETURNS TABLE (
  profile_id bigint,
  profile_created_at timestamp with time zone,
  display_name text,
  username text,
  roles text[],
  email text,
  comments boolean,
  replies boolean,
  research_updates boolean,
  is_unsubscribed boolean,
  content_reach content_reach,
  badge_ids bigint[]
) 
LANGUAGE plpgsql
SECURITY DEFINER
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

-- RPC function to get profiles by badge IDs, including email from auth.users
CREATE OR REPLACE FUNCTION get_profiles_by_badge_ids(p_badge_ids bigint[], p_tenant_id text)
RETURNS TABLE (
  profile_id bigint,
  profile_created_at timestamp with time zone,
  display_name text,
  username text,
  roles text[],
  email text,
  comments boolean,
  replies boolean,
  research_updates boolean,
  is_unsubscribed boolean,
  content_reach content_reach,
  badge_ids bigint[]
) 
LANGUAGE plpgsql
SECURITY DEFINER
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

-- RPC function to get staff profiles (admin, editor, moderator), including email from auth.users
CREATE OR REPLACE FUNCTION get_staff_profiles(p_tenant_id text)
RETURNS TABLE (
  profile_id bigint,
  profile_created_at timestamp with time zone,
  display_name text,
  username text,
  roles text[],
  email text,
  comments boolean,
  replies boolean,
  research_updates boolean,
  is_unsubscribed boolean,
  content_reach content_reach,
  badge_ids bigint[]
) 
LANGUAGE plpgsql
SECURITY DEFINER
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
