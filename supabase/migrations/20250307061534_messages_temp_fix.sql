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