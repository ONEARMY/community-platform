set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_user_id_by_email(email text)
 RETURNS TABLE(id uuid)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY SELECT au.id FROM auth.users au WHERE au.email = $1;
END;
$function$
;
