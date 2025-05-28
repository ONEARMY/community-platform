CREATE OR REPLACE FUNCTION public.get_user_email_by_profile_id(id int8)
 RETURNS TABLE(email character varying)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY SELECT au.email FROM auth.users au inner join public.profiles p on au.id = p.auth_id WHERE p.id = $1;
END;
$function$
;
