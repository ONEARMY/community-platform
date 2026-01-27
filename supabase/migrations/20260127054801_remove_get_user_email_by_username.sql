-- Remove get_user_email_by_username function
-- This function was only needed during the Firebase to Supabase migration
-- when some profiles didn't have auth_id set. Assuming that all profiles have
-- auth_id, we use get_user_email_by_id instead.

drop function if exists "public"."get_user_email_by_username"(username text);
