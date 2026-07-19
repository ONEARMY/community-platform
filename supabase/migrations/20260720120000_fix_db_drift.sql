-- Fix DB drift: remove columns that were added to tenant_settings but are no longer
-- part of the schema. These were removed from schemas/tenant_settings.sql but no
-- migration existed to drop them from the actual database. See issue #4801.

ALTER TABLE "public"."tenant_settings"
  DROP COLUMN IF EXISTS "color_accent",
  DROP COLUMN IF EXISTS "color_accent_hover",
  DROP COLUMN IF EXISTS "color_primary",
  DROP COLUMN IF EXISTS "color_primary_hover",
  DROP COLUMN IF EXISTS "create_research_roles",
  DROP COLUMN IF EXISTS "show_impact";

-- Fix get_profiles_by_badge_ids: old version had p_tenant_id param that was removed.
-- Drop the old overload (with 2 args) if it still exists from removed migrations.
DROP FUNCTION IF EXISTS public.get_profiles_by_badge_ids(bigint[], text);
DROP FUNCTION IF EXISTS public.get_profiles_with_any_badge(text);
DROP FUNCTION IF EXISTS public.get_staff_profiles(text);

set check_function_bodies = off;

-- Create the corrected functions (without p_tenant_id parameter)
CREATE OR REPLACE FUNCTION public.get_profiles_by_badge_ids(p_badge_ids bigint[])
RETURNS TABLE(
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
    content_reach public.content_reach,
    badge_ids bigint[]
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
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
    WHERE pbr.profile_badge_id = ANY(p_badge_ids);
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_profiles_with_any_badge()
RETURNS TABLE(
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
    content_reach public.content_reach,
    badge_ids bigint[]
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
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
    LEFT JOIN notifications_preferences np ON p.id = np.user_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_staff_profiles()
RETURNS TABLE(
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
    content_reach public.content_reach,
    badge_ids bigint[]
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
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
    WHERE p.roles && ARRAY['admin', 'editor', 'moderator']::text[];
END;
$function$;
-- Drop stale storage.objects RLS policy that was added by a removed migration.
-- This policy does not belong in storage and was not intentional.
DROP POLICY IF EXISTS "tenant_isolation" ON "storage"."objects";

-- Ensure stripe_tier_config exists with correct structure.
-- This table was created by an old migration that was removed from the repo.
-- By declaring it here we make it part of the tracked schema (see schemas/stripe.sql).
CREATE TABLE IF NOT EXISTS "public"."stripe_tier_config" (
    "id" bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "tenant_id" "text" NOT NULL,
    "stripe_price_id" "text" NOT NULL,
    "badge_id" bigint
);

ALTER TABLE "public"."stripe_tier_config"
    ADD CONSTRAINT IF NOT EXISTS "stripe_tier_config_badge_id_fkey"
    FOREIGN KEY ("badge_id") REFERENCES "public"."profile_badges"("id") ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE "public"."stripe_tier_config" ENABLE ROW LEVEL SECURITY;

-- Drop old policy and recreate in canonical form to eliminate diff noise.
DROP POLICY IF EXISTS "tenant_isolation" ON "public"."stripe_tier_config";

CREATE POLICY "tenant_isolation" ON "public"."stripe_tier_config"
    AS PERMISSIVE FOR ALL TO public
    USING (("tenant_id" = ((SELECT current_setting('request.headers'::text, true))::json ->> 'x-tenant-id'::text)));
