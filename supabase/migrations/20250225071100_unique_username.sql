set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.is_username_available(username text)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
AS $function$
  SELECT NOT EXISTS (SELECT 1 FROM profiles WHERE username = $1);
$function$
;