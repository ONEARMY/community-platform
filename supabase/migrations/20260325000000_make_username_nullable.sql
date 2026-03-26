-- Make username nullable so it can be set later in profile settings instead of at signup
ALTER TABLE profiles ALTER COLUMN username DROP NOT NULL;
ALTER TABLE profiles ALTER COLUMN username DROP DEFAULT;

-- Convert empty string usernames to NULL
UPDATE profiles SET username = NULL WHERE username = '';

-- Update is_username_available to exclude the calling user's own username and ignore NULLs
CREATE OR REPLACE FUNCTION public.is_username_available(username text, exclude_profile_id integer DEFAULT NULL)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
AS $function$
  SELECT NOT EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.username = $1
      AND ($2 IS NULL OR profiles.id != $2)
  );
$function$;

-- Add partial unique index to enforce uniqueness at the DB level (only for non-null usernames per tenant)
DROP INDEX IF EXISTS profiles_username_tenant_id_key;
CREATE UNIQUE INDEX profiles_username_tenant_id_key ON profiles (username, tenant_id) WHERE username IS NOT NULL;
